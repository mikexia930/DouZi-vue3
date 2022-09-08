<template>
  <x-table
    :is-use-storage="config.isUseStorage"
    :is-fix-header="true"
    :columns="tableColumns"
    :title="tableHeaderData"
    :config="config"
    :data="tableData"
    :footer-data="footerData"
    :page-data="mPageData"
    :sort-data="sortData"
    :filter-data="filterData"
    :search-data="searchData"
    :pivot-table="pivotTable"
    :expand-data="expandData"
    :expand-span-column-data="expandSpanColumnData"
    :expand-action="expandAction"
    :custom-cell="customCell"
    :checkbox-selected-data="checkboxSelectedData"
    @handleTable="handleTable"
  >
    <!--  空数据  -->
    <template #nodata>
      <DResult />
    </template>
    <!--  无结果  -->
    <template #noresult>
      <DResult />
    </template>
    <!--  分页器 -->
    <template v-slot:page="{ total }">
      <slot name="page">
        <div class="tw-mt-4 tw-w-full">
          <DPagination
            v-model:current="mPageData.page"
            v-model:page-size="mPageData.size"
            :total="total"
            :showSizeChanger="config.showSizeChanger"
            :size="config.paginationSize"
          />
        </div>
      </slot>
    </template>
    <!--  拖拽图标  -->
    <template #th-drag>
      <DIcon size="sm" type="MoreOutlined" />
    </template>
    <!--  排序  -->
    <template
      v-for="sortIndex in sortDataIndexes"
      v-slot:[`th-sort-${sortIndex}`]="{ record }"
      :key="sortIndex"
    >
      <span @click="handleSort(sortIndex, record.sort)" class="sort-icon">
        <DIcon size="sm" :class="{ 'sort-up': record.sort === 'up' }" type="CaretUpOutlined" />
        <DIcon size="sm" :class="{ 'sort-down': record.sort === 'down' }" type="CaretDownOutlined" />
      </span>
    </template>
    <!--  搜索  -->
    <template
      v-for="(value, dataIndex) in searchState.values"
      :key="dataIndex"
      v-slot:[`th-search-${dataIndex}`]
    >
      <DPopover
        placement="bottom"
        trigger="click"
        v-model:visible="searchState.showStates[dataIndex]"
        :getPopupContainer="getPopupContainer"
        :class-name="isHeaderFixed ? 'x-table-search-popover-fixed-header' : ''"
      >
        <DInput
          :allow-clear="true"
          :is-search="true"
          v-model:value="searchState.tempValues[dataIndex]"
          :placeholder="$t('notice.search')"
          @pressEnter="() => (searchState.showStates[dataIndex] = false)"
        />
      </DPopover>
    </template>
    <template
      v-for="(filter, dataIndex) in filterState.filters"
      :key="dataIndex"
      v-slot:[`th-filter-${dataIndex}`]
    >
      <DPopover
        placement="bottom"
        trigger="click"
        v-model:visible="filterState.showStates[dataIndex]"
        :class-name="getDropdownClassName(filterState.type[dataIndex])"
      >
        <!--  多选过滤  -->
        <div v-if="filterState.type[dataIndex] === 'multi'" style="width: 200px">
          <DInput
            :is-search="true"
            :allow-clear="true"
            v-model:value="filterState.searchText[dataIndex]"
          />
          <div class="tw-my-2">
            <DCheckboxGroup
              :data="filterState.filters[dataIndex]"
              v-model:checked="filterState.tempValues[dataIndex]"
              :filterValue="filterState.searchText[dataIndex]"
            />
          </div>
          <div class="tw-flex tw-justify-end tw-mt-2">
            <DButton
              size="small"
              type="text"
              @click="handleMultiFilterReset(dataIndex)"
              :name="$t('table.reset')"
            />
            <DButton
              class="tw-ml-2"
              size="small"
              type="primary"
              @click="handleMultiFilterConfirm(dataIndex)"
              :name="$t('table.confirm')"
            />
          </div>
        </div>
        <!--  单选过滤  -->
        <div v-else>
          <a-menu slot="overlay" :selectedKeys="filterState.tempValues[dataIndex]">
            <a-menu-item key="$$all" class="ant-dropdown-menu-item">
              <a @click.prevent="handleSingleFilterConfirm(dataIndex, { value: '$$all' })">
                {{ $t('table.all') }}
              </a>
            </a-menu-item>
            <a-menu-item
              :key="[].concat(filterItem.value)[0]"
              v-for="filterItem in filterState.filters[dataIndex]"
            >
              <a @click.prevent="handleSingleFilterConfirm(dataIndex, filterItem)">
                {{ filterItem.label }}
              </a>
            </a-menu-item>
          </a-menu>
        </div>
        <template #anchor>
          <DIcon
            type="FunnelPlotOutlined"
            size="sm"
            :class="{ active: filterState.values[dataIndex]?.length }"
          />
        </template>
      </DPopover>
    </template>
    <!--  表头  -->
    <template
      v-for="(dataTitleItem, dataTitleIndex) in columns"
      v-slot:[`th-${dataTitleItem.dataIndex}`]="{ text, record }"
      :key="dataTitleIndex"
    >
      <slot :name="`th-${dataTitleItem.dataIndex}`" :record="record" :text="text">
        <span>{{ text }}</span>
      </slot>
    </template>
    <!--  数据列  -->
    <template
      v-for="(dataTitleItem, dataTitleIndex) in columns"
      v-slot:[`td-${dataTitleItem.dataIndex}`]="{ record, expand }"
      :key="dataTitleIndex"
    >
      <template v-if="dataTitleItem.isNeedListener">
        <component
          :is="dataComponent"
          :record="record"
          :data-title-item="dataTitleItem"
          :expand="expand"
          @operate-click="handleColumnOperateClick"
        />
      </template>
      <template v-else>
        <component
          :is="dataComponent"
          :record="record"
          :data-title-item="dataTitleItem"
        />
      </template>
    </template>
    <!--数据扩展-->
    <template
      v-if="expandSpanColumnData"
      v-slot:[`td-${expandSpanColumnData.common.dataIndex}`]="{ record, rowKey }"
    >
      <component
        :is="dataComponent"
        :record="record"
        :data-title-item="expandSpanColumnData.common"
      />
    </template>
    <!--  Footer  -->
    <template
      v-for="(dataTitleItem, dataTitleIndex) in columns"
      v-slot:[`tf-${dataTitleItem.dataIndex}`]="{ record }"
      :key="dataTitleIndex"
    >
      <component :is="dataComponent" :record="record" :data-title-item="dataTitleItem" />
    </template>
  </x-table>
