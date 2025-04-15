const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  getEnvironments: () => ipcRenderer.invoke('get-environments'),
  saveEnvironment: (environment) => ipcRenderer.invoke('save-environment', environment),
  deleteEnvironment: (environmentId) => ipcRenderer.invoke('delete-environment', environmentId)
});