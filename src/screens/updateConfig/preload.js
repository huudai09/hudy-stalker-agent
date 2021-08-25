const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('Setting', {
  get: () => ipcRenderer.invoke('setting:get'),
  set: (val) => ipcRenderer.invoke('setting:set', val),
});

contextBridge.exposeInMainWorld('App', {
  restart: () => ipcRenderer.invoke('app:restart'),
});