</template>
<script lang="ts">
export default {
  name: 'DTable'
};
</script>
<script lang="ts" setup>
import { computed, reactive, ref, watch, watchEffect } from 'vue';

import DIcon from '@/common/components/elements/DIcon.vue';
import DResult from '@/common/components/elements/DResult.vue';
import DButton from '@/common/components/elements/DButton.vue';
import DCheckboxGroup from '@/common/components/elements/DCheckboxGroup.vue';
import DTableItem from './DTableItem.vue';
import DInput from '@/common/components/elements/DInput.vue';
import DPagination from '@/common/components/elements/DPagination.vue';
import DPopover from '@/common/components/elements/DPopover.vue';
import XTable from './src/index.vue';
import { makeFilterByData } from './lib';
import { SortType, sortTypes, TableStyle } from './config';
import type {
  CustomCell,
  TableColumn,
  TableConfig,
  TableFilterData,
  TablePageData,
  TableSortData,
  IFTableClickBack,
  IFTableExpandAction,
  IFTableExpandData
} from './config';
import type { Component, ComponentPublicInstance } from 'vue';

const props = withDefaults(
  defineProps<{
    isFixHeader?: boolean;
    tableKey?: string;
    rowKey?: string;
    columns: TableColumn[];
    tableData: Record<string, any>[];
    pageData?: TablePageData;
    checkboxSelectedData?: string[] | number[];
    footerData?: Record<string, any>[];
    expandData?: IFTableExpandData;
    expandAction?: IFTableExpandAction;
    expandSpanColumnData?: { common: { [dataIndex: string]: string } };
    customCell?: CustomCell;
    dataComponent?: Component;
    tableConfig?: TableConfig;
  }>(),
  {
    isFixHeader: true,
    tableKey: 'x-table',
    rowKey: 'key',
    dataComponent: DTableItem
  }
);

const emit = defineEmits(['columnChange', 'checkbox', 'operateClick', 'update:pageData']);

const config = computed<TableConfig>(() => ({
  isUseStorage: false,
  isSticky: true,
  key: props.tableKey,
  rowKey: props.rowKey,
  scrollWidth: '100%',
  scrollHeight: '100%',
  border: TableStyle.BORDER_BODY,
  noWrap: true,
  isUseNoWrapTitle: false,
  minWidth: '80px',
  showSizeChanger: true,
  paginationSize: '',
  ...props.tableConfig
}));

const tableColumns = computed(() =>
  props.columns.map(c => {
    const {
      filterable: filter,
      searchable: search,
      dataIndex,
      dragGroup,
      resizeable,
      align,
      sticky,
      width
    } = c;
    const { dataIndex: sortDataIndex, sortType } = sortData.value;
    return {
      dataIndex,
      sort: sortDataIndex === dataIndex ? sortType : 'init',
      filter,
      search,
      dragGroup,
      resizeable,
      align,
      sticky,
      width
    };
  })
);

