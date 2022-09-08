<template>
  <a-checkbox-group v-model:value="curChecked">
    <div
      :key="filter.key || filter.value"
      v-for="filter in data"
      v-show="!filterValue || (filter.label || filter.value).toLowerCase().indexOf(filterValue.toLowerCase()) !== -1"
    >
      <a-checkbox
        :key="filter.key || filter.value"
        :value="filter.key || filter.value"
      >
        {{ filter.label || filter.value }}
      </a-checkbox>
    </div>
  </a-checkbox-group>
</template>

<script lang="ts">
export default {
  name: 'DCheckboxGroup'
};
</script>

<script lang="ts" setup>
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    checked?: any[];
    data: any[];
    filterValue?: string; // 筛选checkbox选择
  }>(),
  {
    checked: () => [],
    filterValue: ''
  }
);

const emits = defineEmits(['update:checked']);

const curChecked = computed({
  get: () => props.checked,
  set: value => emits('update:checked', value)
});
</script>
