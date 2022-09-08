<template>
  <DTable
    table-key="tableINDEX"
    row-key="clusterId"
    :table-config="tableConfig"
    :columns="curTableColumns"
    :table-data="indexData"
    :data-component="TableIndexItem"
    @operate-click="handleOperateClick"
  />
</template>

<script lang="ts">
export default {
  name: 'TableIndex'
};
</script>

<script lang="ts" setup>
import { computed } from 'vue';

import DTable from '@/common/components/table/DTable.vue';
import {TableStyle, numberAlign, Sticky} from '@/common/components/table/config';
import { forEach } from '@/common/libs/lodashLib';
import TableIndexItem from './TableIndexItem.vue';
import type {IFIndexList} from '@/modules/index/configs/config';

const props = withDefaults(
  defineProps<{
    indexData: IFIndexList[];
    configData: {
      subjects: string[];
      createTypes: string[];
      creators: string[];
      refreshTypes: string[];
    };
  }>(),
  {}
);

const tableConfig = {
  border: TableStyle.BORDER_ALL,
  minWidth: '160px',
  resizeMin: '120',
  isUseStorage: true
};

const curTableColumns = computed(() => {
  // 主体
  const subjectFilterData: Array<{ label: string; value: string }> = [];
  forEach(props.configData.subjects, subject => {
    subjectFilterData.push({
      label: subject,
      value: subject
    });
  });
  // 创建方式
  const createTypeFilterData: Array<{ label: string; value: string }> = [];
  forEach(props.configData.createTypes, createType => {
    createTypeFilterData.push({
      label: createType,
      value: createType
    });
  });
  // 创建者
  const creatorFilterData: Array<{ label: string; value: string }> = [];
  forEach(props.configData.creators, creator => {
    creatorFilterData.push({
      label: creator,
      value: creator
    });
  });
  // 刷新方式
  const refreshTypeFilterData: Array<{ label: string; value: string }> = [];
  forEach(props.configData.refreshTypes, refreshType => {
    refreshTypeFilterData.push({
      label: refreshType,
      value: refreshType
    });
  });

  return [
    {
      isNeedListener: true,
      title: '显示名',
      dataIndex: 'displayName',
      sticky: Sticky.LEFT,
      resizeable: true
    },
    {
      title: '主体',
      dataIndex: 'subjectCn',
      sticky: Sticky.LEFT,
      filters: subjectFilterData,
      filterMode: 'single',
      filterable: true,
      resizeable: true
    },
    {
      title: '备注',
      dataIndex: 'remarks',
      resizeable: true,
      dragGroup: 'table_user_tag'
    },
    {
      title: '数量',
      dataIndex: 'usersNum',
      align: { ...numberAlign },
      sortable: true,
      resizeable: true,
      dragGroup: 'table_user_tag'
    },
    {
      title: '类型',
      dataIndex: 'tagTypeCn',
      filters: createTypeFilterData,
      filterMode: 'single',
      filterable: true,
      resizeable: true,
      dragGroup: 'table_user_tag'
    },
    {
      title: '创建者',
      dataIndex: 'userName',
      filters: creatorFilterData,
      filterMode: 'single',
      filterable: true,
      resizeable: true,
      dragGroup: 'table_user_tag'
    },
    {
      title: '刷新方式',
      dataIndex: 'refreshTypeCn',
      filters: refreshTypeFilterData,
      filterMode: 'multi',
      filterable: true,
      resizeable: true,
      dragGroup: 'table_user_tag'
    },
    {
      title: '刷新时间',
      dataIndex: 'refreshTime',
      sortable: true,
      width: '170px',
      resizeable: true,
      dragGroup: 'table_user_tag'
    }
  ];
});

const emits = defineEmits(['click']);
function handleOperateClick(payload: any) {
  emits('click', payload);
}
</script>
