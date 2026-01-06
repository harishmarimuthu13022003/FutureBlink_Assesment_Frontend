import React, { useCallback, useState, useEffect } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
} from 'reactflow';
import 'reactflow/dist/style.css';
import axios from 'axios';
import './App.css';
import InputNode from './components/InputNode';
import ResultNode from './components/ResultNode';

const nodeTypes = {
  inputNode: InputNode,
  resultNode: ResultNode,
};

const initialNodes = [
  {
    id: '1',
    type: 'inputNode',
    position: { x: 250, y: 100 },
    data: { value: '' },
  },
  {
    id: '2',
    type: 'resultNode',
    position: { x: 250, y: 300 },
    data: { value: 'AI response will appear here...' },
  },
];

const initialEdges = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    animated: true,
    style: { stroke: '#667eea', strokeWidth: 2 },
  },
];

function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [isLoading, setIsLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');

  const updateInputNode = useCallback((value) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === '1') {
          return { ...node, data: { ...node.data, value } };
        }
        return node;
      })
    );
  }, [setNodes]);

  const updateResultNode = useCallback((value) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === '2') {
          return { ...node, data: { ...node.data, value } };
        }
        return node;
      })
    );
  }, [setNodes]);

  // Update input node with onChange callback
  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === '1') {
          return { ...node, data: { ...node.data, onChange: updateInputNode } };
        }
        return node;
      })
    );
  }, [setNodes, updateInputNode]);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const handleRunFlow = async () => {
    const inputNode = nodes.find((node) => node.id === '1');
    const prompt = inputNode?.data?.value || '';

    if (!prompt.trim()) {
      alert('Please enter a prompt in the input node');
      return;
    }

    setIsLoading(true);
    updateResultNode('Loading...');

    try {
      const response = await axios.post('/api/ask-ai', { prompt });
      if (response.data.success) {
        updateResultNode(response.data.response);
        setSaveStatus('');
      } else {
        updateResultNode('Error: Failed to get response');
      }
    } catch (error) {
      console.error('Error calling API:', error);
      updateResultNode(
        `Error: ${error.response?.data?.error || error.message}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    const inputNode = nodes.find((node) => node.id === '1');
    const resultNode = nodes.find((node) => node.id === '2');
    const prompt = inputNode?.data?.value || '';
    const response = resultNode?.data?.value || '';

    if (!prompt.trim() || !response.trim() || response === 'AI response will appear here...' || response === 'Loading...') {
      alert('Please run the flow first to generate a response before saving');
      return;
    }

    try {
      const apiResponse = await axios.post('/api/save-conversation', {
        prompt,
        response,
      });

      if (apiResponse.data.success) {
        setSaveStatus('Saved successfully!');
        setTimeout(() => setSaveStatus(''), 3000);
      }
    } catch (error) {
      console.error('Error saving conversation:', error);
      setSaveStatus('Error saving conversation');
      setTimeout(() => setSaveStatus(''), 3000);
    }
  };

  return (
    <div className="app-container">
      <div className="app-header">
        <h1>FutureBlink AI Flow</h1>
        <p>Type your prompt and watch the AI respond</p>
      </div>

      <div className="controls-panel">
        <button
          className="btn btn-primary"
          onClick={handleRunFlow}
          disabled={isLoading}
        >
          {isLoading ? 'Running...' : 'Run Flow'}
        </button>
        <button className="btn btn-secondary" onClick={handleSave}>
          Save
        </button>
        {saveStatus && (
          <span className={`save-status ${saveStatus.includes('Error') ? 'error' : 'success'}`}>
            {saveStatus}
          </span>
        )}
      </div>

      <div className="flow-container">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
        >
          <Background />
          <Controls />
          <MiniMap />
        </ReactFlow>
      </div>
    </div>
  );
}

export default App;

