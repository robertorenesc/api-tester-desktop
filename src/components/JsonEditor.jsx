// src/components/JsonEditor.jsx
import React from 'react';
import Editor from '@monaco-editor/react';

const JsonEditor = ({ value, onChange, readOnly = false, placeholder }) => {
  const handleEditorChange = (value) => {
    if (onChange) {
      onChange(value);
    }
  };

  const options = {
    readOnly,
    minimap: { enabled: false },
    automaticLayout: true,
    formatOnPaste: true,
    formatOnType: true,
    scrollBeyondLastLine: false,
  };

  return (
    <div className="json-editor">
      <Editor
        height="300px"
        language="json"
        theme="vs-light"
        value={value || ''}
        options={options}
        onChange={handleEditorChange}
      />
    </div>
  );
};

export default JsonEditor;