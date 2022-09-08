<template>
  <a-popover
    v-bind="$attrs"
    v-model:visible="curVisible"
  >
    <template #content>
      <slot/>
    </template>
    <slot name="anchor" />
  </a-popover>
</template>

<script lang="ts">
export default {
  name: 'DPopover'
};
</script>

<script lang="ts" setup>
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    visible?: boolean;
  }>(),
  {
    visible: false
  }
);

const emits = defineEmits(['update:visible']);

const curVisible = computed({
  get: () => props.visible,
  set: value => {
    emits('update:visible', value)
  }
});
</script>

<style lang="less">
.ant-popover-content {
  .ant-popover-inner {
    .ant-popover-inner-content {
      @apply tw-p-2;
    }
  }
}
</style>
