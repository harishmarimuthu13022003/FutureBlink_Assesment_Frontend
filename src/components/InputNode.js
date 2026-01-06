import React from 'react';
import { Handle, Position } from 'reactflow';
import './Node.css';

const InputNode = ({ data }) => {
  return (
    <div className="node input-node">
      <Handle type="source" position={Position.Bottom} />
      <div className="node-header">
        <span className="node-icon">📝</span>
        <span className="node-title">Input</span>
      </div>
      <div className="node-content">
        <textarea
          className="node-textarea"
          value={data.value}
          onChange={(e) => {
            data.onChange?.(e.target.value);
          }}
          placeholder="Type your prompt here..."
          rows={4}
        />
      </div>
    </div>
  );
};

export default InputNode;

