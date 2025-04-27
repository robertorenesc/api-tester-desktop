// This utility helps with managing and persisting state between app sessions
// We're using electron-store in the main process to store data in the user's home directory

export const saveRequest = async (requestName, requestConfig) => {
  if (window.electronAPI) {
    return await window.electronAPI.saveRequest(requestName, requestConfig);
  } else {
    console.error('Electron API not available');
    return {};
  }
};

export const getSavedRequests = async () => {
  if (window.electronAPI) {
    return await window.electronAPI.getSavedRequests();
  } else {
    console.error('Electron API not available');
    return {};
  }
};

export const deleteSavedRequest = async (requestName) => {
  if (window.electronAPI) {
    return await window.electronAPI.deleteSavedRequest(requestName);
  } else {
    console.error('Electron API not available');
    return {};
  }
};

export const getRequestHistory = async () => {
  if (window.electronAPI) {
    return await window.electronAPI.getRequestHistory();
  } else {
    console.error('Electron API not available');
    return [];
  }
};

export const addToHistory = async (requestConfig, response) => {
  if (window.electronAPI) {
    const historyItem = {
      timestamp: new Date().toISOString(),
      request: requestConfig,
      response: {
        status: response.status,
        statusText: response.statusText,
        // We don't store the full response data to avoid size limits
        // Just store metadata and success/failure
      }
    };
    
    return await window.electronAPI.addToHistory(historyItem);
  } else {
    console.error('Electron API not available');
    return [];
  }
};