const tableHeaderData = computed(() => [
  props.columns.reduce((o, c) => {
    o[c.dataIndex] = c.title;
    return o;
  }, {} as Record<string, string>)
]);

const sortData = ref<TableSortData>({
  dataIndex: '',
  sortType: SortType.INIT
});

const sortDataIndexes = computed(() => props.columns.filter(c => c.sortable).map(c => c.dataIndex));

const filterData = computed<TableFilterData>(() => ({ ...filterState.values }));

const pivotTable = computed(() =>
  props.columns.map(c => c.dataIndex).filter(i => i.startsWith('g'))
);

const mPageData = reactive<TablePageData>({
  page: props.pageData?.page || 1,
  size: props.pageData?.size || props.tableConfig?.defaultPageSize || 20,
  total: props.pageData?.total || 0
});

const searchState = reactive<{
  tempValues: Record<string, string>;
  values: Record<string, string>;
  showStates: Record<string, boolean>;
}>({
  tempValues: {},
  values: {},
  showStates: {}
});

const filterState = reactive<{
  type: Record<string, 'single' | 'multi'>;
  tempValues: Record<string, any[]>;
  values: Record<string, any[]>;
  filters: Record<string, any[]>;
  showStates: Record<string, boolean>;
  searchText: Record<string, string>;
}>({
  type: {},
  tempValues: {}, // 临时选中值
  values: {}, // 选中值
  filters: {}, // 选项
  showStates: {}, // 显示状态
  searchText: {} // 搜索关键字
});

const searchData = computed(() => searchState.values);

const isHeaderFixed = ref(false);

const handleTable = ({ type, data }: any) => {
  switch (type) {
    case 'page':
    case 'search':
    case 'filter':
      if (data.page) {
        mPageData && (mPageData.page = data.page);
      }
      break;
    case 'headerFixedChange':
      isHeaderFixed.value = data.isFixed;
      // TODO: fixed 后位置不对，先隐藏
      props.columns
        .filter(c => c.searchable)
        .forEach(c => {
          searchState.showStates[c.dataIndex] = false;
        });
      props.columns
        .filter(c => c.filterable && c.filterMode === 'multi')
        .forEach(c => {
          filterState.showStates[c.dataIndex] = false;
        });
      break;
    case 'columnChange':
      emit('columnChange', {
        indexOld: data.oldIndex,
        indexNew: data.newIndex
      });
      break;
    case 'checkbox':
      emit('checkbox', {
        select: data.select
      });
      break;
    default:
      break;
  }
};

const handleSort = (dataIndex: string, sortType: SortType) => {
  const index = Math.max(sortTypes.indexOf(sortType), 0);
  sortData.value = {
    dataIndex,
    sortType: sortTypes[(index + 1) % sortTypes.length] // 循环取值
  };
};

const getDropdownClassName = (type: 'single' | 'multi') => {
  return `${
    isHeaderFixed.value ? 'x-table-filter-popover-fixed-header' : ''
  } x-table-filter-${type}`;
};

const handleMultiFilterReset = (dataIndex: string) => {
  const { values, tempValues, showStates, searchText } = filterState;
  values[dataIndex] = [];
  tempValues[dataIndex] = [];
  showStates[dataIndex] = false;
  setTimeout(() => (searchText[dataIndex] = ''));
};

const handleMultiFilterConfirm = (dataIndex: string) => {
  const { values, tempValues, showStates, searchText } = filterState;
  showStates[dataIndex] = false;
  values[dataIndex] = [...tempValues[dataIndex]];
  setTimeout(() => (searchText[dataIndex] = ''));
};

const handleSingleFilterConfirm = (dataIndex: string, filter: any) => {
  const { values, showStates, searchText, tempValues } = filterState;
  showStates[dataIndex] = false;
  tempValues[dataIndex] = [].concat(filter.value);
  if (filter.value === '$$all') {
    values[dataIndex] = [];
  } else {
    values[dataIndex] = [].concat(filter.value);
  }
  setTimeout(() => (searchText[dataIndex] = ''));
};

const table = ref<ComponentPublicInstance | null>(null);

const getPopupContainer = () => {
  return table.value?.$el;
};

watchEffect(() => {
  // 搜索后，页码大于结果数量时，重置页码
  if (mPageData.size * (mPageData.page - 1) > props.tableData.length) {
    mPageData.page = 1;
  }
});

const initSearchState = () => {
  props.columns
    .filter(c => c.searchable)
    .forEach(c => {
      searchState.showStates[c.dataIndex] = false;
      searchState.tempValues[c.dataIndex] = '';
      searchState.values[c.dataIndex] = '';
    });
};

