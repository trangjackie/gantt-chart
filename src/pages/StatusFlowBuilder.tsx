import React, { useState, useCallback } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  MarkerType,
  Connection,
  Edge,
  Node,
  Position
} from 'reactflow';
import 'reactflow/dist/style.css';

// 1. Custom Node đơn giản
const StatusNode = ({ data }: { data: any }) => (
  <div style={{
    padding: '10px 15px',
    border: '2px solid',
    borderColor: data.color,
    borderRadius: '5px',
    background: 'white'
  }}>
    {data.label}
  </div>
);

const nodeTypes = { statusNode: StatusNode };

// 2. Khởi tạo nodes và edges mẫu
const initialNodes: Node[] = [
  {
    id: '1',
    type: 'statusNode',
    position: { x: 100, y: 100 },
    data: { label: 'Open', color: 'blue' },
    sourcePosition: Position.Right,
    targetPosition: Position.Left
  },
  {
    id: '2',
    type: 'statusNode',
    position: { x: 300, y: 100 },
    data: { label: 'In Progress', color: 'orange' },
    sourcePosition: Position.Right,
    targetPosition: Position.Left
  },
];

const initialEdges: Edge[] = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    markerEnd: { type: MarkerType.ArrowClosed },
    style: { strokeWidth: 2 }
  }
];

// 3. Component chính
const FlowExample = () => {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => {
      const edge = {
        ...params,
        id: `${params.source}-${params.target}-${Date.now()}`,
        markerEnd: { type: MarkerType.ArrowClosed },
        style: { strokeWidth: 2 }
      };
      setEdges((eds) => addEdge(edge, eds));
    },
    [setEdges]
  );

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        defaultEdgeOptions={{
          style: { strokeWidth: 2 },
          markerEnd: { type: MarkerType.ArrowClosed }
        }}
        connectionRadius={20}
      >
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
};

// 4. Bọc với ReactFlowProvider
export default () => (
  <ReactFlowProvider>
    <FlowExample />
  </ReactFlowProvider>
);