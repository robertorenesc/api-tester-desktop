const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // Environment management
  getEnvironments: () => ipcRenderer.invoke('get-environments'),
  saveEnvironment: (environment) => ipcRenderer.invoke('save-environment', environment),
  deleteEnvironment: (environmentId) => ipcRenderer.invoke('delete-environment', environmentId),
  
  // Saved requests management
  getSavedRequests: () => ipcRenderer.invoke('get-saved-requests'),
  saveRequest: (requestName, requestConfig) => ipcRenderer.invoke('save-request', requestName, requestConfig),
  deleteSavedRequest: (requestName) => ipcRenderer.invoke('delete-saved-request', requestName),
  
  // Request history management
  getRequestHistory: () => ipcRenderer.invoke('get-request-history'),
  addToHistory: (historyItem) => ipcRenderer.invoke('add-to-history', historyItem)
});
