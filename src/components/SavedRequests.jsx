import React, { useState, useEffect } from 'react';
import { getSavedRequests, deleteSavedRequest } from '../utils/stateManager';

const SavedRequests = ({ onSelect }) => {
  const [requests, setRequests] = useState({});
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadRequests = async () => {
      try {
        setLoading(true);
        const savedRequests = await getSavedRequests();
        setRequests(savedRequests);
      } catch (error) {
        console.error('Error loading saved requests:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadRequests();
  }, []);
  
  const handleDelete = async (requestName, e) => {
    e.stopPropagation();
    if (window.confirm(`Delete saved request "${requestName}"?`)) {
      try {
        const updatedRequests = await deleteSavedRequest(requestName);
        setRequests(updatedRequests);
      } catch (error) {
        console.error('Error deleting request:', error);
      }
    }
  };
  
  return (
    <div className="saved-requests-panel">
      <h3>Saved Requests</h3>
      {loading ? (
        <p>Loading...</p>
      ) : Object.keys(requests).length === 0 ? (
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
