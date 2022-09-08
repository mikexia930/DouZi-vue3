<template>
  <a-pagination v-bind="$props"/>
</template>

<script lang="ts">
import { defineComponent, h } from 'vue';
import DIcon from '@/common/components/elements/DIcon.vue';
import { getI18n } from '@/i18n/lib';

import type { PropType } from 'vue';

export const defaultShowTotal = (total: number, range: number[]) =>
  getI18n('table.pagination.current', { start: range[0], end: range[1], total: total });

const defaultShowSizeChanger = true;

const defaultShowQuickJumper = false;

export const defaultItemRender = ({
  page,
  type,
  originalElement
}: {
  page: number;
  type: string;
  originalElement: any;
}) => {
  if (type === 'prev') {
    return h(DIcon, { type: 'left-outlined', size: 'xs' });
  } else if (type === 'next') {
    return h(DIcon, { type: 'right-outlined', size: 'xs' });
  } else {
    return originalElement;
  }
};

export default defineComponent({
  name: 'TPagination',
  props: {
    total: Number,
    defaultCurrent: Number,
    disabled: { type: Boolean, default: undefined },
    current: Number,
    defaultPageSize: Number,
    pageSize: Number,
    hideOnSinglePage: { type: Boolean, default: undefined },
    showSizeChanger: { type: Boolean, default: defaultShowSizeChanger },
    pageSizeOptions: Array as PropType<(string | number)[]>,
    buildOptionText: Function as PropType<(opt: { value: any }) => any>,
    showQuickJumper: {
      type: [Boolean, Object] as PropType<boolean | { goButton?: any }>,
      default: defaultShowQuickJumper
    },
    showTotal: {
      type: Function as PropType<(total: number, range: [number, number]) => any>,
      default: defaultShowTotal
    },
    size: String as PropType<'default' | 'small'>,
    simple: { type: Boolean, default: undefined },
    locale: Object,
    prefixCls: String,
    selectPrefixCls: String,
    totalBoundaryShowSizeChanger: Number,
    selectComponentClass: String,
    itemRender: {
      type: Function as PropType<
        (opt: {
          page: number;
          type: 'page' | 'prev' | 'next' | 'jump-prev' | 'jump-next';
          originalElement: any;
        }) => any
      >,
      default: defaultItemRender
    },
    role: String,
    responsive: Boolean,
    showLessItems: { type: Boolean, default: undefined },
    onChange: Function as PropType<(page: number, pageSize: number) => void>,
    onShowSizeChange: Function as PropType<(current: number, size: number) => void>,
    'onUpdate:current': Function as PropType<(current: number) => void>,
    'onUpdate:pageSize': Function as PropType<(size: number) => void>
  }
});
</script>