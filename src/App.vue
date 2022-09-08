<template>
  <a-config-provider :locale="locale">
    <div class="tw-h-full tw-w-full">
      <router-view />
    </div>
  </a-config-provider>
</template>

<script setup lang="ts">
import en from 'ant-design-vue/es/locale/en_GB';
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import { computed, onBeforeMount, watch } from 'vue';
import { storeCommon } from './common/stores/storeCommon';
import { i18n } from '@/i18n/i18n';

watch(
  () => storeCommon.lang,
  () => {
    i18n.global.locale = storeCommon.lang;
  }
);

const locale = computed(() => {
  if (storeCommon.lang === 'zh_CN') {
    return zhCN;
  } else {
    return en;
  }
});

onBeforeMount(async () => {
  i18n.global.locale = storeCommon.lang;
});
</script>
