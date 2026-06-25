import React, { useEffect } from 'react';
import ReactFlow, {
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
  type Node,
  type Edge,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Network, Loader2, FileText } from 'lucide-react';
import { resumeApi } from '../api/resume.api';
import { Link } from 'react-router-dom';

// ── Skill Categorization ────────────────────────────────────────
const CATEGORY_KEYWORDS: Record<string, string[]> = {
  Languages:      ['python', 'javascript', 'typescript', 'java', 'c++', 'c#', 'go', 'golang', 'rust', 'ruby', 'php', 'swift', 'kotlin', 'scala', 'r', 'html', 'css', 'sql', 'bash', 'shell'],
  Frameworks:     ['react', 'angular', 'vue', 'express', 'django', 'flask', 'spring', 'fastapi', 'next', 'nuxt', 'svelte', 'nestjs', 'nest.js', 'laravel', '.net', 'tailwind', 'bootstrap', 'redux', 'graphql'],
  Databases:      ['mysql', 'postgresql', 'postgres', 'mongodb', 'redis', 'sqlite', 'oracle', 'cassandra', 'dynamodb', 'firestore', 'elasticsearch', 'prisma', 'supabase'],
  'Cloud & DevOps': ['aws', 'azure', 'gcp', 'docker', 'kubernetes', 'k8s', 'terraform', 'jenkins', 'linux', 'nginx', 'ci/cd', 'git', 'ansible', 'vercel', 'netlify'],
};

function categorize(skill: string): string {
  const lower = skill.toLowerCase();
  for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    for (const kw of keywords) {
      if (lower.includes(kw) || kw.includes(lower)) return cat;
    }
  }
  return 'Other';
}

// ── Node Styles per category ────────────────────────────────────
const CAT_STYLES: Record<string, { bg: string; border: string; text: string }> = {
  Languages:        { bg: '#0d9488', border: '#0f766e', text: '#ccfbf1' },
  Frameworks:       { bg: '#7c3aed', border: '#5b21b6', text: '#ede9fe' },
  Databases:        { bg: '#d97706', border: '#b45309', text: '#fef3c7' },
  'Cloud & DevOps': { bg: '#0284c7', border: '#0369a1', text: '#e0f2fe' },
  Other:            { bg: '#475569', border: '#334155', text: '#f1f5f9' },
};

// ── Dagre layout ────────────────────────────────────────────────
// @ts-ignore — @dagrejs/dagre types don't perfectly align with the installed package
import dagreLib from '@dagrejs/dagre';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const dagre = dagreLib as any;

function applyDagreLayout(nodes: Node[], edges: Edge[]): Node[] {
  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: 'TB', nodesep: 50, ranksep: 70 });

  nodes.forEach((n) => {
    const w = (n.style?.width as number) ?? 140;
    const h = (n.style?.height as number) ?? 36;
    g.setNode(n.id, { width: w, height: h });
  });
  edges.forEach((e) => g.setEdge(e.source, e.target));

  dagre.layout(g);

  return nodes.map((n) => {
    const pos = g.node(n.id);
    const w = (n.style?.width as number) ?? 140;
    const h = (n.style?.height as number) ?? 36;
    return { ...n, position: { x: pos.x - w / 2, y: pos.y - h / 2 } };
  });
}

// ── Component ──────────────────────────────────────────────────
const SkillGraphPage: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [loading, setLoading] = React.useState(true);
  const [hasSkills, setHasSkills] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  useEffect(() => {
    resumeApi.getResume()
      .then((res) => {
        const skills: string[] = res.data?.parsed?.skills ?? [];
        if (!skills.length) { setHasSkills(false); return; }
        setHasSkills(true);

        // Group skills by category
        const grouped: Record<string, string[]> = {};
        for (const skill of skills) {
          const cat = categorize(skill);
          (grouped[cat] = grouped[cat] ?? []).push(skill);
        }

        const rawNodes: Node[] = [];
        const rawEdges: Edge[] = [];

        Object.entries(grouped).forEach(([cat, catSkills], ci) => {
          const catId = `cat-${ci}`;
          const s = CAT_STYLES[cat] ?? CAT_STYLES.Other;

          // Category node
          rawNodes.push({
            id: catId,
            data: { label: cat },
            position: { x: 0, y: 0 },
            style: {
              background: s.bg,
              border: `2px solid ${s.border}`,
              color: s.text,
              borderRadius: '10px',
              fontSize: '11px',
              fontWeight: '700',
              padding: '6px 14px',
              width: 150,
              height: 38,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            },
          });

          // Skill nodes + edges
          catSkills.forEach((skill, si) => {
            const skillId = `skill-${ci}-${si}`;
            rawNodes.push({
              id: skillId,
              data: { label: skill },
              position: { x: 0, y: 0 },
              style: {
                background: '#1e293b',
                border: `1px solid ${s.border}`,
                color: '#e2e8f0',
                borderRadius: '8px',
                fontSize: '11px',
                padding: '4px 12px',
                width: 130,
                height: 32,
              },
            });
            rawEdges.push({
              id: `e-${catId}-${skillId}`,
              source: catId,
              target: skillId,
              style: { stroke: s.border, strokeWidth: 1.5, opacity: 0.6 },
              animated: false,
            });
          });
        });

        const laid = applyDagreLayout(rawNodes, rawEdges);
        setNodes(laid);
        setEdges(rawEdges);
      })
      .catch(() => setError('Failed to load resume data.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="border-b border-slate-800 pb-6">
        <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-3">
          <Network className="w-6 h-6 text-primary-400" />
          Skill Graph
        </h1>
        <p className="mt-1 text-slate-500 text-sm">
          Visual map of your resume skills, categorized and laid out automatically.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-sm">
          {error}
        </div>
      )}

      {!hasSkills && !error && (
        <div className="flex flex-col items-center justify-center min-h-[420px] bg-slate-900 border border-dashed border-slate-700 rounded-2xl text-center p-10">
          <Network size={48} className="text-slate-700 mb-4" />
          <h3 className="text-base font-semibold text-slate-300">No Skills Found</h3>
          <p className="text-slate-500 text-sm mt-2 max-w-sm">
            Upload and analyze your resume first. Once the AI extracts your skills, they'll appear here as an interactive graph.
          </p>
          <Link
            to="/resume"
            className="mt-5 inline-flex items-center gap-2 px-4 py-2.5 bg-primary-600 hover:bg-primary-500 text-white text-sm font-medium rounded-lg transition-colors"
          >
            <FileText size={14} />
            Go to Resume
          </Link>
        </div>
      )}

      {hasSkills && (
        <>
          {/* Graph */}
          <div
            className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden"
            style={{ height: '62vh' }}
          >
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              fitView
              fitViewOptions={{ padding: 0.15 }}
              minZoom={0.3}
              maxZoom={2}
              attributionPosition="bottom-left"
            >
              <Background
                color="#1e293b"
                variant={BackgroundVariant.Dots}
                gap={20}
                size={1.5}
              />
              <Controls />
            </ReactFlow>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-4">
            {Object.entries(CAT_STYLES).map(([cat, s]) => (
              <div key={cat} className="flex items-center gap-2 text-xs text-slate-400">
                <span
                  className="w-3 h-3 rounded"
                  style={{ background: s.bg, border: `1px solid ${s.border}` }}
                />
                {cat}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default SkillGraphPage;
