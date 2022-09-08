<template>
  <div class="tw-m-10">
    <div>
      <DDatePicker @change="handleDatePicker"/>
    </div>
    <div class="tw-mt-4">
      <h3>{{ $t('index.title') }}</h3>
      <TableIndex :config-data="curListData.config" :index-data="curListData.data"/>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'ModuleIndex'
}
</script>

<script lang="ts" setup>
import {fetchIndexList} from './requests/index';
import {onBeforeMount, reactive, ref, watch} from 'vue';
import DDatePicker from '@/common/components/datePicker/DDatePicker.vue';
import type {IFDatePickerChooseBack} from '@/common/components/datePicker/config';
import type {IFIndexList} from '@/modules/index/configs/config';
import {forEach} from '@/common/libs/lodashLib';
import TableIndex from './components/table/TableIndex.vue';
import DInput from '@/common/components/elements/DInput.vue';

onBeforeMount(async() => {
  await getListData();
})

function getListData() {
  fetchIndexList().then((result: any) => {
    console.log(result)
    collectIndexList(result.data);
  })
}

const curListData = reactive<{
  dataSource: IFIndexList[];
  data: IFIndexList[];
  config: {
    subjects: string[];
    createTypes: string[];
    creators: string[];
    refreshTypes: string[];
  };
}>({
  dataSource: [],
  data: [],
  config: {
    subjects: [],
    createTypes: [],
    creators: [],
    refreshTypes: [],
  }
});

function collectIndexList(listData: IFIndexList[]) {
  const subjects: string[] = [];
  const createTypes: string[] = [];
  const creators: string[] = [];
  const refreshTypes: string[] = [];

  forEach(listData, (itemData) => {
    const { refreshTypeCn, subjectCn, tagTypeCn, userName, clusterId, clusterName, displayName } = itemData;

    if (!subjects.includes(subjectCn)) {
      subjects.push(subjectCn);
    }
    if (!refreshTypes.includes(refreshTypeCn)) {
      refreshTypes.push(refreshTypeCn);
    }
    if (!createTypes.includes(tagTypeCn)) {
      createTypes.push(tagTypeCn);
    }
    if (!creators.includes(userName)) {
      creators.push(userName);
    }
  });
  curListData.config.subjects = subjects;
  curListData.config.createTypes = createTypes;
  curListData.config.creators = creators;
  curListData.config.refreshTypes = refreshTypes;
  curListData.dataSource = listData;
  curListData.data = listData;
  console.log(curListData)
}

function handleDatePicker(payload: IFDatePickerChooseBack) {
  console.log('payload', payload);
}

const searchVal = ref('');
watch(
  () => searchVal,
  (val) => {
    console.log('searchVal', searchVal);
  }
)
</script>