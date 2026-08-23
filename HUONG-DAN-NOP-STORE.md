# AI Signboard Prompt Generator — bản Windows Desktop

Đây là bản chuyển đổi từ Chrome extension sang ứng dụng Windows độc lập
(Electron), giữ nguyên toàn bộ tính năng: 7 ngôn ngữ giao diện, chọn loại
hình kinh doanh/biển/phong cách/tông màu (kèm tùy chỉnh), upload ảnh mặt
tiền thật (photo mode), sinh prompt cho ChatGPT/Gemini/Claude/Grok/Copilot,
copy prompt/ảnh/cả hai, lưu và xem lại lịch sử yêu thích, dark/light mode,
nút liên hệ Zalo/quangcaoktd.com.

## 1. Những gì đã thay đổi so với bản extension

Vì app desktop không còn "trang web chủ" để tiêm panel vào, panel giờ
chính là toàn bộ cửa sổ ứng dụng (cửa sổ Windows chuẩn, có thanh tiêu đề),
nên các phần sau đã được **gỡ bỏ** vì không còn cần thiết:

- Cơ chế kéo-thả di chuyển panel và kéo viền để resize (cửa sổ Windows tự
  lo việc di chuyển/resize).
- Nút Maximize/Close tùy chỉnh trong panel (đã có nút Windows chuẩn ở
  thanh tiêu đề).
- Shadow DOM và cơ chế chờ CSS tải xong thủ công (không cần nữa vì
  `panel.css` nằm ngay trong `<head>` của `index.html`, trình duyệt tự
  chặn hiển thị cho tới khi tải xong).
- Toàn bộ `background.js`, `chrome.scripting`, `chrome.tabs`,
  `chrome.runtime.onMessage` (cơ chế bấm icon toolbar để tiêm vào tab —
  không có ý nghĩa trong app standalone).

Đã **sửa 1 lỗi bảo mật** phát hiện trong lúc rà soát: mục lịch sử/yêu
thích trước đây chèn thẳng văn bản người dùng tự gõ (ô "tùy chỉnh") vào
`innerHTML`, có thể bị lợi dụng để chèn mã độc (self-XSS). Đã sửa bằng
cách dựng DOM an toàn (`textContent`/`createElement`), có bài test tự
động xác nhận không còn tái diễn.

`chrome.storage.local` được thay bằng `localStorage` tiêu chuẩn (dữ liệu
vẫn chỉ lưu trên máy người dùng, không gửi đi đâu). `i18n.js` và `data.js`
giữ nguyên 100%, không đổi gì.

## 2. Đã kiểm thử tự động

Đã chạy ứng dụng thật (không phải mô phỏng) và dùng script tự động bấm
qua toàn bộ luồng sử dụng: đổi ngôn ngữ, đổi theme, chọn/tùy chỉnh từng
trường, sinh prompt, upload/xóa ảnh, copy prompt/ảnh, lưu và tải lại lịch
sử, kiểm tra lỗi self-XSS không còn tái diễn, kiểm tra dữ liệu còn nguyên
sau khi tắt/mở lại app. Kết quả: **23/23 bài test đạt, 0 lỗi console**.

## 3. Cấu trúc project

```
app/
  main.js          # tiến trình chính Electron (mở cửa sổ, xử lý link ngoài)
  index.html        # khung HTML, nạp panel.css + i18n.js + data.js + renderer.js
  renderer.js        # toàn bộ logic UI (chuyển thể từ content.js)
  panel.css          # giao diện (chuyển thể từ panel.css bản extension)
  i18n.js / data.js  # dữ liệu ngôn ngữ và danh sách lựa chọn (giữ nguyên)
  icons/, fonts/     # tài nguyên hình ảnh/font
  build/icon.ico     # icon Windows (đã tạo sẵn từ icon extension, 256x256)
  package.json       # cấu hình Electron + electron-builder
  .github/workflows/build-msix.yml  # tự động build file .msix trên Windows thật
```

