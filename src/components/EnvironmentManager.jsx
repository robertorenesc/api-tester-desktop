import React, { useState, useEffect } from 'react';

const EnvironmentManager = ({ environments, activeEnvironment, onSave, onDelete, onClose }) => {
  const [currentEnv, setCurrentEnv] = useState({ id: '', name: '', variables: {} });
  const [variables, setVariables] = useState([]);

  useEffect(() => {
    if (activeEnvironment) {
      setCurrentEnv({
        id: activeEnvironment.id,
        name: activeEnvironment.name,
        variables: { ...activeEnvironment.variables }
      });
      setVariables(
        Object.entries(activeEnvironment.variables || {}).map(([key, value]) => ({ key, value }))
      );
    } else {
      setCurrentEnv({ id: Date.now().toString(), name: '', variables: {} });
      setVariables([]);
    }
  }, [activeEnvironment]);

  const handleNameChange = (e) => {
    setCurrentEnv({ ...currentEnv, name: e.target.value });
  };

  const handleVariableChange = (index, field, value) => {
    const updatedVariables = [...variables];
    updatedVariables[index] = { ...updatedVariables[index], [field]: value };
    setVariables(updatedVariables);
    
    // Update the variables object
    const varsObject = {};
    updatedVariables.forEach(v => {
      if (v.key) {
        varsObject[v.key] = v.value;
      }
    });
    setCurrentEnv({ ...currentEnv, variables: varsObject });
  };

  const addVariable = () => {
    setVariables([...variables, { key: '', value: '' }]);
  };

  const removeVariable = (index) => {
    const updatedVariables = [...variables];
    updatedVariables.splice(index, 1);
    setVariables(updatedVariables);
    
    // Update the variables object
    const varsObject = {};
    updatedVariables.forEach(v => {
      if (v.key) {
        varsObject[v.key] = v.value;
      }
    });
    setCurrentEnv({ ...currentEnv, variables: varsObject });
  };

  const handleSave = () => {
    if (!currentEnv.name) {
      alert('Environment name is required');
      return;
    }
    
    onSave(currentEnv);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this environment?')) {
      onDelete(currentEnv.id);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Environment Manager</h2>
          <button onClick={onClose}>✕</button>
        </div>
        
        <div className="modal-body">
          <div className="input-group">
            <label>Name:</label>
            <input 
              type="text" 
              value={currentEnv.name} 
              onChange={handleNameChange}
              placeholder="Environment Name"
            />
          </div>
          
          <h3>Variables</h3>
          <div className="variables-editor">
            <table>
              <thead>
                <tr>
                  <th>Variable</th>
                  <th>Value</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {variables.map((variable, index) => (
                  <tr key={index}>
                    <td>
                      <input
                        type="text"
                        value={variable.key}
                        onChange={(e) => handleVariableChange(index, 'key', e.target.value)}
                        placeholder="Variable name"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={variable.value}
                        onChange={(e) => handleVariableChange(index, 'value', e.target.value)}
                        placeholder="Value"
                      />
                    </td>
                    <td>
                      <button 
                        className="remove-btn"
                        onClick={() => removeVariable(index)}
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button onClick={addVariable} className="add-btn">Add Variable</button>
          </div>
        </div>
        
        <div className="modal-footer">
          {currentEnv.id && 
            <button onClick={handleDelete} className="delete-btn">Delete</button>
          }
          <button onClick={handleSave} className="save-btn">Save</button>
        </div>
      </div>
    </div>
  );
};

export default EnvironmentManager;