import React, { useCallback } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  applyNodeChanges,
  applyEdgeChanges,
} from 'reactflow';
import type { Node, Edge, NodeChange, EdgeChange } from 'reactflow';
import 'reactflow/dist/style.css';
import { useSkillGraph } from '../hooks/useSkillGraph';

const SkillGraphPage: React.FC = () => {
  const { data: graphData, isLoading, error } = useSkillGraph();
  const [nodes, setNodes] = React.useState<Node[]>([]);
  const [edges, setEdges] = React.useState<Edge[]>([]);

  React.useEffect(() => {
    if (graphData) {
      // Basic layout algorithm or just random placement for now
      // In a real scenario, use dagre for topological layout
      const formattedNodes: Node[] = graphData.nodes.map((skill, index) => ({
        id: skill.id,
        position: { x: (index % 5) * 200, y: Math.floor(index / 5) * 150 },
        data: { label: skill.name },
      }));

      const formattedEdges: Edge[] = graphData.edges.map((edge) => ({
        id: edge.id,
        source: edge.parentSkillId,
        target: edge.childSkillId,
        animated: true,
      }));

      setNodes(formattedNodes);
      setEdges(formattedEdges);
    }
  }, [graphData]);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [],
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [],
  );

  if (isLoading) return <div className="p-8 text-center">Loading graph...</div>;
  if (error) return <div className="p-8 text-center text-red-500">Error loading graph</div>;

  return (
    <div className="flex flex-col h-full w-full">
      <div className="mb-4">
        <h1 className="text-3xl font-bold mb-2 text-slate-100">Knowledge Graph</h1>
        <p className="text-slate-400">Visualize skill dependencies and learning paths.</p>
      </div>

      <div className="flex-1 bg-slate-900 rounded-lg overflow-hidden border border-slate-700 min-h-[600px]">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          fitView
        >
          <Background color="#334155" gap={16} />
          <Controls />
          <MiniMap />
        </ReactFlow>
      </div>
    </div>
  );
};

export default SkillGraphPage;
