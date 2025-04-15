import React, { useState } from 'react';
import JsonViewer from './JsonViewer';

const ResponsePanel = ({ response, isLoading }) => {
  const [activeTab, setActiveTab] = useState('body');
  
  if (isLoading) {
    return (
      <div className="panel response-panel">
        <div className="panel-header">
          <h2>Response</h2>
        </div>
        <div className="loading-container">
          <p>Sending request...</p>
        </div>
      </div>
    );
  }
  
  if (!response) {
    return (
      <div className="panel response-panel">
        <div className="panel-header">
          <h2>Response</h2>
        </div>
        <div className="empty-response">
          <p>Send a request to see the response</p>
        </div>
      </div>
    );
  }
  
  const statusClass = response.status >= 200 && response.status < 300 
    ? 'status-success' 
    : 'status-error';

  return (
    <div className="panel response-panel">
      <div className="panel-header">
        <h2>Response</h2>
        <div className={`status-code ${statusClass}`}>
          {response.status} {response.statusText}
        </div>
      </div>
      
      <div className="tab-container">
        <div 
          className={`tab ${activeTab === 'body' ? 'active' : ''}`}
          onClick={() => setActiveTab('body')}
        >
          Body
        </div>
        <div 
          className={`tab ${activeTab === 'headers' ? 'active' : ''}`}
          onClick={() => setActiveTab('headers')}
        >
          Headers
        </div>
        <div 
          className={`tab ${activeTab === 'cookies' ? 'active' : ''}`}
          onClick={() => setActiveTab('cookies')}
        >
          Cookies
        </div>
      </div>
      
      <div className="tab-content">
        {activeTab === 'body' && (
          <JsonViewer data={response.data} />
        )}
        
        {activeTab === 'headers' && (
          <div className="headers-container">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(response.headers || {}).map(([key, value]) => (
                  <tr key={key}>
                    <td>{key}</td>
                    <td>{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {activeTab === 'cookies' && (
          <div className="cookies-container">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(response.cookies || {}).map(([key, value]) => (
                  <tr key={key}>
                    <td>{key}</td>
                    <td>{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResponsePanel;