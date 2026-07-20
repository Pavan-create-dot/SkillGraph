import React, { useState, useEffect, useCallback, useMemo } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  MarkerType,
  useNodesState,
  useEdgesState,
  Position,
} from 'reactflow';
import type { Node, Edge } from 'reactflow';
import 'reactflow/dist/style.css';
import dagre from '@dagrejs/dagre';

import { useMyRoadmap, useRoadmapStatus } from '../hooks/useRoadmap';
import { useProgress } from '../hooks/useProgress';
import { useCategories } from '../hooks/useSkills';
import { useTopologicalOrder, useShortestPath } from '../hooks/useGraph';

import SkillNode from '../components/graph/SkillNode';
import GraphToolbar from '../components/graph/GraphToolbar';
import SkillDetailPanel from '../components/graph/SkillDetailPanel';
import type { ProgressStatus } from '../types';

// Map custom nodes
const nodeTypes = {
  skillNode: SkillNode,
};

// Dagre Layout Setup
const getLayoutedElements = (nodes: Node[], edges: Edge[], direction: 'TB' | 'LR' = 'TB') => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  
  const isHorizontal = direction === 'LR';
  dagreGraph.setGraph({
    rankdir: direction,
    ranker: 'network-simplex',
    nodesep: 80,
    ranksep: 100,
  });

  nodes.forEach((node) => {
    // node dimension settings matching custom cards
    dagreGraph.setNode(node.id, { width: 240, height: 140 });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const positionedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      targetPosition: isHorizontal ? Position.Left : Position.Top,
      sourcePosition: isHorizontal ? Position.Right : Position.Bottom,
      position: {
        x: nodeWithPosition.x - 120, // center offset (half of width 240)
        y: nodeWithPosition.y - 70,  // center offset (half of height 140)
      },
    };
  });

  return { nodes: positionedNodes, edges };
};

const SkillGraphPage: React.FC = () => {
  const { data: roadmapStatus } = useRoadmapStatus();
  const hasRoadmap = roadmapStatus?.hasRoadmap ?? false;

  const { data: roadmapData, isLoading: graphLoading, error: graphError } = useMyRoadmap(hasRoadmap);
  const { data: progressData, isLoading: progressLoading } = useProgress();
  const { data: categories = [] } = useCategories();
  const { data: topologicalOrderRaw } = useTopologicalOrder();

  // Shape roadmapData into the same format used by graph-building logic below
  const graphData = roadmapData ?? null;
  const skills = roadmapData?.nodes ?? [];

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // UI / Graph States
  const [layoutDirection, setLayoutDirection] = useState<'TB' | 'LR'>('TB');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [showLearningPath, setShowLearningPath] = useState(false);
  const [selectedSkillId, setSelectedSkillId] = useState<string | null>(null);

  // Shortest Path Finder States
  const [pathStart, setPathStart] = useState<string>('');
  const [pathEnd, setPathEnd] = useState<string>('');

  const { data: shortestPathRaw } = useShortestPath(
    pathStart || null,
    pathEnd || null
  );

  // Stable empty-array fallbacks — avoids new references every render
  const EMPTY: never[] = useMemo(() => [], []);
  const shortestPath = shortestPathRaw ?? EMPTY;
  const topologicalOrder = topologicalOrderRaw ?? EMPTY;

  // Find currently selected skill object
  const selectedSkill = useMemo(() => {
    if (!selectedSkillId) return null;
    return skills.find((s) => s.id === selectedSkillId) || null;
  }, [selectedSkillId, skills]);

  // Jump helper for nodes (focus detail panel on a different node)
  const handleJumpToSkill = useCallback((skillId: string) => {
    setSelectedSkillId(skillId);
  }, []);

  // Format elements (nodes + edges) based on filters & states
  useEffect(() => {
    if (!graphData) return;

    // Filter nodes if a specific category is chosen
    const filteredSkills = selectedCategory === 'ALL'
      ? graphData.nodes
      : graphData.nodes.filter((s) => s.category === selectedCategory);

    const filteredSkillIds = new Set(filteredSkills.map((s) => s.id));

    // Construct React Flow Nodes
    const flowNodes: Node[] = filteredSkills.map((skill) => {
      // Find progress overlay
      const prog = progressData?.find((p) => p.skillId === skill.id);
      const mastery = prog?.mastery ?? 0;
      const status: ProgressStatus = prog?.status ?? 'NOT_STARTED';

      // Check if it is on the shortest path
      const isPathNode = shortestPath?.some((s) => s.id === skill.id) ?? false;

      // Check if highlighted in topological order
      const orderIndex = topologicalOrder.findIndex((s) => s.id === skill.id);
      const learningPathIndex = showLearningPath && orderIndex !== -1 ? orderIndex + 1 : undefined;

      return {
        id: skill.id,
        type: 'skillNode',
        data: {
          skill,
          mastery,
          status,
          learningPathIndex,
          isSelected: skill.id === selectedSkillId,
          isPathNode,
          layoutDirection,
        },
        position: { x: 0, y: 0 }, // position computed by dagre layout below
      };
    });

    // Construct React Flow Edges (only include edges connecting nodes that exist in filtered set)
    const flowEdges: Edge[] = graphData.edges
      .filter((edge) => filteredSkillIds.has(edge.parentSkillId) && filteredSkillIds.has(edge.childSkillId))
      .map((edge) => {
        const parentProgress = progressData?.find((p) => p.skillId === edge.parentSkillId);
        
        // Edge styling based on parent progress
        let strokeColor = '#475569'; // default slate-600
        let animated = false;

        if (parentProgress?.status === 'COMPLETED') {
          strokeColor = '#10b981'; // green edge for completed unlock paths
        } else if (parentProgress?.status === 'IN_PROGRESS') {
          strokeColor = '#0ea5e9'; // pulsing blue edge for ongoing learning paths
          animated = true;
        }

        // Highlight if edge lies on shortest path
        const isPathEdge = shortestPath.length > 0 &&
          shortestPath.findIndex((s) => s.id === edge.parentSkillId) !== -1 &&
          shortestPath.findIndex((s) => s.id === edge.childSkillId) !== -1;

        if (isPathEdge) {
          strokeColor = '#f59e0b'; // glowing amber
          animated = true;
        }

        return {
          id: edge.id,
          source: edge.parentSkillId,
          target: edge.childSkillId,
          animated,
          style: {
            stroke: strokeColor,
            strokeWidth: isPathEdge ? 3.5 : 1.5,
            transition: 'stroke 0.3s, stroke-width 0.3s',
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: strokeColor,
            width: 14,
            height: 14,
          },
        };
      });

    // Run dagre auto-layout
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      flowNodes,
      flowEdges,
      layoutDirection
    );

    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    graphData,
    progressData,
    selectedCategory,
    showLearningPath,
    selectedSkillId,
    shortestPath,
    topologicalOrder,
    layoutDirection,
    // setNodes and setEdges are stable React Flow dispatch functions — omitting from deps is safe
  ]);

  // Click handler to select node and open detail panel
  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedSkillId(node.id);
  }, []);

  // Clear pathfinder settings
  const handleClearPath = () => {
    setPathStart('');
    setPathEnd('');
  };

  const loading = graphLoading || progressLoading;

  // ─── No roadmap state ─────────────────────────────────────────────────────
  if (!graphLoading && !hasRoadmap) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[500px] text-center gap-6">
        <div className="text-6xl">🗺️</div>
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">No Roadmap Yet</h2>
          <p className="text-slate-400 max-w-sm">
            You haven't generated your personalized learning path yet. Answer a few questions and let Gemini AI build your skill graph.
          </p>
        </div>
        <a
          href="/onboarding"
          className="btn-primary px-8 py-3 text-base font-semibold bg-gradient-to-r from-primary-600 to-accent-600"
        >
          🤖 Generate My Roadmap
        </a>
      </div>
    );
  }

  if (loading) return <div className="p-8 text-center text-slate-400">Loading your Knowledge Graph…</div>;
  if (graphError) return <div className="p-8 text-center text-red-500">Error loading graph data.</div>;

  return (
    <div className="flex flex-col h-full w-full relative">
      <div className="mb-4">
        <span className="text-primary-400 text-xs font-semibold uppercase tracking-wider bg-primary-500/10 px-3 py-1 rounded-full border border-primary-500/20">
          Knowledge Engine Enabled
        </span>
        <h1 className="text-3xl font-bold mt-2 mb-1 text-slate-100">Interactive Knowledge Graph</h1>
        <p className="text-slate-400 text-sm">
          Visualize prerequisites, unlock sequences, update progress, and find custom learning paths.
        </p>
      </div>

      {/* Toolbar Controls */}
      <GraphToolbar
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        showLearningPath={showLearningPath}
        onToggleLearningPath={() => setShowLearningPath(!showLearningPath)}
        skills={skills}
        pathStart={pathStart}
        pathEnd={pathEnd}
        onPathStartChange={setPathStart}
        onPathEndChange={setPathEnd}
        onClearPath={handleClearPath}
        layoutDirection={layoutDirection}
        onLayoutDirectionChange={setLayoutDirection}
      />

      {/* Interactive Graph Panel */}
      <div className="flex-1 bg-slate-950/60 rounded-2xl overflow-hidden border border-slate-800 min-h-[600px] shadow-inner relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          onNodeClick={onNodeClick}
          fitView
          attributionPosition="bottom-right"
        >
          <Background color="#334155" gap={18} size={1} />
          <Controls className="!bg-slate-800 !border-slate-700 !fill-slate-200" />
          <MiniMap
            nodeStrokeColor="#1e293b"
            nodeColor={(node) => {
              const status = node.data?.status;
              if (status === 'COMPLETED') return '#10b981';
              if (status === 'IN_PROGRESS') return '#0ea5e9';
              return '#334155';
            }}
            maskColor="rgba(15, 23, 42, 0.6)"
            className="!bg-slate-900 !border-slate-700"
          />
        </ReactFlow>

        {/* Legend Overlay */}
        <div className="absolute bottom-4 left-4 bg-slate-900/90 backdrop-blur-sm border border-slate-700/60 p-3 rounded-lg flex flex-col gap-2 z-10 text-xxs text-slate-300">
          <div className="font-semibold text-slate-400 uppercase tracking-wide border-b border-slate-700/40 pb-1 mb-1">
            Legend
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>Completed Skill / Path</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
            <span>Learning / In-Progress</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-500" />
            <span>Locked / Not Started</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>Shortest Learning Path</span>
          </div>
        </div>
      </div>

      {/* Slide-over Detail Sidebar */}
      {selectedSkill && (
        <SkillDetailPanel
          skill={selectedSkill}
          onClose={() => setSelectedSkillId(null)}
          userProgress={progressData}
          onJumpToSkill={handleJumpToSkill}
        />
      )}
    </div>
  );
};

export default SkillGraphPage;
