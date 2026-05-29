const {
  app,
  BrowserWindow,
  nativeImage,
  ipcMain,
  dialog,
} = require("electron");
// const { exec } = require("child_process");
const path = require("node:path");
const appIcon = nativeImage.createFromPath(
  path.join(__dirname, "assets/icon.png"),
);
const photoPath = path.join(__dirname, "assets/death_screen.png");

if (require("electron-squirrel-startup")) {
  app.quit();
}

let clickCount = 0;
let mainWindow;
let photoWindow;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    title: "FREE ROBUX",
    icon: appIcon,
    width: 600,
    height: 500,
    resizable: false,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  mainWindow.loadFile(path.join(__dirname, "index.html"));
};

ipcMain.on("close-window", () => {
  if (mainWindow) {
    mainWindow.close();
  }
});

ipcMain.on("trigger-prank", () => {
  clickCount++;

  if (clickCount > 3) {
    // const photoPath = path.join(__dirname, "assets/death_screen.png");
    // exec(`start "" "${photoPath}"`);
    if (photoWindow && !photoWindow.isDestroyed()) {
      photoWindow.close();
    }

    photoWindow = new BrowserWindow({
      title: "FREE ROBUX",
      icon: appIcon,
      fullscreen: true,
      frame: false,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: path.join(__dirname, "preload.js"),
      },
    });
    photoWindow.loadFile(path.join(__dirname, "photo.html"));

    photoWindow.webContents.on("did-finish-load", () => {
      photoWindow.webContents.send("load-photo", photoPath);
    });
  } else {
    dialog.showErrorBox("Oops!", "System file was deleted…");
  }
});

app.whenReady().then(() => {
  createWindow();
});
