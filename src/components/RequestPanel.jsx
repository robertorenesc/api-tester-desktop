import React, { useState } from 'react';
import HeadersEditor from './HeadersEditor';
import JsonEditor from './JsonEditor';

const RequestPanel = ({ config, onConfigChange, onSend, isLoading }) => {
  const [activeTab, setActiveTab] = useState('params');
  
  const handleMethodChange = (e) => {
    onConfigChange({ ...config, method: e.target.value });
  };
  
  const handleUrlChange = (e) => {
    onConfigChange({ ...config, url: e.target.value });
  };
  
  const handleParamsChange = (params) => {
    onConfigChange({ ...config, params });
  };
  
  const handleHeadersChange = (headers) => {
    onConfigChange({ ...config, headers });
  };
  
  const handleBodyChange = (body) => {
    onConfigChange({ ...config, body });
  };
  
  const buildUrl = () => {
    try {
      const url = new URL(config.url);
      
      // Clear existing query parameters
      url.search = '';
      
      // Add enabled query parameters
      config.params.forEach(param => {
        if (param.enabled && param.key) {
          url.searchParams.append(param.key, param.value || '');
        }
      });
      
      return url.toString();
    } catch (e) {
      // If URL is invalid, just return the raw URL
      return config.url;
    }
  };

  return (
    <div className="panel request-panel">
      <div className="panel-header">
        <h2>Request</h2>
      </div>
      
      <div className="request-url-container">
        <div className="input-group">
          <select value={config.method} onChange={handleMethodChange}>
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="DELETE">DELETE</option>
            <option value="PATCH">PATCH</option>
            <option value="HEAD">HEAD</option>
            <option value="OPTIONS">OPTIONS</option>
          </select>
          <input 
            type="text" 
            value={config.url} 
            onChange={handleUrlChange}
            placeholder="Enter request URL"
            className="url-input"
          />
          <button onClick={onSend} disabled={isLoading}>
            {isLoading ? 'Sending...' : 'Send'}
          </button>
        </div>
        
        <div className="full-url">
          Full URL: <code>{buildUrl()}</code>
        </div>
      </div>
      
      <div className="tab-container">
        <div 
          className={`tab ${activeTab === 'params' ? 'active' : ''}`}
          onClick={() => setActiveTab('params')}
        >
          Params
        </div>
        <div 
          className={`tab ${activeTab === 'headers' ? 'active' : ''}`}
          onClick={() => setActiveTab('headers')}
        >
          Headers
        </div>
        <div 
          className={`tab ${activeTab === 'body' ? 'active' : ''}`}
          onClick={() => setActiveTab('body')}
        >
          Body
        </div>
      </div>
      
      <div className="tab-content">
        {activeTab === 'params' && (
          <HeadersEditor 
            headers={config.params} 
            onChange={handleParamsChange}
            keyPlaceholder="Parameter name"
            valuePlaceholder="Value"
          />
        )}
        
        {activeTab === 'headers' && (
          <HeadersEditor 
            headers={config.headers} 
            onChange={handleHeadersChange}
            keyPlaceholder="Header name"
            valuePlaceholder="Value"
          />
        )}
        
        {activeTab === 'body' && (
          <JsonEditor 
            value={config.body}
            onChange={handleBodyChange}
            placeholder="Enter request body"
          />
        )}
      </div>
    </div>
  );
};

export default RequestPanel;