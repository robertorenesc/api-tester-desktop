import React from 'react';

const HeadersEditor = ({ headers, onChange, keyPlaceholder, valuePlaceholder }) => {
  const handleHeaderChange = (index, field, value) => {
    const updatedHeaders = [...headers];
    updatedHeaders[index] = { ...updatedHeaders[index], [field]: value };
    onChange(updatedHeaders);
  };
  
  const handleToggleHeader = (index) => {
    const updatedHeaders = [...headers];
    updatedHeaders[index] = { 
      ...updatedHeaders[index], 
      enabled: !updatedHeaders[index].enabled 
    };
    onChange(updatedHeaders);
  };
  
  const addHeader = () => {
    onChange([...headers, { key: '', value: '', enabled: true }]);
  };
  
  const removeHeader = (index) => {
    const updatedHeaders = [...headers];
    updatedHeaders.splice(index, 1);
    onChange(updatedHeaders);
  };

  return (
    <div className="headers-editor">
      <table>
        <thead>
          <tr>
            <th></th>
            <th>Name</th>
            <th>Value</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {headers.map((header, index) => (
            <tr key={index} className={header.enabled ? '' : 'disabled'}>
              <td>
                <input
                  type="checkbox"
                  checked={header.enabled}
                  onChange={() => handleToggleHeader(index)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={header.key}
                  onChange={(e) => handleHeaderChange(index, 'key', e.target.value)}
                  placeholder={keyPlaceholder}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={header.value}
                  onChange={(e) => handleHeaderChange(index, 'value', e.target.value)}
                  placeholder={valuePlaceholder}
                />
              </td>
              <td>
                <button 
                  className="remove-btn"
                  onClick={() => removeHeader(index)}
                >
                  ✕
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={addHeader} className="add-btn">Add</button>
    </div>
  );
};

export default HeadersEditor;