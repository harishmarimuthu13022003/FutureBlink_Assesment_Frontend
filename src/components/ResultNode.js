import React from 'react';
import { Handle, Position } from 'reactflow';
import './Node.css';

const ResultNode = ({ data }) => {
  return (
    <div className="node result-node">
      <Handle type="target" position={Position.Top} />
      <div className="node-header">
        <span className="node-icon">🤖</span>
        <span className="node-title">AI Response</span>
      </div>
      <div className="node-content">
        <div className="node-text">
          {data.value || 'AI response will appear here...'}
        </div>
      </div>
    </div>
  );
};

export default ResultNode;

