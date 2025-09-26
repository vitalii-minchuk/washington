import type { Edge, Node } from '@vue-flow/core';
import { defineStore } from 'pinia';
import { ref } from 'vue';

const STORAGE_KEY = 'VUE_FLOW';

interface Persisted {
  nodes: Node[];
  edges: Edge[];
}

function loadPersisted(): Persisted | null {
  const raw = localStorage.getItem(STORAGE_KEY);

  return raw ? JSON.parse(raw) as Persisted : null;
}

export const useFlowStore = defineStore('flow', () => {
  const persisted = loadPersisted();
  const nodes = ref<Node[]>(
    persisted?.nodes ?? [
      {
        id: '1',
        type: 'input',
        data: { label: 'Node 1', title: 'Node 1', description: '' },
        position: { x: 100, y: 200 },
      },
      {
        id: '2',
        data: { label: 'Node 2', title: 'Node 2', description: '' },
        position: { x: 350, y: 200 },
      },
    ],
  );
  const edges = ref<Edge[]>(persisted?.edges ?? []);
  const selectedNodeIds = ref<Set<string>>(new Set());

  function persist() {
    const payload: Persisted = {
      nodes: nodes.value,
      edges: edges.value,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }

  function addNode(title: string = '', description: string = '') {
    const id = String(Date.now());
    const horizontalPosition = calculateHorizontalPosition(nodes.value.length);

    const newNode: Node = {
      id,
      data: {
        label: title || `Node ${nodes.value.length + 1}`,
        title: title || `Node ${nodes.value.length + 1}`,
        description: description || '',
      },
      position: horizontalPosition,
    };
    nodes.value = [...nodes.value, newNode];
    persist();
  }

  function calculateHorizontalPosition(index: number) {
    const nodeWidth = 200;
    const spacing = 50;
    const startX = 100;
    const centerY = 200;

    return {
      x: startX + index * (nodeWidth + spacing),
      y: centerY,
    };
  }

  function arrangeNodesHorizontally() {
    nodes.value = nodes.value.map((node, index) => ({
      ...node,
      position: calculateHorizontalPosition(index),
    }));
    persist();
  }

  function removeSelected() {
    if (!selectedNodeIds.value.size)
      return;
    const ids = new Set(selectedNodeIds.value);
    nodes.value = nodes.value.filter(n => !ids.has(n.id));
    edges.value = edges.value.filter(e => !ids.has(e.source) && !ids.has(e.target));
    selectedNodeIds.value.clear();

    arrangeNodesHorizontally();
    persist();
  }

  function updateNodePosition(id: string, x: number, y: number) {
    nodes.value = nodes.value.map(n => (n.id === id ? { ...n, position: { x, y } } : n));
    persist();
  }

  function setNodes(next: Node[]) {
    nodes.value = next;
    persist();
  }

  function setEdges(next: Edge[]) {
    edges.value = next;
    persist();
  }

  function setSelectedNodes(ids: string[]) {
    selectedNodeIds.value = new Set(ids);
  }

  function editNode(id: string, title: string, description: string) {
    nodes.value = nodes.value.map(n =>
      n.id === id
        ? {
            ...n,
            data: {
              ...n.data,
              label: title,
              title,
              description,
            },
          }
        : n,
    );
    persist();
  }

  function deleteNode(id: string) {
    nodes.value = nodes.value.filter(n => n.id !== id);
    edges.value = edges.value.filter(e => e.source !== id && e.target !== id);
    selectedNodeIds.value.delete(id);
    persist();
  }

  function addEdge(edge: Edge) {
    edges.value = [...edges.value, edge];
    persist();
  }

  function deleteEdge(id: string) {
    edges.value = edges.value.filter(e => e.id !== id);
    persist();
  }

  return {
    nodes,
    edges,
    selectedNodeIds,
    persist,
    addNode,
    removeSelected,
    updateNodePosition,
    setNodes,
    setEdges,
    setSelectedNodes,
    editNode,
    deleteNode,
    addEdge,
    deleteEdge,
    arrangeNodesHorizontally,
  };
});
