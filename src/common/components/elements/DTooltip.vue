<template>
  <a-tooltip v-bind="$attrs" :destroyTooltipOnHide="true">
    <template #title>
      <span>
        <slot/>
      </span>
    </template>
    <slot name="anchor" />
  </a-tooltip>
</template>

<script lang="ts">
export default {
  name: 'DTooltip'
};
</script>
