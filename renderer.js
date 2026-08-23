/* ============================================================
   renderer.js: logic chính của cửa sổ ứng dụng (chuyển thể từ
   content.js của bản Chrome extension, giữ nguyên toàn bộ tính
   năng). Phụ thuộc: i18n.js, data.js (nạp trước renderer.js
   trong index.html).
   ============================================================ */

(function () {
  "use strict";

  // ============================================================
  // Storage: thay thế chrome.storage.local (chỉ có trong extension)
  // bằng localStorage tiêu chuẩn của trình duyệt/Electron. Giữ cùng
  // "hình dạng" API (get theo mảng key + callback, set theo object)
  // để phần logic còn lại của renderer gần như không phải sửa gì.
  // ============================================================
  const storage = {
    get(keys, callback) {
      const result = {};
      keys.forEach((key) => {
        const raw = localStorage.getItem(key);
        if (raw === null) return;
        try {
          result[key] = JSON.parse(raw);
        } catch (err) {
          // Dữ liệu cũ bị hỏng/không phải JSON hợp lệ: bỏ qua an toàn,
          // coi như chưa có giá trị lưu cho key này.
        }
      });
      callback(result);
    },
    // Trả về true/false (thành công/thất bại, ví dụ hết quota) thay vì
    // chrome.runtime.lastError. callback (nếu có) vẫn được gọi để giữ
    // đúng thứ tự thao tác như code gốc (vd renderHistory sau khi lưu).
    set(obj, callback) {
      let ok = true;
      try {
        Object.keys(obj).forEach((key) => {
          localStorage.setItem(key, JSON.stringify(obj[key]));
        });
      } catch (err) {
        ok = false;
      }
      if (callback) callback();
      return ok;
    },
    remove(key) {
      localStorage.removeItem(key);
    },
  };

  const STORAGE_KEY_HISTORY = "signPromptHistory";
  const STORAGE_KEY_LANG = "uiLang";
  const STORAGE_KEY_THEME = "uiTheme";
  const STORAGE_KEY_IMAGE = "storefrontPhoto";

  const PHOTO_MAX_SOURCE_BYTES = 15 * 1024 * 1024; // 15MB giới hạn file gốc trước khi nén
  const PHOTO_MAX_DIMENSION = 1440; // px, resize để giữ dung lượng nhỏ khi lưu vào chrome.storage
  const PHOTO_JPEG_QUALITY = 0.82;

  let currentLang = DEFAULT_LANG;
  let currentTheme = "dark";
  let currentImage = null; // data URL (base64) của ảnh mặt tiền đã upload, hoặc null

  // ============================================================
  // Panel HTML (mount trực tiếp vào #app, không cần shadow DOM vì
  // đây là toàn bộ nội dung cửa sổ, không phải panel nổi trên trang
  // web người khác)
  // ============================================================

  const PANEL_HTML = `
    <div class="panel" id="panelRoot" dir="ltr">
      <div class="topbar" id="topbar">
        <div class="brand">
          <img class="brand-mark" src="icons/icon48.png" alt="" />
          <div class="brand-text">
            <span class="brand-title" id="tAppTitle">AI Signboard Prompt</span>
            <span class="brand-sub" id="tAppSubtitle">by Quốc Đăng Signage, Hanoi</span>
          </div>
        </div>
        <div class="topbar-controls">
          <select id="langSelect" class="lang-select" aria-label="Language"></select>
          <button id="themeToggle" class="icon-btn" type="button" aria-label="Toggle theme">
            <svg id="iconSun" class="theme-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>
            <svg id="iconMoon" class="theme-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>
          </button>
        </div>
      </div>

      <div class="content">
        <div class="panel-body">
        <form id="promptForm" class="form-column">
          <div class="field">
            <label for="brandName" id="lBrandName">Brand name on the sign</label>
            <input type="text" id="brandName" maxlength="40" placeholder="" data-selectable />
          </div>

          <div class="field">
            <label for="storefrontPhotoInput" id="lStorefrontPhoto">Storefront photo (optional)</label>
            <input type="file" id="storefrontPhotoInput" accept="image/png,image/jpeg,image/jpg,image/webp" class="photo-input-hidden" />
            <div class="photo-dropzone" id="photoDropzone" tabindex="0" role="button">
              <img id="photoPreview" class="photo-preview hidden" alt="" />
              <span class="photo-placeholder" id="lPhotoPlaceholder">Click or drag a photo of your storefront here</span>
            </div>
            <div class="photo-actions">
              <button type="button" id="photoChooseBtn" class="secondary-btn secondary-btn--sm">Choose photo</button>
              <button type="button" id="photoCopyBtn" class="secondary-btn secondary-btn--sm hidden">Copy photo</button>
              <button type="button" id="photoRemoveBtn" class="secondary-btn secondary-btn--sm hidden">Remove</button>
            </div>
            <p class="photo-hint" id="photoHint"></p>
            <p class="photo-error hidden" id="photoError"></p>
          </div>

          <div class="field">
            <label for="businessType" id="lBusinessType">Business type</label>
            <select id="businessType"></select>
            <input type="text" id="businessCustom" class="custom-input hidden" maxlength="60" data-selectable />
          </div>

          <div class="field">
            <label for="signType" id="lSignType">Sign type</label>
            <select id="signType"></select>
            <input type="text" id="signCustom" class="custom-input hidden" maxlength="60" data-selectable />
          </div>

          <div class="field-row">
            <div class="field">
              <label for="styleType" id="lStyle">Style</label>
              <select id="styleType"></select>
              <input type="text" id="styleCustom" class="custom-input hidden" maxlength="60" data-selectable />
            </div>
            <div class="field">
              <label for="colorTone" id="lColorTone">Color tone</label>
              <select id="colorTone"></select>
              <input type="text" id="colorCustom" class="custom-input hidden" maxlength="60" data-selectable />
            </div>
          </div>

          <div class="field-row">
            <div class="field">
              <label for="timeOfDay" id="lTimeOfDay">Time of day</label>
              <select id="timeOfDay"></select>
            </div>
            <div class="field">
              <label for="angle" id="lAngle">Camera angle</label>
              <select id="angle"></select>
            </div>
          </div>

          <div class="field-row">
            <div class="field">
              <label for="frontageWidth" id="lFrontageWidth">Storefront width (m)</label>
              <input type="number" id="frontageWidth" min="1" max="50" placeholder="5" data-selectable />
            </div>
            <div class="field">
              <label for="platformSelect" id="lPlatform">AI platform</label>
              <select id="platformSelect"></select>
            </div>
          </div>
        </form>

        <div class="results-column">
        <section class="lightbox-panel" aria-live="polite">
          <div class="lightbox-label" id="lPromptTitle">PROMPT</div>
          <span id="photoModeBadge" class="photo-mode-badge hidden"><svg class="photo-mode-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 8h3l1.5-2h7L17 8h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"/><circle cx="12" cy="14" r="3.5"/></svg><span id="photoModeBadgeText"></span></span>
          <p id="promptOutput" class="prompt-text" data-selectable>Choose the options above to generate a prompt…</p>
          <div class="lightbox-actions">
            <button id="copyBtn" class="copy-btn" type="button">Copy Prompt</button>
            <button id="copyTextOnlyBtn" class="copy-btn copy-btn--ghost-sm hidden" type="button">Copy Prompt</button>
            <button id="copyPhotoBtn" class="copy-btn copy-btn--ghost-sm hidden" type="button">Copy Photo</button>
          </div>
          <span id="copyFeedback" class="copy-feedback" aria-live="polite"></span>
          <p class="photo-copy-note hidden" id="photoCopyNote"></p>
        </section>

        <details class="negative-panel">
          <summary id="lNegativeSummary">Suggested negative prompt</summary>
          <p id="negativeOutput" class="negative-text" data-selectable></p>
          <button id="copyNegBtn" class="copy-btn copy-btn--ghost" type="button">Copy Negative Prompt</button>
        </details>

        <button id="saveFavBtn" class="secondary-btn" type="button">☆ Save to favorites</button>

        <details class="history-panel" id="historyPanel">
          <summary><span id="lFavoritesSummary">Saved favorites</span> (<span id="historyCount">0</span>)</summary>
          <ul id="historyList" class="history-list"></ul>
        </details>
        </div>
        </div>

        <section class="cta-panel">
          <p class="cta-text" id="ctaText">Like this concept? Get a real quote.</p>
          <div class="cta-buttons">
            <button id="ctaZalo" class="cta-btn cta-btn--zalo" type="button">Chat on Zalo</button>
            <a id="ctaContact" class="cta-btn cta-btn--outline" href="https://quangcaoktd.com/lien-he/" target="_blank" rel="noopener">Contact page</a>
          </div>
        </section>
      </div>

      <div class="footer">
        <a id="footerHomeLink" href="https://quangcaoktd.com/" target="_blank" rel="noopener">quangcaoktd.com</a>
        <span class="dot">·</span>
        <span id="footerHotlineLabel">Hotline/Zalo</span>
        <span>&nbsp;0987.477.689</span>
      </div>
    </div>
  `;

  document.getElementById("app").innerHTML = PANEL_HTML;

  const els = {
    panelRoot: document.getElementById("panelRoot"),
    topbar: document.getElementById("topbar"),
    langSelect: document.getElementById("langSelect"),
    themeToggle: document.getElementById("themeToggle"),
    brandName: document.getElementById("brandName"),
    businessType: document.getElementById("businessType"),
    businessCustom: document.getElementById("businessCustom"),
    signType: document.getElementById("signType"),
    signCustom: document.getElementById("signCustom"),
    styleType: document.getElementById("styleType"),
    styleCustom: document.getElementById("styleCustom"),
    colorTone: document.getElementById("colorTone"),
    colorCustom: document.getElementById("colorCustom"),
    timeOfDay: document.getElementById("timeOfDay"),
    angle: document.getElementById("angle"),
    frontageWidth: document.getElementById("frontageWidth"),
    platformSelect: document.getElementById("platformSelect"),
    storefrontPhotoInput: document.getElementById("storefrontPhotoInput"),
    photoDropzone: document.getElementById("photoDropzone"),
    photoPreview: document.getElementById("photoPreview"),
    photoChooseBtn: document.getElementById("photoChooseBtn"),
    photoCopyBtn: document.getElementById("photoCopyBtn"),
    photoRemoveBtn: document.getElementById("photoRemoveBtn"),
    photoHint: document.getElementById("photoHint"),
    photoError: document.getElementById("photoError"),
    photoModeBadge: document.getElementById("photoModeBadge"),
    photoModeBadgeText: document.getElementById("photoModeBadgeText"),
    promptOutput: document.getElementById("promptOutput"),
    negativeOutput: document.getElementById("negativeOutput"),
    copyBtn: document.getElementById("copyBtn"),
    copyTextOnlyBtn: document.getElementById("copyTextOnlyBtn"),
    copyPhotoBtn: document.getElementById("copyPhotoBtn"),
    copyNegBtn: document.getElementById("copyNegBtn"),
    copyFeedback: document.getElementById("copyFeedback"),
    photoCopyNote: document.getElementById("photoCopyNote"),
    saveFavBtn: document.getElementById("saveFavBtn"),
    historyList: document.getElementById("historyList"),
    historyCount: document.getElementById("historyCount"),
    ctaZalo: document.getElementById("ctaZalo"),
    ctaContact: document.getElementById("ctaContact"),
    ctaText: document.getElementById("ctaText"),
  };

  const CUSTOM_FIELDS = [
    { key: "business", select: els.businessType, input: els.businessCustom, list: BUSINESS_TYPES },
    { key: "sign", select: els.signType, input: els.signCustom, list: SIGN_TYPES },
    { key: "style", select: els.styleType, input: els.styleCustom, list: STYLES },
    { key: "color", select: els.colorTone, input: els.colorCustom, list: COLOR_TONES },
  ];

  // ============================================================
  // Helpers
  // ============================================================
  function findByValue(list, value) {
    return list.find((i) => i.value === value) || list[0];
  }

  function sortByLabel(list, lang) {
    return [...list].sort((a, b) => {
      const la = a.label[lang] || a.label[DEFAULT_LANG];
      const lb = b.label[lang] || b.label[DEFAULT_LANG];
      return la.localeCompare(lb, lang);
    });
  }

  function fillSelect(selectEl, items, lang, { sort = false, allowCustom = false } = {}) {
    const previous = selectEl.value;
    const list = sort ? sortByLabel(items, lang) : items;
    let html = list
      .map((item) => `<option value="${item.value}">${item.label[lang] || item.label[DEFAULT_LANG]}</option>`)
      .join("");
    if (allowCustom) {
      html += `<option value="${CUSTOM_VALUE}">${t("customOption", lang)}</option>`;
    }
    selectEl.innerHTML = html;
    if (previous && (list.some((i) => i.value === previous) || previous === CUSTOM_VALUE)) {
      selectEl.value = previous;
    }
  }

  function isInteractiveTarget(el) {
    return !!(el && el.closest && el.closest('input, select, button, a, textarea, [contenteditable="true"]'));
  }

  // ============================================================
  // Language switching
  // ============================================================
  function populateLangSelect() {
    // Không dùng emoji cờ quốc gia: một số hệ điều hành (đặc biệt Windows)
    // không có font hiển thị cờ, khiến emoji bị hiển thị thành chữ viết tắt
    // (vd "us", "vn") ngay trong dropdown, gây rối mắt. Chỉ hiển thị tên
    // ngôn ngữ cho gọn và nhất quán trên mọi hệ điều hành.
    els.langSelect.innerHTML = LANGUAGES.map((l) => `<option value="${l.code}">${l.name}</option>`).join("");
  }

  function applyLanguage(lang) {
    currentLang = lang;
    const meta = LANGUAGES.find((l) => l.code === lang) || LANGUAGES[0];
    els.panelRoot.setAttribute("dir", meta.dir);
    els.langSelect.value = lang;
    els.langSelect.setAttribute("aria-label", t("languageLabel", lang));

    document.getElementById("tAppTitle").textContent = t("appTitle", lang);
    document.getElementById("tAppSubtitle").textContent = t("appSubtitle", lang);
    document.getElementById("lBrandName").textContent = t("brandNameLabel", lang);
    els.brandName.placeholder = t("brandNamePlaceholder", lang);
    document.getElementById("lBusinessType").textContent = t("businessTypeLabel", lang);
    document.getElementById("lSignType").textContent = t("signTypeLabel", lang);
    document.getElementById("lStyle").textContent = t("styleLabel", lang);
    document.getElementById("lColorTone").textContent = t("colorToneLabel", lang);
    document.getElementById("lTimeOfDay").textContent = t("timeOfDayLabel", lang);
    document.getElementById("lAngle").textContent = t("angleLabel", lang);
    document.getElementById("lFrontageWidth").textContent = t("frontageWidthLabel", lang);
    document.getElementById("lPlatform").textContent = t("platformLabel", lang);
    document.getElementById("lStorefrontPhoto").textContent = t("storefrontPhotoLabel", lang);
    document.getElementById("lPhotoPlaceholder").textContent = t("photoPlaceholder", lang);
    els.photoCopyBtn.textContent = t("photoCopy", lang);
    els.photoRemoveBtn.textContent = t("photoRemove", lang);
    document.getElementById("lPromptTitle").textContent = t("promptPanelTitle", lang);
    document.getElementById("lNegativeSummary").textContent = t("negativePromptSummary", lang);
    document.getElementById("lFavoritesSummary").textContent = t("favoritesSummary", lang);
    els.copyBtn.textContent = t("copyPrompt", lang);
    els.copyTextOnlyBtn.textContent = t("copyPrompt", lang);
    els.copyPhotoBtn.textContent = t("photoCopy", lang);
    els.photoCopyNote.textContent = t("photoCopyNote", lang);
    els.copyNegBtn.textContent = t("copyNegative", lang);
    els.saveFavBtn.textContent = t("saveFavorite", lang);
    els.ctaText.textContent = t("ctaText", lang);
    els.ctaZalo.textContent = t("ctaZalo", lang);
    els.ctaContact.textContent = t("ctaContact", lang);
    document.getElementById("footerHotlineLabel").textContent = t("footerHotline", lang);

    [els.businessCustom, els.signCustom, els.styleCustom, els.colorCustom].forEach((inp) => {
      inp.placeholder = t("customPlaceholder", lang);
    });

    fillSelect(els.businessType, BUSINESS_TYPES, lang, { sort: true, allowCustom: true });
    fillSelect(els.signType, SIGN_TYPES, lang, { sort: true, allowCustom: true });
    fillSelect(els.styleType, STYLES, lang, { sort: true, allowCustom: true });
    fillSelect(els.colorTone, COLOR_TONES, lang, { sort: true, allowCustom: true });
    fillSelect(els.timeOfDay, TIME_OF_DAY, lang, { sort: false });
    fillSelect(els.angle, ANGLES, lang, { sort: false });
    fillSelect(els.platformSelect, PLATFORMS, lang, { sort: false });

    CUSTOM_FIELDS.forEach(updateCustomVisibility);
    updateThemeButtonLabel();
    setPhotoUI(!!currentImage);
    render();
    renderHistory();
  }

  // ============================================================
  // Theme switching
  // ============================================================
  function applyTheme(theme) {
    currentTheme = theme;
    document.documentElement.setAttribute("data-theme", theme);
    updateThemeButtonLabel();
  }

  function updateThemeButtonLabel() {
    const label = currentTheme === "light" ? t("themeToggleToDark", currentLang) : t("themeToggleToLight", currentLang);
    els.themeToggle.setAttribute("aria-label", label);
    els.themeToggle.setAttribute("title", label);
  }

  els.themeToggle.addEventListener("click", () => {
    const next = currentTheme === "dark" ? "light" : "dark";
    applyTheme(next);
    storage.set({ [STORAGE_KEY_THEME]: next });
  });

  els.langSelect.addEventListener("change", () => {
    const lang = els.langSelect.value;
    applyLanguage(lang);
    storage.set({ [STORAGE_KEY_LANG]: lang });
  });

  // ============================================================
  // Custom-input toggle for business/sign/style/color
  // ============================================================
  function updateCustomVisibility(field) {
    const isCustom = field.select.value === CUSTOM_VALUE;
    field.input.classList.toggle("hidden", !isCustom);
  }

  CUSTOM_FIELDS.forEach((field) => {
    field.select.addEventListener("change", () => {
      updateCustomVisibility(field);
      if (field.key === "business") applyBusinessDefaults();
      render();
    });
    field.input.addEventListener("input", render);
  });

  // ============================================================
  // Tự động chọn Sign type / Style / Color tone / Time of day /
  // Camera angle sao cho phù hợp nhất khi người dùng chọn Business type.
  // Logic khác nhau tuỳ có ảnh thật (photo mode) hay không:
  //  - Không có ảnh: áp dụng đủ cả Time of day + Camera angle theo gợi ý
  //    riêng cho từng ngành (tạo cảnh hoàn toàn mới nên góc máy quan trọng).
  //  - Có ảnh thật: bỏ qua Camera angle (đã khoá, lấy theo ảnh thật), Time
  //    of day luôn về "Ban ngày" vì hầu hết ảnh thật chụp ban ngày, và loại
  //    biển dùng bản thay thế (photoSignType) nếu có, để phù hợp hơn với
  //    việc "thêm biển vào ảnh thật" thay vì loại biển chỉ hợp khi vẽ mới.
  // ============================================================
  function applyBusinessDefaults() {
    const bizValue = els.businessType.value;
    if (bizValue === CUSTOM_VALUE) return; // "Nhập tùy chỉnh": không có gợi ý tự động
    const d = BUSINESS_TYPE_DEFAULTS[bizValue];
    if (!d) return;

    const signValue = currentImage && d.photoSignType ? d.photoSignType : d.signType;
    if (signValue) {
      els.signType.value = signValue;
      updateCustomVisibility(CUSTOM_FIELDS[1]);
    }
    if (d.style) {
      els.styleType.value = d.style;
      updateCustomVisibility(CUSTOM_FIELDS[2]);
    }
    if (d.colorTone) {
      els.colorTone.value = d.colorTone;
      updateCustomVisibility(CUSTOM_FIELDS[3]);
    }
    els.timeOfDay.value = currentImage ? "ngay" : d.timeOfDay || "ngay";
    if (!currentImage && d.angle) {
      els.angle.value = d.angle;
    }
  }

  // ============================================================
  // Prompt-building
  // ============================================================
  function resolveField(field) {
    if (field.select.value === CUSTOM_VALUE) {
      return { isCustom: true, custom: field.input.value.trim(), item: null };
    }
    return { isCustom: false, custom: "", item: findByValue(field.list, field.select.value) };
  }

  function getSelection() {
    return {
      business: resolveField(CUSTOM_FIELDS[0]),
      sign: resolveField(CUSTOM_FIELDS[1]),
      style: resolveField(CUSTOM_FIELDS[2]),
      color: resolveField(CUSTOM_FIELDS[3]),
      time: findByValue(TIME_OF_DAY, els.timeOfDay.value),
      angle: findByValue(ANGLES, els.angle.value),
      width: els.frontageWidth.value ? Number(els.frontageWidth.value) : null,
      brand: els.brandName.value.trim(),
      platform: findByValue(PLATFORMS, els.platformSelect.value),
    };
  }

  function displayLabel(field) {
    return field.isCustom ? field.custom : field.item.label[currentLang];
  }

  function render() {
    const sel = getSelection();
    const customFields = [sel.business, sel.sign, sel.style, sel.color];
    const hasCustom = customFields.some((f) => f.isCustom);
    const hasEmptyCustom = customFields.some((f) => f.isCustom && f.custom.length === 0);

    els.negativeOutput.textContent = currentImage ? NEGATIVE_PROMPT_PHOTO_EN : NEGATIVE_PROMPT_EN;

    if (hasEmptyCustom) {
      els.promptOutput.innerHTML = `<span class="prompt-hint">${t("promptNeedsCustomInput", currentLang)}</span>`;
      els.copyBtn.disabled = true;
      return;
    }
    els.copyBtn.disabled = false;

    const lang = hasCustom ? currentLang : "en";
    const pick = (f) => (f.isCustom ? f.custom : hasCustom ? f.item.label[currentLang] : f.item.en);
    const p = {
      business: pick(sel.business),
      sign: pick(sel.sign),
      style: pick(sel.style),
      color: pick(sel.color),
      time: hasCustom ? sel.time.label[currentLang] : sel.time.en,
      angle: hasCustom ? sel.angle.label[currentLang] : sel.angle.en,
      width: sel.width,
      brand: sel.brand,
    };
    els.promptOutput.textContent = currentImage
      ? buildPhotoPromptForLang(sel.platform.format, p, lang)
      : buildPromptForLang(sel.platform.format, p, lang);
  }

  [els.brandName, els.timeOfDay, els.angle, els.frontageWidth, els.platformSelect].forEach((el) =>
    el.addEventListener("input", render)
  );

  // ============================================================
  // Copy to clipboard
  // ============================================================
  async function copyText(text, feedbackEl) {
    try {
      await navigator.clipboard.writeText(text);
      if (feedbackEl) {
        feedbackEl.textContent = t("copied", currentLang);
        setTimeout(() => (feedbackEl.textContent = ""), 1800);
      }
      return true;
    } catch (err) {
      if (feedbackEl) feedbackEl.textContent = t("copyFailed", currentLang);
      return false;
    }
  }

  // Trình duyệt (Chrome) chỉ hỗ trợ ổn định định dạng ảnh "image/png" khi
  // ghi vào clipboard qua Async Clipboard API, nên ảnh JPEG đã nén để lưu
  // trữ cần được chuyển sang PNG tại thời điểm copy (không ảnh hưởng tới
  // ảnh đã lưu trong storage).
  function dataUrlToPngBlob(dataUrl) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          canvas.width = img.naturalWidth || img.width;
          canvas.height = img.naturalHeight || img.height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0);
          canvas.toBlob((blob) => {
            if (blob) resolve(blob);
            else reject(new Error("toBlob-failed"));
          }, "image/png");
        } catch (err) {
          reject(err);
        }
      };
      img.onerror = () => reject(new Error("image-decode-failed"));
      img.src = dataUrl;
    });
  }

  function clipboardSupportsMultiWrite() {
    return typeof ClipboardItem !== "undefined" && !!(navigator.clipboard && navigator.clipboard.write);
  }

  // Copy đồng thời văn bản prompt + ảnh mặt tiền vào cùng một mục clipboard,
  // để khi dán (Ctrl+V) vào ô chat của AI, cả chữ và ảnh cùng được dán ra.
  async function copyPromptWithImage(text, imageDataUrl, feedbackEl) {
    if (!clipboardSupportsMultiWrite()) return false;
    try {
      const pngBlob = await dataUrlToPngBlob(imageDataUrl);
      const textBlob = new Blob([text], { type: "text/plain" });
      const item = new ClipboardItem({ "text/plain": textBlob, "image/png": pngBlob });
      await navigator.clipboard.write([item]);
      if (feedbackEl) {
        feedbackEl.textContent = t("copiedWithPhoto", currentLang);
        setTimeout(() => (feedbackEl.textContent = ""), 2200);
      }
      return true;
    } catch (err) {
      return false;
    }
  }

  els.copyBtn.addEventListener("click", async () => {
    if (els.copyBtn.disabled) return;
    const text = els.promptOutput.textContent;
    if (currentImage) {
      const bundled = await copyPromptWithImage(text, currentImage, els.copyFeedback);
      if (!bundled) {
        // Trình duyệt không hỗ trợ copy nhiều định dạng cùng lúc, hoặc lỗi khi
        // xử lý ảnh -> vẫn đảm bảo copy được phần chữ, kèm thông báo rõ ràng.
        await copyText(text, null);
        if (els.copyFeedback) {
          els.copyFeedback.textContent = t("photoCopyBundleFailed", currentLang);
          setTimeout(() => (els.copyFeedback.textContent = ""), 3200);
        }
      }
      return;
    }
    copyText(text, els.copyFeedback);
  });
  els.copyTextOnlyBtn.addEventListener("click", () => {
    if (els.copyBtn.disabled) return;
    copyText(els.promptOutput.textContent, els.copyFeedback);
  });
  els.copyNegBtn.addEventListener("click", () => copyText(els.negativeOutput.textContent, null));

  // ============================================================
  // Storefront photo upload (optional "photo mode")
  // ============================================================
  function showPhotoError(key) {
    els.photoError.textContent = t(key, currentLang);
    els.photoError.classList.remove("hidden");
  }
  function clearPhotoError() {
    els.photoError.textContent = "";
    els.photoError.classList.add("hidden");
  }

  function updatePhotoHint() {
    els.photoHint.textContent = t("photoHintDefault", currentLang);
  }

  function updatePhotoModeBadge() {
    if (currentImage) {
      els.photoModeBadgeText.textContent = t("photoModeBadge", currentLang);
      els.photoModeBadge.classList.remove("hidden");
    } else {
      els.photoModeBadge.classList.add("hidden");
    }
  }

  function updateAngleAvailability() {
    els.angle.disabled = !!currentImage;
    els.angle.title = currentImage ? t("angleDisabledHint", currentLang) : "";
    els.angle.classList.toggle("field-disabled", !!currentImage);
  }

  function setPhotoUI(hasImage) {
    els.photoPreview.classList.toggle("hidden", !hasImage);
    els.photoDropzone.classList.toggle("has-photo", hasImage);
    els.photoChooseBtn.textContent = t(hasImage ? "photoChange" : "photoChoose", currentLang);
    els.photoCopyBtn.classList.toggle("hidden", !hasImage);
    els.photoRemoveBtn.classList.toggle("hidden", !hasImage);
    els.copyBtn.textContent = t(hasImage ? "copyPromptPhoto" : "copyPrompt", currentLang);
    els.copyTextOnlyBtn.textContent = t("copyPrompt", currentLang);
    els.copyTextOnlyBtn.classList.toggle("hidden", !hasImage);
    els.copyPhotoBtn.textContent = t("photoCopy", currentLang);
    els.copyPhotoBtn.classList.toggle("hidden", !hasImage);
    els.photoCopyNote.classList.toggle("hidden", !hasImage);
    updatePhotoHint();
    updatePhotoModeBadge();
    updateAngleAvailability();
  }

  // Resize + nén ảnh về JPEG để giữ dung lượng nhỏ trước khi lưu vào
  // chrome.storage.local (tránh vượt hạn mức lưu trữ của extension).
  function compressImage(dataUrl) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        try {
          let { width, height } = img;
          if (width > PHOTO_MAX_DIMENSION || height > PHOTO_MAX_DIMENSION) {
            const scale = PHOTO_MAX_DIMENSION / Math.max(width, height);
            width = Math.round(width * scale);
            height = Math.round(height * scale);
          }
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL("image/jpeg", PHOTO_JPEG_QUALITY));
        } catch (err) {
          reject(err);
        }
      };
      img.onerror = () => reject(new Error("image-decode-failed"));
      img.src = dataUrl;
    });
  }

  function readFileAsDataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error("file-read-failed"));
      reader.readAsDataURL(file);
    });
  }

  async function handlePhotoFile(file) {
    clearPhotoError();
    if (!file) return;
    if (!/^image\/(png|jpe?g|webp)$/i.test(file.type)) {
      showPhotoError("photoErrorType");
      return;
    }
    if (file.size > PHOTO_MAX_SOURCE_BYTES) {
      showPhotoError("photoErrorSize");
      return;
    }
    try {
      const rawDataUrl = await readFileAsDataUrl(file);
      const compressed = await compressImage(rawDataUrl);
      currentImage = compressed;
      els.photoPreview.src = compressed;
      setPhotoUI(true);
      render();
      const ok = storage.set({ [STORAGE_KEY_IMAGE]: compressed });
      if (!ok) showPhotoError("photoErrorStorage");
    } catch (err) {
      showPhotoError("photoErrorRead");
    }
  }

  els.photoChooseBtn.addEventListener("click", () => els.storefrontPhotoInput.click());
  els.photoDropzone.addEventListener("click", (e) => {
    if (isInteractiveTarget(e.target)) return;
    els.storefrontPhotoInput.click();
  });
  els.photoDropzone.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      els.storefrontPhotoInput.click();
    }
  });
  els.storefrontPhotoInput.addEventListener("change", () => {
    const file = els.storefrontPhotoInput.files && els.storefrontPhotoInput.files[0];
    handlePhotoFile(file);
    els.storefrontPhotoInput.value = "";
  });

  ["dragenter", "dragover"].forEach((evt) =>
    els.photoDropzone.addEventListener(evt, (e) => {
      e.preventDefault();
      els.photoDropzone.classList.add("drag-over");
    })
  );
  ["dragleave", "drop"].forEach((evt) =>
    els.photoDropzone.addEventListener(evt, (e) => {
      e.preventDefault();
      els.photoDropzone.classList.remove("drag-over");
    })
  );
  els.photoDropzone.addEventListener("drop", (e) => {
    const file = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
    if (file) handlePhotoFile(file);
  });

  els.photoRemoveBtn.addEventListener("click", () => {
    currentImage = null;
    els.photoPreview.src = "";
    clearPhotoError();
    setPhotoUI(false);
    render();
    storage.remove(STORAGE_KEY_IMAGE);
  });

  // Dùng chung cho cả 2 nút "Copy Photo" (trong khu vực upload và trong hàng
  // nút copy prompt): copy ảnh nguyên vẹn (đã nén 1 lần khi upload) vào
  // clipboard, không cần hỏi lại người dùng gì thêm.
  async function copyPhotoToClipboard(buttonEl) {
    if (!currentImage) return;
    const original = t("photoCopy", currentLang);
    try {
      const pngBlob = await dataUrlToPngBlob(currentImage);
      await navigator.clipboard.write([new ClipboardItem({ "image/png": pngBlob })]);
      buttonEl.textContent = t("photoCopied", currentLang);
    } catch (err) {
      buttonEl.textContent = t("photoCopyFailed", currentLang);
    }
    setTimeout(() => (buttonEl.textContent = original), 1800);
  }

  els.photoCopyBtn.addEventListener("click", () => copyPhotoToClipboard(els.photoCopyBtn));
  els.copyPhotoBtn.addEventListener("click", () => copyPhotoToClipboard(els.copyPhotoBtn));

  // ============================================================
  // Favorites / history
  // ============================================================
  function loadHistory(callback) {
    storage.get([STORAGE_KEY_HISTORY], (result) => callback(result[STORAGE_KEY_HISTORY] || []));
  }

  function renderHistory() {
    loadHistory((items) => {
      els.historyCount.textContent = items.length;
      if (items.length === 0) {
        els.historyList.innerHTML = `<li class="history-empty">${t("emptyHistory", currentLang)}</li>`;
        return;
      }
      els.historyList.replaceChildren();
      items
        .slice()
        .reverse()
        .forEach((item) => {
          const s = item.selection;
          const businessLabel = s.business === CUSTOM_VALUE ? s.businessCustom : findByValue(BUSINESS_TYPES, s.business).label[currentLang];
          const signLabel = s.sign === CUSTOM_VALUE ? s.signCustom : findByValue(SIGN_TYPES, s.sign).label[currentLang];
          const styleLabel = s.style === CUSTOM_VALUE ? s.styleCustom : findByValue(STYLES, s.style).label[currentLang];
          const platformLabel = findByValue(PLATFORMS, s.platform).label[currentLang];
          const li = document.createElement("li");
          li.className = "history-item";
          // Dùng textContent/createElement thay vì innerHTML: businessLabel/
          // signLabel/styleLabel có thể là văn bản người dùng tự gõ (tùy chỉnh),
          // chèn thẳng vào innerHTML sẽ tạo lỗ hổng self-XSS nếu người dùng gõ
          // thẻ HTML/script vào ô tùy chỉnh.
          li.append(document.createTextNode(`${businessLabel} · ${signLabel} · ${styleLabel}`));
          const meta = document.createElement("span");
          meta.className = "h-meta";
          meta.textContent = `${platformLabel} · ${item.savedAt}`;
          li.appendChild(meta);
          li.addEventListener("click", () => applySelection(s));
          els.historyList.appendChild(li);
        });
    });
  }

  function applySelection(s) {
    els.businessType.value = s.business;
    els.businessCustom.value = s.businessCustom || "";
    els.signType.value = s.sign;
    els.signCustom.value = s.signCustom || "";
    els.styleType.value = s.style;
    els.styleCustom.value = s.styleCustom || "";
    els.colorTone.value = s.color;
    els.colorCustom.value = s.colorCustom || "";
    els.timeOfDay.value = s.time;
    els.angle.value = s.angle;
    els.frontageWidth.value = s.width || "";
    els.brandName.value = s.brand || "";
    els.platformSelect.value = s.platform;
    CUSTOM_FIELDS.forEach(updateCustomVisibility);
    render();
  }

  els.saveFavBtn.addEventListener("click", () => {
    const sel = getSelection();
    const customFields = [sel.business, sel.sign, sel.style, sel.color];
    if (customFields.some((f) => f.isCustom && f.custom.length === 0)) return; // chưa hợp lệ, không lưu

    const entry = {
      savedAt: new Date().toLocaleDateString(currentLang),
      selection: {
        business: sel.business.isCustom ? CUSTOM_VALUE : sel.business.item.value,
        businessCustom: sel.business.isCustom ? sel.business.custom : "",
        sign: sel.sign.isCustom ? CUSTOM_VALUE : sel.sign.item.value,
        signCustom: sel.sign.isCustom ? sel.sign.custom : "",
        style: sel.style.isCustom ? CUSTOM_VALUE : sel.style.item.value,
        styleCustom: sel.style.isCustom ? sel.style.custom : "",
        color: sel.color.isCustom ? CUSTOM_VALUE : sel.color.item.value,
        colorCustom: sel.color.isCustom ? sel.color.custom : "",
        time: sel.time.value,
        angle: sel.angle.value,
        width: sel.width,
        brand: sel.brand,
        platform: sel.platform.value,
      },
    };

    loadHistory((items) => {
      items.push(entry);
      const trimmed = items.slice(-20);
      storage.set({ [STORAGE_KEY_HISTORY]: trimmed }, renderHistory);
    });
  });

  // ============================================================
  // CTA
  // ============================================================
  els.ctaZalo.addEventListener("click", async () => {
    const sel = getSelection();
    const messageFn = UI_STRINGS.ctaMessage[currentLang] || UI_STRINGS.ctaMessage[DEFAULT_LANG];
    const message = messageFn({
      sign: displayLabel(sel.sign) || "-",
      style: displayLabel(sel.style) || "-",
      color: displayLabel(sel.color) || "-",
      width: sel.width,
      brand: sel.brand,
    });
    await copyText(message, null);
    const original = t("ctaZalo", currentLang);
    els.ctaZalo.textContent = t("ctaZaloSending", currentLang);
    window.open("https://zalo.me/0987477689", "_blank");
    setTimeout(() => (els.ctaZalo.textContent = original), 2200);
  });

  // ============================================================
  // Init
  // ============================================================
  populateLangSelect();

  storage.get([STORAGE_KEY_LANG, STORAGE_KEY_THEME, STORAGE_KEY_IMAGE], (result) => {
    const savedLang = result[STORAGE_KEY_LANG];
    const savedTheme = result[STORAGE_KEY_THEME];
    const savedImage = result[STORAGE_KEY_IMAGE];
    const initialLang = LANGUAGES.some((l) => l.code === savedLang) ? savedLang : DEFAULT_LANG;
    const initialTheme = savedTheme === "light" ? "light" : "dark";

    if (typeof savedImage === "string" && savedImage.startsWith("data:image/")) {
      currentImage = savedImage;
      els.photoPreview.src = savedImage;
    }

    applyTheme(initialTheme);
    applyLanguage(initialLang);
  });
})();
