<template>
  <component
    :is="componentIcons[type]"
    :style="{
      fontSize: curSize
    }"
  />
</template>

<script lang="ts">
export default {
  name: 'DIcon'
};
</script>

<script lang="ts" setup>
import {
  LeftOutlined,
  RightOutlined,
  DoubleRightOutlined,
  DoubleLeftOutlined,
  SwapRightOutlined,
  CalendarOutlined,
  UnlockOutlined,
  LockOutlined,
  ClockCircleOutlined,
  SearchOutlined,
  FilterOutlined,
  InboxOutlined,
  CaretUpOutlined,
  CaretDownOutlined,
  MoreOutlined,
  FunnelPlotOutlined
} from '@ant-design/icons-vue';
import { computed } from 'vue';

const componentIcons = {
  LeftOutlined,
  RightOutlined,
  DoubleRightOutlined,
  DoubleLeftOutlined,
  SwapRightOutlined,
  CalendarOutlined,
  UnlockOutlined,
  LockOutlined,
  ClockCircleOutlined,
  SearchOutlined,
  FilterOutlined,
  InboxOutlined,
  CaretUpOutlined,
  CaretDownOutlined,
  MoreOutlined,
  FunnelPlotOutlined
};

const props = withDefaults(
  defineProps<{
    type: keyof typeof componentIcons;
    size?: string;
  }>(),
  {
    type: '',
    size: 'base'
  }
);

const curSize = computed(() => {
  let useSize = '1rem';
  switch (props.size) {
    case 'xxs':
      useSize = '0.5rem';
      break;
    case 'xs':
      useSize = '0.75rem';
      break;
    case 'sm':
      useSize = '0.875rem';
      break;
    case 'lg':
      useSize = '1.125rem';
      break;
    case 'xl':
      useSize = '1.25rem';
      break;
    case '2xl':
      useSize = '1.5rem';
      break;
    case '3xl':
      useSize = '1.875rem';
      break;
    case '4xl':
      useSize = '2.25rem';
      break;
    case '5xl':
      useSize = '3rem';
      break;
    case '7xl':
      useSize = '4rem';
      break;
    case '8xl':
      useSize = '6rem';
      break;
    case '9xl':
      useSize = '8rem';
      break;
    case '10xl':
      useSize = '10rem';
      break;
    default:
      break;
  }
  return useSize;
});
</script>