## 4. Test nhanh trên máy Windows của bạn

Cần cài [Node.js](https://nodejs.org) bản LTS trước (một lần).

```
cd app
npm install
npm start
```

Cửa sổ ứng dụng sẽ mở lên y hệt như bản extension, có thể thao tác thử
ngay.

## 5. File .exe để cài test (đã build sẵn, gửi kèm)

File **`AI Signboard Prompt Generator Setup 1.0.0.exe`** gửi kèm là bản
cài đặt Windows (NSIS) đã build sẵn, tải xuống và chạy để cài thử trên
máy Windows như một ứng dụng bình thường (có thể chọn thư mục cài, tạo
shortcut Desktop/Start Menu, gỡ cài đặt sạch qua Control Panel).

Vì đây là bản build test (chưa qua Microsoft ký lại), Windows SmartScreen
có thể hiện cảnh báo "Windows protected your PC" lần đầu chạy — đây là
điều bình thường với app chưa ký số/chưa qua Store, bấm "More info" →
"Run anyway" để tiếp tục cài. Bản nộp lên Store thật (.msix) sẽ được
Microsoft tự động ký lại nên người dùng cuối sẽ không thấy cảnh báo này.

Muốn tự build lại file exe này (sau khi bạn sửa gì đó):

```
npm run dist:test
```

File kết quả nằm ở `app/dist/*.exe`.

## 6. Build file .msix để nộp Store

**Lưu ý quan trọng đã sửa (23/08):** phiên bản trước của package này thiếu
thư mục `build/appx/`, khiến electron-builder âm thầm dùng icon mặc định
hình nguyên tử của Electron thay vì icon thật của app trên cả 4 vị trí
tile Store (Square44x44, Square150x150, StoreLogo, Wide310x150). Đã bổ
sung đủ 4 file PNG đúng tên/kích thước trong `build/appx/`, tạo từ icon
thật của app, nền màu tối khớp giao diện app (`#14161c`). Nếu bạn đã tải
package cũ và build trước ngày này, hãy tải lại package mới và build lại
để có đúng icon.

Việc đóng gói MSIX cần công cụ Windows SDK thật, nên **khuyến nghị build
trên máy Windows thật hoặc qua GitHub Actions** (đã soạn sẵn workflow),
thay vì build trên máy Linux/Mac.

### Bước 1 — Lấy Package Identity từ Partner Center

**Đã hoàn tất cho package này** — `package.json` trong gói này đã được
điền đúng 3 giá trị lấy từ Partner Center (identityName:
`NguyenBaVinh.AISignboardPromptGenerator`, publisher:
`CN=8FF93BBB-792E-4520-9CD2-90324C9D6532`, publisherDisplayName:
`Nguyen Ba Vinh`). Chỉ cần đọc lại các bước dưới nếu muốn đối chiếu.

1. Đăng nhập [Partner Center](https://partner.microsoft.com/dashboard),
   vào **Apps and games** → **New product** → **MSIX or PWA app**, đặt
   tên "AI Signboard Prompt Generator" và bấm **Reserve product name**.
2. Vào app vừa tạo → **Product management** → **Product identity**, sẽ
   thấy 3 giá trị: **Package/Identity/Name**, **Publisher ID**,
   **Publisher display name**.
3. Mở `app/package.json`, tìm phần `"appx"`, thay 3 dòng
   `REPLACE_WITH_PARTNER_CENTER_...` bằng đúng 3 giá trị vừa lấy được.

### Bước 2 — Build file .msix

**Cách khuyến nghị (GitHub Actions, không cần máy Windows):**

1. Tạo một repo GitHub mới (private cũng được), đẩy toàn bộ thư mục
   `app/` (đã có sẵn file `.github/workflows/build-msix.yml`) lên đó.
2. Vào tab **Actions** của repo → chọn workflow **"Build Windows Store
   package (MSIX)"** → **Run workflow**.
3. Đợi khoảng 2-3 phút, mở lần chạy vừa xong, kéo xuống mục
   **Artifacts**, tải file `msix-package` về (chứa file `.appx` —
   Partner Center chấp nhận trực tiếp file `.appx`, không cần đổi đuôi
   hay chuyển đổi gì thêm).

**Cách khác (có máy Windows thật):** cài Node.js, mở PowerShell tại thư
mục `app/`, chạy `npm install` rồi `npm run dist:store`, file `.appx`
nằm ở `app/dist/`.

## 7. Checklist trước khi nộp Partner Center

Dựa trên Microsoft Store Policies bản mới nhất (v7.19), app này thuộc
diện "sạch" (không thu thập dữ liệu, không quảng cáo, không giao dịch),
chỉ cần chuẩn bị đúng những mục sau:

- [x] **Privacy Policy URL** — đã có, dán đúng URL sau vào ô Privacy
      Policy ở bước Properties khi tạo submission:

      `https://quangcaoktd.com/chinh-sach-bao-mat/#app-windows-ai-signboard`

      **Lưu ý:** trước khi nộp, mở URL này ở chế độ ẩn danh/Ctrl+F5 để
      xác nhận trang thật sự hiển thị đúng nội dung "13. Chính sách
      quyền riêng tư – Ứng dụng Windows AI Signboard Prompt Generator"
      (không chỉ tải được trang, mà phải thấy đúng nội dung mục 13 khi
      cuộn xuống hoặc bấm vào link neo). Nếu trang có cache (Cloudflare,
      plugin cache của WordPress...), nhớ xóa cache sau khi cập nhật nội
      dung, nếu không Microsoft có thể xem phải bản cache cũ chưa có nội
      dung này.
- [ ] **Mô tả Store listing** — nên mở đầu bằng câu làm rõ: đây là công
      cụ soạn prompt để dùng với các nền tảng AI tạo ảnh bên ngoài
      (ChatGPT/Gemini/Claude/Grok/Copilot), bản thân app không tạo ảnh và
      không gọi AI nào cả — tránh bị hiểu nhầm là "live generative AI"
      (điều khoản 11.16) và đúng yêu cầu mô tả chính xác (10.1.1). Có
      thể tái dùng nội dung mô tả 55 ngôn ngữ đã viết cho Chrome/Edge/
      Firefox, chỉ cần đổi "extension" thành "ứng dụng".
- [ ] **Icon Store listing** — ít nhất 1 icon 300×300px (khác với icon
      trong app, đây là icon hiển thị trên trang Store).
- [ ] **Screenshots** — 4-8 ảnh chụp màn hình app đang chạy.
- [ ] **Age rating questionnaire** — điền trong Partner Center, nội dung
      app không có yếu tố nhạy cảm nên sẽ ở mức thấp nhất.
- [ ] **Loại tài khoản** — dùng tài khoản cá nhân (individual) là hợp lệ
      vì tên app không mang tên pháp nhân công ty; chỉ cần chuyển sang
      company account nếu bạn điền publisher name là tên công ty.

## 8. Nộp submission trên Partner Center

1. Vào app đã reserve tên ở Bước 1 → **Start submission**.
2. **Pricing and availability**: chọn miễn phí, thị trường phát hành.
3. **Properties**: điền Category (Productivity/Utilities), Privacy
   Policy URL, thông tin liên hệ.
4. **Age ratings**: điền questionnaire.
5. **Packages**: upload file `.appx` build ở Bước 6.
6. **Store listing**: điền mô tả, upload icon 300×300 + screenshots.
7. **Submission options**: có thể ghi chú cho reviewer rằng app không
   gọi AI trực tiếp, chỉ soạn prompt để copy sang nền tảng khác.
8. Bấm **Submit to the Store**, chờ certification (thường vài ngày làm
   việc).
