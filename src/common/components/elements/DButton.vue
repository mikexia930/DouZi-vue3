<template>
  <a-button v-bind="$attrs">
    <slot>{{ name }}</slot>
  </a-button>
</template>

<script lang="ts">
export default {
  name: 'DButton'
};
</script>

<script lang="ts" setup>
withDefaults(
  defineProps<{
    name?: string;
  }>(),
  {
    name: ''
  }
);
</script>
