import React, { useState, useEffect } from 'react';
import { getRequestHistory } from '../utils/stateManager';

const RequestHistory = ({ onSelect }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadHistory = async () => {
      try {
        setLoading(true);
        const requestHistory = await getRequestHistory();
        setHistory(requestHistory);
      } catch (error) {
        console.error('Error loading request history:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadHistory();
  }, []);
  
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };
  
  return (
    <div className="history-panel">
      <h3>History</h3>
      {loading ? (
        <p>Loading...</p>
      ) : history.length === 0 ? (
        <p>No request history</p>
      ) : (
        <ul className="history-list">
          {history.map((item, index) => (
            <li 
              key={index} 
              onClick={() => onSelect(item.request)}
              className={item.response.status >= 200 && item.response.status < 300 ? 'success' : 'error'}
            >
              <div className="history-item-method">{item.request.method}</div>
              <div className="history-item-url">{item.request.url}</div>
              <div className="history-item-status">{item.response.status}</div>
              <div className="history-item-time">{formatTimestamp(item.timestamp)}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RequestHistory;
