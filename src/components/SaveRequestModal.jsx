import React, { useState } from 'react';
import { saveRequest } from '../utils/stateManager';

const SaveRequestModal = ({ requestConfig, onClose }) => {
  const [requestName, setRequestName] = useState('');
  
  const handleSave = () => {
    if (!requestName.trim()) {
      alert('Please enter a name for this request');
      return;
    }
    
    saveRequest(requestName, requestConfig);
    onClose(true);
  };
  
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Save Request</h2>
          <button onClick={() => onClose(false)}>✕</button>
        </div>
        
        <div className="modal-body">
          <div className="input-group">
            <label>Name:</label>
            <input 
              type="text" 
              value={requestName} 
              onChange={(e) => setRequestName(e.target.value)}
              placeholder="Request Name"
            />
          </div>
        </div>
        
        <div className="modal-footer">
          <button onClick={() => onClose(false)}>Cancel</button>
          <button onClick={handleSave} className="save-btn">Save</button>
        </div>
      </div>
    </div>
  );
};

export default SaveRequestModal;