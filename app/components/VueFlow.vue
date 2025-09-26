<script setup lang="ts">
import type { Edge, Node } from '@vue-flow/core';
import { Background } from '@vue-flow/background';
import { Controls } from '@vue-flow/controls';
import { VueFlow } from '@vue-flow/core';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';

const flowStore = useFlowStore();
const { nodes, edges } = storeToRefs(flowStore);

const isNodeModalOpen = ref(false);
const selectedNode = ref<Node | null>(null);
const isDeleteEdgeModalOpen = ref(false);
const selectedEdge = ref<Edge | null>(null);

function onInit(instance: any) {
  instance.fitView();
}

function onNodesChange() {
  flowStore.persist();
}

function onNodeClick(event: any) {
  if (event.stopPropagation && typeof event.stopPropagation === 'function') {
    event.stopPropagation();
  }

  if (event.node) {
    selectedNode.value = event.node;
    isNodeModalOpen.value = true;
  }
}

function addNode() {
  selectedNode.value = null;
  isNodeModalOpen.value = true;
}

function onBackgroundClick() {
  isNodeModalOpen.value = false;
  selectedNode.value = null;
}

function onConnect(event: any) {
  const newEdge = {
    id: `edge-${Date.now()}`,
    source: event.source,
    target: event.target,
    type: 'default',
  };
  flowStore.addEdge(newEdge);
}

function onEdgeClick(event: any) {
  if (event.edge) {
    selectedEdge.value = event.edge;
    isDeleteEdgeModalOpen.value = true;
  }
}

function handleEdgeDeleteConfirm(edgeId: string) {
  flowStore.deleteEdge(edgeId);
}

function onNodeDoubleClick(event: any) {
  if (event.node) {
    selectedNode.value = event.node;
    isNodeModalOpen.value = true;
  }
}
</script>

<template>
  <div class="container">
    <button
      text="Add New Node"
      variant="tonal"
      color="primary"
      class="open-btn"
      @click="addNode"
    >
      Add New Node
    </button>
    <VueFlow
      v-model:nodes="nodes"
      v-model:edges="edges"
      @init="onInit"
      @nodes-change="onNodesChange"
      @edges-change="() => flowStore.persist()"
      @selection-change="
        (sel: any) => flowStore.setSelectedNodes((sel?.nodes ?? []).map((n: any) => n.id))
      "
      @node-click="onNodeClick"
      @node-double-click="onNodeDoubleClick"
      @pane-click="onBackgroundClick"
      @connect="onConnect"
      @edge-click="onEdgeClick"
    >
      <Background />
      <Controls />
    </VueFlow>
  </div>
  <NodeModal v-model="isNodeModalOpen" :node="selectedNode" />
  <DeleteEdgeModal
    v-model="isDeleteEdgeModalOpen"
    :edge="selectedEdge"
    :nodes="nodes"
    @confirm="handleEdgeDeleteConfirm"
  />
</template>

<style>
/* import the necessary styles for Vue Flow to work */
@import '@vue-flow/core/dist/style.css';
@import '@vue-flow/core/dist/theme-default.css';
@import '@vue-flow/controls/dist/style.css';

.container {
  width: 100%;
  height: 100vh;
  background-color: #eeeeee;
  position: relative;
}

.vue-flow {
  width: 100% !important;
  height: 100% !important;
}

.vue-flow__controls {
  z-index: 5;
}

.vue-flow__node {
  cursor: pointer;
}

.vue-flow__handle {
  background: #1976d2;
  border: 2px solid white;
  border-radius: 50%;
  width: 12px;
  height: 12px;
}

.vue-flow__handle:hover {
  background: #1565c0;
  transform: scale(1.2);
}

.vue-flow__edge-path {
  stroke: #1976d2;
  stroke-width: 2;
}

.vue-flow__edge:hover .vue-flow__edge-path {
  stroke: #1565c0;
  stroke-width: 3;
}

.vue-flow__edge {
  cursor: pointer;
}

.vue-flow__edge:hover {
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

.vue-flow__node {
  min-width: 180px;
  max-width: 200px;
}

.vue-flow {
  background: linear-gradient(90deg, #f5f5f5 0%, #ffffff 100%);
}

.open-btn {
  width: 170px;
  text-align: center;
  position: absolute;
  top: 16px;
  left: 16px;
  z-index: 10;
  border-radius: 8px;
  background-color: #1976d2;
  padding: 4px;
  color: #ffffff;
  opacity: 0.8;
}
</style>
