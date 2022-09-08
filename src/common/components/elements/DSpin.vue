<template>
  <a-spin v-bind="$attrs" size="small">
    <div class="spin-content">
      <slot/>
    </div>
  </a-spin>
</template>

<script lang="ts">
export default {
  name: 'DSpin'
};
</script>
