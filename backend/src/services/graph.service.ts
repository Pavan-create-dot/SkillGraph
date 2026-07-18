import { skillRepository } from '../repositories/skill.repository';

export interface GraphNode {
  id: string;
  name: string;
  category: string;
  difficulty: string;
  description: string | null;
}

export interface GraphEdge {
  id: string;
  parentSkillId: string;
  childSkillId: string;
}

export class GraphService {
  /**
   * Helper method to construct adjacency list representations of the graph.
   * Returns:
   * - adjList: Maps a parent skill ID to a list of child skill IDs (outgoing edges).
   * - reverseAdjList: Maps a child skill ID to a list of parent skill IDs (incoming edges).
   * - skillMap: Map of skill ID to full Skill object details.
   */
  private async buildAdjacencyLists() {
    const { nodes, edges } = await skillRepository.getGraphData();
    const adjList: Record<string, string[]> = {};
    const reverseAdjList: Record<string, string[]> = {};
    const skillMap: Record<string, any> = {};

    for (const node of nodes) {
      skillMap[node.id] = node;
      adjList[node.id] = [];
      reverseAdjList[node.id] = [];
    }

    for (const edge of edges) {
      // Ensure target nodes exist in the maps before pushing
      if (adjList[edge.parentSkillId]) {
        adjList[edge.parentSkillId].push(edge.childSkillId);
      }
      if (reverseAdjList[edge.childSkillId]) {
        reverseAdjList[edge.childSkillId].push(edge.parentSkillId);
      }
    }

    return { adjList, reverseAdjList, skillMap, edges };
  }

  /**
   * Cycle Detection: Checks if adding a temporary edge from parentId to childId
   * would introduce a cycle in the DAG.
   */
  async hasCycle(parentId: string, childId: string): Promise<boolean> {
    const { adjList } = await this.buildAdjacencyLists();

    // Temporarily add the prospective edge
    if (!adjList[parentId]) adjList[parentId] = [];
    adjList[parentId].push(childId);

    const visited: Record<string, boolean> = {};
    const recStack: Record<string, boolean> = {};

    const dfs = (nodeId: string): boolean => {
      visited[nodeId] = true;
      recStack[nodeId] = true;

      const neighbors = adjList[nodeId] || [];
      for (const neighbor of neighbors) {
        if (!visited[neighbor]) {
          if (dfs(neighbor)) return true;
        } else if (recStack[neighbor]) {
          return true; // Found a back edge, which means a cycle
        }
      }

      recStack[nodeId] = false;
      return false;
    };

    // Run DFS starting from childId as it is the target of the prospective link
    for (const nodeId in adjList) {
      if (!visited[nodeId]) {
        if (dfs(nodeId)) return true;
      }
    }

    return false;
  }

  /**
   * BFS Traversal: Retrieves the full prerequisite chain (ancestors) for a given skill.
   * Returns skills ordered such that a skill appears after all its prerequisites.
   */
  async getPrerequisiteChain(skillId: string): Promise<any[]> {
    const { reverseAdjList, skillMap } = await this.buildAdjacencyLists();

    if (!skillMap[skillId]) {
      throw new Error('Skill not found');
    }

    const prerequisitesSet = new Set<string>();
    const queue: string[] = [skillId];
    const visited = new Set<string>([skillId]);

    // Gather all ancestors using BFS
    while (queue.length > 0) {
      const current = queue.shift()!;
      const parents = reverseAdjList[current] || [];
      for (const parent of parents) {
        if (!visited.has(parent)) {
          visited.add(parent);
          prerequisitesSet.add(parent);
          queue.push(parent);
        }
      }
    }

    // Sort prerequisites topologically to ensure a logical learning order
    const orderedPrerequisites: any[] = [];
    const topologicalOrder = await this.getTopologicalOrder();

    for (const orderedId of topologicalOrder) {
      if (prerequisitesSet.has(orderedId.id)) {
        orderedPrerequisites.push(orderedId);
      }
    }

    return orderedPrerequisites;
  }

  /**
   * DFS Traversal: Retrieves the full skill tree (descendants) unlocked by a given skill.
   */
  async getSkillTree(skillId: string): Promise<any[]> {
    const { adjList, skillMap } = await this.buildAdjacencyLists();

    if (!skillMap[skillId]) {
      throw new Error('Skill not found');
    }

    const descendants = new Set<string>();
    const visited = new Set<string>();

    const dfs = (nodeId: string) => {
      visited.add(nodeId);
      const children = adjList[nodeId] || [];
      for (const child of children) {
        if (!visited.has(child)) {
          descendants.add(child);
          dfs(child);
        }
      }
    };

    dfs(skillId);

    // Filter down to the full skill details
    return Array.from(descendants).map((id) => skillMap[id]);
  }

  /**
   * Topological Sort: Sorts all skills in a logical learning order.
   * Respects directed edge dependencies using Kahn's algorithm.
   */
  async getTopologicalOrder(): Promise<any[]> {
    const { adjList, reverseAdjList, skillMap } = await this.buildAdjacencyLists();
    const inDegree: Record<string, number> = {};
    const queue: string[] = [];
    const order: string[] = [];

    // Initialize in-degree counts
    for (const id in skillMap) {
      inDegree[id] = 0;
    }

    for (const parentId in adjList) {
      for (const childId of adjList[parentId]) {
        if (inDegree[childId] !== undefined) {
          inDegree[childId]++;
        }
      }
    }

    // Add nodes with 0 in-degree (root nodes / beginner skills) to query queue
    for (const id in inDegree) {
      if (inDegree[id] === 0) {
        queue.push(id);
      }
    }

    while (queue.length > 0) {
      const current = queue.shift()!;
      order.push(current);

      const children = adjList[current] || [];
      for (const child of children) {
        inDegree[child]--;
        if (inDegree[child] === 0) {
          queue.push(child);
        }
      }
    }

    // Return the ordered nodes
    return order.map((id) => skillMap[id]);
  }

  /**
   * Shortest Path finding between two skills.
   * Uses BFS to find the minimal sequence of dependencies connecting two nodes.
   */
  async getShortestPath(fromId: string, toId: string): Promise<any[] | null> {
    const { adjList, skillMap } = await this.buildAdjacencyLists();

    if (!skillMap[fromId] || !skillMap[toId]) {
      throw new Error('Invalid start or end skill ID');
    }

    if (fromId === toId) {
      return [skillMap[fromId]];
    }

    const queue: string[] = [fromId];
    const visited = new Set<string>([fromId]);
    const parentMap: Record<string, string> = {};

    let pathFound = false;

    while (queue.length > 0) {
      const current = queue.shift()!;

      if (current === toId) {
        pathFound = true;
        break;
      }

      const neighbors = adjList[current] || [];
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          parentMap[neighbor] = current;
          queue.push(neighbor);
        }
      }
    }

    if (!pathFound) {
      return null;
    }

    // Reconstruct the path
    const path: any[] = [];
    let current = toId;
    while (current) {
      path.unshift(skillMap[current]);
      current = parentMap[current];
    }

    return path;
  }
}

export const graphService = new GraphService();
