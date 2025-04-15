// src/components/JsonViewer.jsx
import React from 'react';
import Editor from '@monaco-editor/react';

const JsonViewer = ({ data }) => {
  // Format the JSON data with proper indentation
  const formattedJson = typeof data === 'object' 
    ? JSON.stringify(data, null, 2) 
    : String(data);

  return (
    <div className="json-viewer">
      <Editor
        height="300px"
        language="json"
        theme="vs-light"
        value={formattedJson}
        options={{
          readOnly: true,
          minimap: { enabled: false },
          folding: true,
          scrollBeyondLastLine: false,
          renderLineHighlight: 'all',
        }}
      />
    </div>
  );
};

export default JsonViewer;