import React, { useState, useEffect } from 'react';
import RequestPanel from './components/RequestPanel';
import ResponsePanel from './components/ResponsePanel';
import EnvironmentManager from './components/EnvironmentManager';
import SavedRequests from './components/SavedRequests';
import RequestHistory from './components/RequestHistory';
import SaveRequestModal from './components/SaveRequestModal';
import { makeRequest } from './utils/apiService';
import { addToHistory } from './utils/stateManager';

function App() {
  const [environments, setEnvironments] = useState([]);
  const [activeEnvironment, setActiveEnvironment] = useState(null);
  const [requestConfig, setRequestConfig] = useState({
    method: 'GET',
    url: '',
    params: [],
    headers: [],
    body: '',
  });
  const [response, setResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showEnvironmentManager, setShowEnvironmentManager] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [activeSidebar, setActiveSidebar] = useState(''); // 'saved', 'history', or ''

  useEffect(() => {
    // Load environments from electron store
    const loadEnvironments = async () => {
      if (window.electronAPI) {
        const savedEnvironments = await window.electronAPI.getEnvironments();
        setEnvironments(savedEnvironments);
        if (savedEnvironments.length > 0) {
          setActiveEnvironment(savedEnvironments[0]);
        }
      }
    };
    
    loadEnvironments();
  }, []);

  const handleSendRequest = async () => {
    setIsLoading(true);
    setResponse(null);
    
    try {
      // Replace environment variables in the request
      const processedConfig = processEnvironmentVariables(requestConfig, activeEnvironment);
      const result = await makeRequest(processedConfig);
      setResponse(result);
      
      // Add to history
      try {
        await addToHistory(requestConfig, result);
      } catch (historyError) {
        console.error('Error adding to history:', historyError);
      }
    } catch (error) {
      const errorResponse = {
        status: error.response?.status || 500,
        statusText: error.response?.statusText || 'Error',
        data: error.response?.data || { message: error.message },
        headers: error.response?.headers || {},
        cookies: {},
        error: true
      };
      
      setResponse(errorResponse);
      
      // Add failed request to history too
      try {
        await addToHistory(requestConfig, errorResponse);
      } catch (historyError) {
        console.error('Error adding to history:', historyError);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const processEnvironmentVariables = (config, env) => {
    if (!env || !env.variables) return config;
    
    const variables = env.variables;
    const processed = { ...config };
    
    // Process URL
    processed.url = replaceVariables(processed.url, variables);
    
    // Process headers
    processed.headers = processed.headers.map(header => ({
      key: replaceVariables(header.key, variables),
      value: replaceVariables(header.value, variables),
      enabled: header.enabled
    }));
    
    // Process params
    processed.params = processed.params.map(param => ({
      key: replaceVariables(param.key, variables),
      value: replaceVariables(param.value, variables),
      enabled: param.enabled,
      paramType: param.paramType || 'query'
    }));
    
    // Process body if it's a string
    if (typeof processed.body === 'string') {
      processed.body = replaceVariables(processed.body, variables);
    }
    
    return processed;
  };

  const replaceVariables = (text, variables) => {
    if (!text) return text;
    
    return text.replace(/\{\{([^}]+)\}\}/g, (match, variableName) => {
      const trimmedName = variableName.trim();
      return variables[trimmedName] !== undefined ? variables[trimmedName] : match;
    });
  };

  const handleSaveEnvironment = async (environment) => {
    if (window.electronAPI) {
      const updatedEnvironments = await window.electronAPI.saveEnvironment(environment);
      setEnvironments(updatedEnvironments);
      setActiveEnvironment(environment);
      setShowEnvironmentManager(false);
    }else{
      alert('Not saved');
    }
  };

  const handleDeleteEnvironment = async (environmentId) => {
    if (window.electronAPI) {
      const updatedEnvironments = await window.electronAPI.deleteEnvironment(environmentId);
      setEnvironments(updatedEnvironments);
      if (activeEnvironment && activeEnvironment.id === environmentId) {
        setActiveEnvironment(updatedEnvironments.length > 0 ? updatedEnvironments[0] : null);
      }
    }
  };

  const handleSaveRequest = (saved) => {
    setShowSaveModal(false);
    if (saved) {
      // Optionally show a notification that request was saved
    }
  };

  const toggleSidebar = (sidebarName) => {
    setActiveSidebar(activeSidebar === sidebarName ? '' : sidebarName);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Personal API Tester</h1>
        <div className="toolbar">
          <div className="action-buttons">
            <button onClick={() => toggleSidebar('saved')} className={activeSidebar === 'saved' ? 'active' : ''}>
              Saved
            </button>
            <button onClick={() => toggleSidebar('history')} className={activeSidebar === 'history' ? 'active' : ''}>
              History
            </button>
          </div>
          <div className="environment-selector">
            <select 
              value={activeEnvironment?.id || ''} 
              onChange={(e) => {
                const envId = e.target.value;
                const env = environments.find(e => e.id === envId);
                setActiveEnvironment(env || null);
              }}
            >
              <option value="">No Environment</option>
              {environments.map(env => (
                <option key={env.id} value={env.id}>{env.name}</option>
              ))}
            </select>
            <button onClick={() => setShowEnvironmentManager(true)}>
              Manage Environments
            </button>
          </div>
        </div>
      </header>
      
      <div className="main-content">
        {activeSidebar && (
          <div className="sidebar">
            {activeSidebar === 'saved' && (
              <SavedRequests 
                onSelect={(config) => {
                  setRequestConfig(config);
                  setActiveSidebar('');
                }}
              />
            )}
            
            {activeSidebar === 'history' && (
              <RequestHistory 
                onSelect={(config) => {
                  setRequestConfig(config);
                  setActiveSidebar('');
                }} 
              />
            )}
          </div>
        )}
        
        <div className="request-response-container">
          <RequestPanel 
            config={requestConfig}
            onConfigChange={setRequestConfig}
            onSend={handleSendRequest}
            isLoading={isLoading}
            setShowSaveModal={setShowSaveModal}
          />
          <ResponsePanel response={response} isLoading={isLoading} />
        </div>
      </div>
      
      {showEnvironmentManager && (
        <EnvironmentManager
          environments={environments}
          activeEnvironment={activeEnvironment}
          onSave={handleSaveEnvironment}
          onDelete={handleDeleteEnvironment}
          onClose={() => setShowEnvironmentManager(false)}
        />
      )}
      
      {showSaveModal && (
        <SaveRequestModal
          requestConfig={requestConfig}
          onClose={handleSaveRequest}
        />
      )}
    </div>
  );
}

export default App;
