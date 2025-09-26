<script setup lang="ts">
import type { Edge } from '@vue-flow/core';
import { computed } from 'vue';

interface Props {
  modelValue: boolean;
  edge?: Edge | null;
  nodes?: any[];
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void;
  (e: 'confirm', edgeId: string): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

// v-model for the dialog
const isOpen = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
});

// optional: show source/target in title or for debugging
const edgeInfo = computed(() => {
  if (!props.edge || !props.nodes)
    return { sourceLabel: '', targetLabel: '' };

  const sourceNode = props.nodes.find(n => n.id === props.edge?.source);
  const targetNode = props.nodes.find(n => n.id === props.edge?.target);

  return {
    sourceLabel: sourceNode?.data?.title || sourceNode?.data?.label || props.edge.source || 'Unknown',
    targetLabel: targetNode?.data?.title || targetNode?.data?.label || props.edge.target || 'Unknown',
  };
});

function cancel() {
  isOpen.value = false;
}

function confirmDelete() {
  if (props.edge?.id) {
    emit('confirm', props.edge.id);
    isOpen.value = false;
  }
}
</script>

<template>
  <v-dialog v-model="isOpen" max-width="400">
    <v-card>
      <v-card-title class="text-h6 red--text">
        Delete Connection
      </v-card-title>

      <v-card-text>
        <div>
          <strong>From:</strong> {{ edgeInfo.sourceLabel }}<br>
          <strong>To:</strong> {{ edgeInfo.targetLabel }}
        </div>
      </v-card-text>

      <v-card-actions class="justify-end">
        <v-btn text color="grey" @click="cancel">
          Cancel
        </v-btn>
        <v-btn color="red darken-2" @click="confirmDelete">
          Delete
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
