<template>
  <div :title="cellData" v-if="curDataIndex === 'displayName'">
    <a class="t-table-link" @click.prevent="handleOperate('detail')">{{ cellData }}</a>
  </div>
  <div :title="cellData" v-else>
    {{ cellData }}
  </div>
</template>

<script lang="ts">
export default {
  name: 'TableIndexItem'
}
</script>

<script lang="ts" setup>
import { computed } from 'vue';
import { formatNumberDot } from '@/common/libs/numberLib';
import type { TableColumn } from '@/common/components/table/config';

type TableValue = string | number;

const props = defineProps<{
  record: Record<string, TableValue | TableValue[] | { value: TableValue | TableValue[] }>;
  dataTitleItem: TableColumn;
}>();

const curDataIndex = computed(() => {
  return props.dataTitleItem.dataIndex;
})

const cellData = computed(() => {
  const { dataIndex } = props.dataTitleItem;
  let value = props.record[dataIndex];
  if (dataIndex === 'usersNum') {
    value = formatNumberDot(String(value));
  }
  return value;
});

const emits = defineEmits(['operateClick']);

function handleOperate(operator: string) {
  emits('operateClick', {
    type: operator,
    value: { ...props.record }
  });
}
</script>
