<template>
  <a-input
    v-bind="$attrs"
    v-model:value="curValue"
    :suffix="isSearch ? undefined : suffix"
  >
    <template v-if="isAddonBefore" #addonBefore>
      <slot name="addonBefore" />
    </template>
    <template v-if="isSearch" #suffix>
      <DIcon type="SearchOutlined" />
    </template>
  </a-input>
</template>

<script lang="ts">
export default {
  name: 'DInput'
};
</script>

<script lang="ts" setup>
import { computed } from 'vue';

import DIcon from '@/common/components/elements/DIcon.vue';

const props = withDefaults(
  defineProps<{
    isAddonBefore?: boolean;
    isSearch?: boolean;
    value?: string;
    suffix?: string;
  }>(),
  {
    isSearch: false,
    isAddonBefore: false,
    value: '',
    suffix: ''
  }
);

const emits = defineEmits(['update:value']);

const curValue = computed({
  get: () => props.value,
  set: value => emits('update:value', value)
});
</script>
