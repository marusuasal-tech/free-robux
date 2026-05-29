const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  closeWindow: () => ipcRenderer.send("close-window"),
  triggerPrank: () => ipcRenderer.send("trigger-prank"),
  onLoadPhoto: (callback) => {
    ipcRenderer.on("load-photo", (event, photoPath) => callback(photoPath));
  },
});
