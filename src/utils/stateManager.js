// This utility helps with managing and persisting state between app sessions
// We're using electron-store in the main process, but this provides a cleaner API

export const saveRequest = (requestName, requestConfig) => {
    const savedRequests = getSavedRequests();
    savedRequests[requestName] = requestConfig;
    localStorage.setItem('savedRequests', JSON.stringify(savedRequests));
  };
  
  export const getSavedRequests = () => {
    const savedRequestsJson = localStorage.getItem('savedRequests');
    return savedRequestsJson ? JSON.parse(savedRequestsJson) : {};
  };
  
  export const deleteSavedRequest = (requestName) => {
    const savedRequests = getSavedRequests();
    delete savedRequests[requestName];
    localStorage.setItem('savedRequests', JSON.stringify(savedRequests));
  };
  
  export const getRequestHistory = () => {
    const historyJson = localStorage.getItem('requestHistory');
    return historyJson ? JSON.parse(historyJson) : [];
  };
  
  export const addToHistory = (requestConfig, response) => {
    const history = getRequestHistory();
    
    // Add to beginning of array and limit size
    history.unshift({
      timestamp: new Date().toISOString(),
      request: requestConfig,
      response: {
        status: response.status,
        statusText: response.statusText,
        // We don't store the full response data to avoid localStorage size limits
        // Just store metadata and success/failure
      }
    });
    
    // Limit history size to 50 items
    const limitedHistory = history.slice(0, 50);
    localStorage.setItem('requestHistory', JSON.stringify(limitedHistory));
  };