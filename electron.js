const { app, protocol, BrowserWindow } = require("electron");
const path = require("path");
const url = require("url");

const buildDir = path.join(__dirname, "out");

/**
 * Create window
 */
function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
  });
  mainWindow.maximize();

  // Load the index.html of the app
  mainWindow.loadURL(
    url.format({
      pathname: "index.html",
      protocol: "file",
      slashes: true,
    })
  );
}

app.whenReady().then(() => {
  protocol.interceptFileProtocol(
    "file",
    (request, callback) => {
      const url = request.url.substr(7);
      callback({ path: path.join(buildDir, url) });
    },
    (err) => {
      if (err) console.error("Failed to register protocol");
    }
  );
  createWindow();

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});
