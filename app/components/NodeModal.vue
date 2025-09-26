<script setup lang="ts">
import type { Node } from '@vue-flow/core';

const props = defineProps<{
  modelValue: boolean;
  node?: Node | null;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
}>();

const flowStore = useFlowStore();

const title = ref('');
const description = ref('');

const isOpen = computed({
  get: () => props.modelValue,
  set: (val: boolean) => emit('update:modelValue', val),
});

function save() {
  props.node?.id
    ? flowStore.editNode(props.node.id, title.value, description.value)
    : flowStore.addNode(title.value, description.value);

  emit('update:modelValue', false);
}

function deleteNode() {
  if (!props.node?.id)
    return;

  flowStore.deleteNode(props.node.id);
  emit('update:modelValue', false);
}

watch(
  () => props.node,
  (newNode) => {
    title.value = newNode?.data.title ?? '';
    description.value = newNode?.data.description ?? '';
  },
  { immediate: true },
);
</script>

<template>
  <v-dialog v-model="isOpen" max-width="500">
    <form @submit.prevent="save">
      <v-card :title="props.node ? 'Edit Node' : 'Add Node'">
        <v-card-text>
          <v-text-field v-model="title" label="Title" variant="outlined" />
          <v-textarea v-model="description" label="Description" variant="outlined" />
        </v-card-text>

        <v-card-actions>
          <v-btn
            v-if="props.node"
            text="Delete Node"
            color="error"
            type="button"
            @click="deleteNode"
          />

          <v-spacer />

          <v-btn
            text="Close"
            type="button"
            @click="emit('update:modelValue', false)"
          />
          <v-btn
            text="Save"
            color="secondary"
            type="submit"
          />
        </v-card-actions>
      </v-card>
    </form>
  </v-dialog>
</template>
