<template>
  <div class="tw-text-center">
    <div v-if="isUseIcon" class="tw-text-neutral-3">
      <DIcon
        :type="curIcon"
        size="4xl"
      />
    </div>
    <div class="tw-text-neutral-4 tw-text-center">{{ curNotice }}</div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'DResult'
};
</script>

<script lang="ts" setup>
import {ref, watchEffect} from 'vue';
import DIcon from '@/common/components/elements/DIcon.vue';
import {getI18n} from '@/i18n/lib';

const props = withDefaults(
  defineProps<{
    type?: string;
    msg?: string;
    isUseIcon?: boolean;
  }>(),
  {
    type: 'NoData',
    isUseIcon: true
  }
);

const curIcon = ref('');
const curNotice = ref('');
watchEffect(() => {
  let typeMsg = '';
  switch (props.type) {
    case 'NoData':
      curIcon.value = 'InboxOutlined';
      typeMsg = getI18n('notice.noData');
      break;
  }
  curNotice.value = props.msg || typeMsg;
})
</script>
