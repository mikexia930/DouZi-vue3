<template>
  <div>{{ record[dataTitleItem.dataIndex] }}</div>
</template>
<script lang="ts" setup>
withDefaults(
  defineProps<{
    record?: any;
    dataTitleItem: any;
  }>(),
  {
    record: {}
  }
);
</script>
