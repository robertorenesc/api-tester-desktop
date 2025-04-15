import React, { useState, useEffect } from 'react';
import { getSavedRequests, deleteSavedRequest } from '../utils/stateManager';

const SavedRequests = ({ onSelect }) => {
  const [requests, setRequests] = useState({});
  
  useEffect(() => {
    setRequests(getSavedRequests());
  }, []);
  
  const handleDelete = (requestName, e) => {
    e.stopPropagation();
    if (window.confirm(`Delete saved request "${requestName}"?`)) {
      deleteSavedRequest(requestName);
      setRequests(getSavedRequests());
    }
  };
  
  return (
    <div className="saved-requests-panel">
      <h3>Saved Requests</h3>
      {Object.keys(requests).length === 0 ? (
        <p>No saved requests</p>
      ) : (
        <ul className="saved-requests-list">
          {Object.keys(requests).map(name => (
            <li key={name} onClick={() => onSelect(requests[name])}>
              <span>{name}</span>
              <button onClick={(e) => handleDelete(name, e)}>✕</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SavedRequests;