const initFilterState = () => {
  props.columns
    .filter(c => c.filterable)
    .forEach(c => {
      filterState.type[c.dataIndex] = c.filterMode === 'multi' ? 'multi' : 'single';
      filterState.filters[c.dataIndex] =
        c.filters || makeFilterByData(props.tableData, c.dataIndex);

      filterState.showStates[c.dataIndex] = filterState.showStates[c.dataIndex] || false;
      filterState.tempValues[c.dataIndex] =
        filterState.tempValues[c.dataIndex] || (c.filterMode === 'multi' ? [] : ['$$all']);
      filterState.values[c.dataIndex] = filterState.values[c.dataIndex] || [];
      filterState.searchText[c.dataIndex] = filterState.searchText[c.dataIndex] || '';
    });
};

watch(
  () => searchState.showStates,
  states => {
    if (!Object.values(states).find(s => s)) {
      searchState.values = { ...searchState.tempValues };
    }
  },
  {
    flush: 'post',
    deep: true
  }
);

watch(
  () => props.columns,
  () => {
    initSearchState();
    initFilterState();
  }
);

initSearchState();
initFilterState();

/**
 * 接受表格单元的click事件
 */
function handleColumnOperateClick(payload: IFTableClickBack) {
  emit('operateClick', payload);
}
</script>

<style lang="less" scoped>
.x-table-wrapper {
  position: relative;
}
:deep(.x-table-area) {
  table {
    td {
      padding: 13px 0;
      .x-td,
      .x-td-nowrap {
        padding: 0 16px;
        > div {
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
      &.is-summary {
        font-weight: 500;
      }
      &.has-group-cluster {
        .x-td-nowrap {
          padding-right: 32px;
          i {
            position: absolute;
            display: none !important;
            right: 8px;
          }
        }
        &:hover {
          .x-td-nowrap i {
            display: inline-block !important;
          }
        }
      }
    }
    thead {
      font-weight: 500;
      td {
        .x-td-nowrap {
          text-overflow: unset;
          display: flex;
          align-items: center;
          > span {
            flex: 0 0 auto;
          }
          > span:first-child {
            flex: 0 1 auto;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
      }
      .sort-icon {
        width: 16px;
        display: inline-block;
        vertical-align: middle;
        position: relative;
        top: -4px;
        margin-left: 4px;
        i {
          height: 8px !important;
          display: block !important;
        }
        .sort-up {
          color: var(--primary-6);
        }
        .sort-down {
          color: var(--primary-6);
        }
      }
      .x-search,
      .x-filter {
        @apply tw-inline-flex tw-cursor-pointer tw-ml-1 tw-leading-none;
        span.active {
          color: var(--primary-6);
        }
      }
      .x-resize-dom-handle {
        top: 14px;
      }
      .x-drag-dom-handle {
        left: 1px !important;
        top: 10px !important;
      }
    }
    tbody {
      tr {
        &:hover {
          td {
            background-color: #fafafa;
          }
        }
      }
      td {
        color: var(--neutral-6);
        .xd-color-thin {
          color: var(--neutral-5);
        }
        &.has-retention {
          color: var(--neutral-7);
          .xd-color-thin {
            color: var(--neutral-6);
          }
          .x-td-nowrap {
            .x-table-data-item {
              &.with-group ~ i {
                color: var(--neutral-6) !important;
              }
            }
          }
        }
        .x-td-nowrap {
          .x-table-data-item {
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
      }
    }
    tfoot {
      td {
        background: var(--neutral-0) !important;
        .xd-color-thin {
          @apply tw-text-neutral-5;
        }
      }
    }
  }
}
</style>
<style lang="less">
.x-table-filter-popover {
  .ant-popover-content {
    .ant-popover-inner-content {
      min-width: unset;
    }
  }
}
.x-table-filter-popover-fixed-header {
  position: fixed;
  top: 40px;
}
.x-table-search-popover-fixed-header {
  position: fixed;
  top: 32px;
}
.x-table-filter-multi {
  .ant-checkbox-group {
    @apply tw-flex tw-flex-col tw-max-h-52 tw-overflow-auto;
    .ant-checkbox-wrapper {
      @apply tw-ml-1 tw-py-1;
    }
    .ant-checkbox-group-item {
    }
  }
}
.x-table-filter-single {
  .ant-popover-inner {
    .ant-popover-inner-content {
      @apply tw-p-1;
    }
  }

  .ant-menu-vertical {
    @apply tw-border-none;
    .ant-menu-item {
      @apply tw-rounded tw-m-0 tw-px-2 tw-h-7 tw-leading-7;
      .ant-menu-title-content {
        @apply tw-leading-7;
      }
      & + .ant-menu-item {
        @apply tw-mt-1;
      }
    }
  }
}
</style>
