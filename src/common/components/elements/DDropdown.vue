<template>
  <a-dropdown v-bind="$attrs">
    <template #overlay>
      <a-menu @click="handleMenuClick">
        <a-menu-item
          :disabled="item.disabled"
          :class="{ 'li-on': selected === item.value }"
          :key="item.value"
          v-for="item in data"
        >
          <template v-if="item.icon">
            <DIcon :type="item.icon" size="sm" />
          </template>
          <span>{{ item.label }}</span>
        </a-menu-item>
      </a-menu>
    </template>
    <slot name="anchor" />
  </a-dropdown>
</template>

<script lang="ts">
export default {
  name: 'DDropdown'
};

export interface IFElmDropdownData {
  value: string;
  label: string;
  icon?: string;
  disabled?: boolean;
}
</script>

<script lang="ts" setup>
import DIcon from '@/common/components/elements/DIcon.vue';

withDefaults(
  defineProps<{
    data: IFElmDropdownData[];
    selected?: string;
    trigger?: string;
  }>(),
  {
    selected: '',
    trigger: 'click'
  }
);

const emits = defineEmits(['update:selected']);
function handleMenuClick(selected: any) {
  emits('update:selected', selected.value);
}
</script>
