const { app, BrowserWindow, shell, Menu } = require("electron");
const path = require("path");

// App đơn giản, không cần menu File/Edit/View mặc định của Electron
// (không có tính năng nào dùng tới), giữ giao diện gọn và không gây
// nhầm lẫn cho người dùng cuối.
Menu.setApplicationMenu(null);

let mainWindow = null;

function isExternalUrl(url) {
  try {
    const u = new URL(url);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch (err) {
    return false;
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 820,
    minWidth: 420,
    minHeight: 560,
    title: "AI Signboard Prompt Generator",
    icon: path.join(__dirname, "icons", "icon128.png"),
    backgroundColor: "#14161c", // trùng --bg mặc định (dark) trong panel.css, tránh chớp trắng lúc mở app
    autoHideMenuBar: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      spellcheck: false,
    },
  });

  mainWindow.loadFile(path.join(__dirname, "index.html"));

  // Toàn bộ liên kết ra ngoài (Zalo, quangcaoktd.com, trang liên hệ...) phải
  // mở bằng trình duyệt mặc định của hệ điều hành, không mở cửa sổ Electron
  // mới bên trong app. Áp dụng cho cả window.open() (nút Zalo) và các thẻ
  // <a target="_blank"> (link footer, nút Contact page).
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (isExternalUrl(url)) shell.openExternal(url);
    return { action: "deny" };
  });

  // Phòng vệ thêm: nếu có bất kỳ điều hướng nào cố rời khỏi index.html cục
  // bộ (không nên xảy ra trong luồng bình thường của app), chặn lại và mở
  // bằng trình duyệt ngoài thay vì điều hướng ngay trong cửa sổ ứng dụng.
  mainWindow.webContents.on("will-navigate", (event, url) => {
    if (url === mainWindow.webContents.getURL()) return; // reload trang hiện tại, cho phép
    event.preventDefault();
    if (isExternalUrl(url)) shell.openExternal(url);
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
