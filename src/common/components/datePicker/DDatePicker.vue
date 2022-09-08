<template>
  <DPopover
    trigger="click"
    placement="bottomLeft"
    v-model:visible="curVisible"
  >
    <div
      class="d-datetime-picker"
      :style="{ width: curWidth, overflow: 'hidden' }"
    >
      <div class="d-datetime-tab" v-if="isRange">
        <div class="d-tab-zone" v-if="isNeedTab">
          <div
            :class="{
                'tab-selected': currentTab === 'active'
              }"
            @click="handleTab('active')"
          >
            {{ $t('datePicker.active') }}
          </div>
          <div
            :class="{
                'tab-selected': currentTab === 'static'
              }"
            @click="handleTab('static')"
            :style="{ cursor: 'pointer' }"
          >
            {{ $t('datePicker.static') }}
          </div>
        </div>
        <div v-else></div>
        <div class="d-datetime-show">
          <span v-if="currentTab === 'active'">{{ showActiveDatetime }}</span>
          <span v-if="currentTab === 'active'">|</span>
          <span>{{ showStaticDatetime }}</span>
        </div>
      </div>
      <div class="d-datetime-zone">
        <div class="d-datetime-choose">
          <div class="d-datetime-title" v-if="isRange">
            <div>
              {{ $t('datePicker.beginDatetime') }}
            </div>
            <div>
              {{ $t('datePicker.endDatetime') }}
            </div>
          </div>
          <XDatetimePicker
            :current-utc="storeCommon.timezone"
            :language="curLang"
            :use-h-m-s="useHMS"
            :popover-h-m-s="popoverHMS"
            :datetime="selected"
            :limit="curLimit"
            :is-range="isRange"
            :choose-span="chooseSpan"
            :is-week-begin-from-sunday="isWeekBeginFromSunday"
            :is-hide-year-month-arrow="false"
            @handleDatetime="handleDatetime"
          >
            <template v-slot:showTime="{ hour, minute }">
              <DIcon type="ClockCircleOutlined" class="tw-mr-1" />
              {{ hour }}:{{ minute }}
            </template>
            <template v-slot:deductYear>
              <DIcon type="DoubleLeftOutlined" />
            </template>
            <template v-slot:deductMonth>
              <DIcon type="LeftOutlined" />
            </template>
            <template v-slot:addYear>
              <DIcon type="DoubleRightOutlined" />
            </template>
            <template v-slot:addMonth>
              <DIcon type="RightOutlined" />
            </template>
          </XDatetimePicker>
        </div>
        <div class="d-datetime-quicker" v-if="isNeedQuicker">
          <div class="d-datetime-title">
            <div>{{ $t('datePicker.quickChoice') }}</div>
          </div>
          <div class="d-quicker-list">
            <ul>
              <li v-for="quickSelection in quickSelections" :key="quickSelection.key">
                <DButton
                  size="small"
                  :name="quickSelection.name"
                  :type="quickSelection.key === currentQuickSelected ? 'primary' : null"
                  @click="handleQuick(quickSelection.key)"
                />
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="d-datetime-confirm">
        <div>
          <template v-if="isRange">{{ curTimezoneIntro }}</template>
        </div>
        <div class="d-datetime-btn">
          <DButton
            type="text"
            size="small"
            :name="$t('datePicker.cancel')"
            @click="handleCancel"
          />
          <DButton
            size="small"
            type="primary"
            :name="$t('datePicker.confirm')"
            @click="handleConfirm"
          />
        </div>
      </div>
    </div>
    <template #anchor>
      <div class="tw-flex tw-items-center tw-relative" style="width: 240px">
        <template v-if="!isRange">
          <DButton>
            <span class="d-datetime-picker-show">
              <DIcon type="CalendarOutlined" />
              <span>{{ showDatetime }}</span>
            </span>
          </DButton>
        </template>
        <template v-else>
          <DButton>
            <span class="d-datetime-picker-show">
              <DIcon type="CalendarOutlined" />
              <span>{{ showDatetime[0] }}</span>
              <DIcon type="SwapRightOutlined" />
              <span>{{ showDatetime[1] }}</span>
            </span>
          </DButton>
        </template>
      </div>
    </template>
  </DPopover>
</template>

<script lang="ts">
export default {
  name: 'DDatePicker',
};
</script>

<script lang="ts" setup>
import XDatetimePicker from 'x-datetimePicker-vue3';
import 'x-datetimePicker-vue3/dist/style.css';
import { computed, onBeforeMount, ref, watch } from 'vue';
import DIcon from '@/common/components/elements/DIcon.vue';
import DButton from '@/common/components/elements/DButton.vue';
import DPopover from '@/common/components/elements/DPopover.vue';
import { configQuickDatetime } from './config';
import { parseQuickDate, getUTCIns, formatDate, getFormat } from './lib';
import { storeCommon } from '@/common/stores/storeCommon';
import {getI18n} from '@/i18n/lib';

interface IFDate {
  begin: string | number;
  end: string | number;
}

const props = withDefaults(
  defineProps<{
    limit?: IFDate;
    datetime?: string[] | string;
    activeTab?: string;
    useHMS?: string;
    popoverHMS?: boolean;
    isRange?: boolean;
    chooseSpan?: string | number;
    quickSelected?: string;
    isNeedQuicker?: boolean;
    isNeedTab?: boolean;
    isWeekBeginFromSunday?: boolean;
  }>(),
  {
    activeTab: 'static',
    datetime: ['2022-05-01', '2022-06-01'],
    useHMS: '',
    popoverHMS: true,
    isRange: true,
    chooseSpan: '',
    quickSelected: '',
    isNeedQuicker: true,
    isNeedTab: true,
    isWeekBeginFromSunday: false
  }
);

watch(
  () => props.datetime,
  () => {
    initDatetime();
    getShowDatetime();
  }
);

watch(
  () => props.quickSelected,
  () => {
    initQuickSelected();
    getShowDatetime();
  }
);

const curWidth = computed(() => {
  return props.isRange ? (props.isNeedQuicker ? '655px' : '482px') : '240px';
})

const curTimezoneIntro = computed(() => {
  const { timezone } = storeCommon;
  let useTimezone = `${timezone}:00`;
  if (timezone >= 0) {
    useTimezone = `+${useTimezone}`;
  }
  return getI18n('datePicker.timezone', { timezone: useTimezone });
});

const curLang = computed(() => {
  let lang = 'zh-cn';
  if (storeCommon.lang) {
    switch (storeCommon.lang) {
      case 'en':
      case 'en_US':
        lang = 'en';
        break;
      case 'zh_CN':
      default:
        lang = 'zh-cn';
        break;
    }
  }
  return lang;
});

const curLimit = computed(() => {
  let limitData = props.limit || {
    begin: '',
    end: ''
  };
  return limitData;
});

const dateFormat = computed(() => {
  let dateFormat;
  let backFormat;
  if (props.useHMS) {
    backFormat = 'YYYY-MM-DD HH:mm:ss';
    switch (props.useHMS) {
      case 'hour':
      case 'minute':
        dateFormat = 'YYYY-MM-DD HH:mm';
        break;
      default:
        dateFormat = backFormat;
        break;
    }
  } else {
    dateFormat = 'YYYY-MM-DD';
    backFormat = dateFormat;
  }
  return {
    format: dateFormat,
    back: backFormat,
    emit: `${backFormat}`
  };
});

const quickSelections = computed(() => {
  return configQuickDatetime;
  // LD|2019-10-21 10:10:00|12 动态锁定时间 D|15|20 动态时间
});

onBeforeMount(() => {
  initDatetime();
  getShowDatetime();
});

const selected = ref<string[] | string>(props.datetime);
function initDatetime() {
  if (props.isRange) {
    if (props.datetime && Array.isArray(props.datetime) && props.datetime.length === 2) {
      selected.value = [...props.datetime];
    } else {
      selected.value = [
        getUTCIns().format(dateFormat.value.back),
        getUTCIns().format(dateFormat.value.back)
      ];
    }
  } else {
    if (typeof props.datetime === 'string') {
      selected.value = getUTCIns(props.datetime).format(dateFormat.value.back);
    } else {
      selected.value = getUTCIns().format(dateFormat.value.back);
    }
  }
  getInputShowDatetime();
  initQuickSelected();
  initChooseSpan();
}

/**
 * 设置显示时间
 */
let showDatetime = ref<string[] | string>(props.datetime);
function getInputShowDatetime() {
  const showDateFormat = 'YYYY-MM-DD';
  if (props.isRange) {
    showDatetime.value = [
      getUTCIns(selected.value[0]).format(showDateFormat),
      getUTCIns(selected.value[1]).format(showDateFormat)
    ];
  } else {
    if (typeof selected.value === 'string') {
      showDatetime.value = getUTCIns(selected.value).format(props.useHMS ? getFormat('time') : showDateFormat);
    }
  }
}

/**
 * 解构动态时间 LD|2019-10-21 10:10:00|12 动态锁定时间 D|15|20 动态时间
 */
let currentQuickSelected = ref(props.quickSelected);
let currentIsLockActiveBeginDatetime = ref(false);
let currentTab = ref(props.quickSelected ? 'active' : props.activeTab);

watch(
  () => props.activeTab,
  newVal => {
    currentTab.value = newVal;
  }
);

function initQuickSelected() {
  currentQuickSelected.value = '';
  currentIsLockActiveBeginDatetime.value = false;
  if (props.quickSelected) {
    const dateSplit = props.quickSelected.split('|');
    currentTab.value = 'active';
    if (dateSplit.length === 3) {
      if (dateSplit[0] === 'LD') {
        currentIsLockActiveBeginDatetime.value = true;
      }
    } else {
      currentQuickSelected.value = props.quickSelected;
    }
  }
}

function initChooseSpan() {
  if (props.isCompareDatetime) {
    // 时间区间不对
    const spanValue = parseInt(String(props.chooseSpan), 10);
    const endDate = getUTCIns(selected.value[0]).add(spanValue, 'second');
    if (Array.isArray(selected.value)) {
      selected.value[1] = endDate.format(dateFormat.value.back);
    }
  }
}

function resetWeekDay(beginDate: string, endDate: string) {
  let curBegin = beginDate;
  let curEnd = endDate;
  const weekBeginDay = getUTCIns(curBegin).day();
  if (weekBeginDay === 1) {
    if (props.isWeekBeginFromSunday) {
      curBegin = getUTCIns(curBegin).subtract(1, 'day').startOf('date').format(dateFormat.value.back);
      curEnd = getUTCIns(curEnd).subtract(1, 'day').endOf('date').format(dateFormat.value.back);
    }
  } else if (weekBeginDay === 0) {
    if (!props.isWeekBeginFromSunday) {
      curBegin = getUTCIns(curBegin).add(1, 'day').startOf('date').format(dateFormat.value.back);
      curEnd = getUTCIns(curEnd).add(1, 'day').endOf('date').format(dateFormat.value.back);
    }
  }
  return {
    begin: curBegin,
    end: curEnd
  };
}

function getQuickDatetime(quickKey: string) {
  let paresDateData: IFDate = {
    begin: '',
    end: ''
  };
  let tag = quickKey.substring(0, 2);
  if (tag !== 'LD') {
    tag = quickKey.substring(0, 1);
    paresDateData = parseQuickDate(quickKey, dateFormat.value.back);
    if (tag === 'W') {
      paresDateData = resetWeekDay(paresDateData.begin, paresDateData.end);
    }
  }
  return [paresDateData.begin, paresDateData.end];
}

/**
 * 获取右上角的显示时间
 */
let showStaticDatetime = ref('');
let showActiveDatetime = ref('');
function getShowDatetime() {
  let beginDatetime = '';
  let endDatetime = '';
  if (props.isRange) {
    beginDatetime = getUTCIns(selected.value[0]).format(dateFormat.value.format);
    endDatetime = getUTCIns(selected.value[1]).format(dateFormat.value.format);
    showStaticDatetime.value = `${beginDatetime} ~ ${endDatetime}`;
    if (currentTab.value === 'active') {
      const beginDiff = getDateDiff(beginDatetime);
      const endDiff = getDateDiff(endDatetime);
      if (endDiff === 0) {
        if (beginDiff === endDiff) {
          showActiveDatetime.value = getI18n('datePicker.today');
        } else {
          showActiveDatetime.value = getI18n('datePicker.recentDays', {
            days: beginDiff + 1
          });
        }
      } else if (endDiff === 1) {
        if (beginDiff === endDiff) {
          showActiveDatetime.value = getI18n('datePicker.yesterday');
        } else {
          showActiveDatetime.value = getI18n('datePicker.lastDays', { days: beginDiff });
        }
      } else {
        showActiveDatetime.value = `${getActiveDate(beginDatetime)} ~ ${getActiveDate(
          endDatetime
        )}`;
      }
    }
  } else {
    if (typeof selected.value === 'string') {
      beginDatetime = getUTCIns(selected.value).format(dateFormat.value.format);
      showStaticDatetime.value = `${beginDatetime}`;
      if (currentTab.value === 'active') {
        showActiveDatetime.value = `${getActiveDate(beginDatetime)}`;
      }
    }
  }
}

function getDateDiff(date: string) {
  const useData = formatDate(date, getFormat('date'));
  return getUTCIns().diff(getUTCIns(useData), 'day');
}

/**
 * 获取动态时间，三种格式 今日 昨日 过去N天
 * @param date
 * @return {string}
 */
function getActiveDate(date: string) {
  let backData = '';
  const diffDays = getDateDiff(date);
  if (diffDays === 0) {
    backData = getI18n('datePicker.today');
  } else if (diffDays === 1) {
    backData = getI18n('datePicker.yesterday');
  } else {
    backData = getI18n('datePicker.lastDays', { days: diffDays });
  }
  return backData;
}

/**
 * 如果是对比时间，则需要从快速选择切换到日期选择的时候，判断被对比时间是否锁定状态
 */
function handleDatetime(emitData: any) {
  currentQuickSelected.value = '';
  selected.value = emitData.value;
  getShowDatetime();
}

function handleTab(select: string) {
  currentTab.value = select;
  getShowDatetime();
}

function handleQuick(select: string) {
  currentQuickSelected.value = select;
  currentIsLockActiveBeginDatetime.value = false; // 日期快捷选择和锁定开始时间互斥
  selected.value = getQuickDatetime(select);
  if (curLimit.value.begin) {
    let beginDatetime: any;
    if (curLimit.value.begin === 'now') {
      beginDatetime = getUTCIns().format(dateFormat.value.back);
    } else if (curLimit.value.begin === 'today') {
      beginDatetime = getUTCIns().startOf('day').format(dateFormat.value.back);
    } else {
      beginDatetime = formatDate(String(curLimit.value.begin), dateFormat.value.back);
    }
    if (getUTCIns(selected.value[0]).isBefore(beginDatetime)) {
      selected.value[0] = beginDatetime;
    }
  }
  if (curLimit.value.end) {
    let endDatetime: any;
    if (curLimit.value.end === 'now') {
      endDatetime = getUTCIns().format(dateFormat.value.back);
    } else if (curLimit.value.end === 'today') {
      endDatetime = getUTCIns().endOf('day').format(dateFormat.value.back);
    }  else {
      endDatetime = formatDate(String(curLimit.value.end), dateFormat.value.back);
    }
    if (getUTCIns(selected.value[1]).isAfter(endDatetime)) {
      selected.value[1] = endDatetime;
    }
  }
  getShowDatetime();
}

let curVisible = ref(false);
watch(curVisible, visible => {
  console.log('visible', visible);
  if (!visible) {
    if (!isFromConfirm.value) {
      initDatetime();
    }
  } else {
    isFromConfirm.value = false;
  }
});

function handleCancel() {
  curVisible.value = false;
  initDatetime();
}

const emits = defineEmits(['change']);
let isFromConfirm = ref(false);
function handleConfirm() {
  let selectDatetime = selected.value;
  if (props.isRange) {
    let datetimeDiff = 0;
    if (props.isRange) {
      if (props.useHMS) {
        selectDatetime = [
          getUTCIns(selected.value[0]).startOf(props.useHMS as any).format(dateFormat.value.emit),
          getUTCIns(selected.value[1]).endOf(props.useHMS as any).format(dateFormat.value.emit)
        ];
      }
      datetimeDiff = getUTCIns(selectDatetime[1]).diff(getUTCIns(selectDatetime[0]), 'second');
    }
    let quickSelected = currentQuickSelected.value;
    if (currentTab.value === 'active') {
      if (!currentQuickSelected.value) {
        const lastEnd = getDateDiff(selectDatetime[1]);
        if (currentIsLockActiveBeginDatetime.value) {
          quickSelected = `LD|${selectDatetime[0]}|${lastEnd}`;
        } else {
          const lastBegin = getDateDiff(selectDatetime[0]);
          quickSelected = `D|${lastBegin}|${lastEnd}`;
        }
      }
    } else {
      currentIsLockActiveBeginDatetime.value = false;
      currentQuickSelected.value = '';
      quickSelected = '';
    }
    emits('change', {
      diff: datetimeDiff,
      begin: selectDatetime[0],
      end: selectDatetime[1],
      choose: quickSelected,
      unit: props.useHMS,
      type: 'ok'
    });
  } else {
    emits('change', {
      datetime: selectDatetime,
      unit: props.useHMS,
      type: 'ok'
    });
  }
  getInputShowDatetime();
  isFromConfirm.value = true;
  curVisible.value = false;
}
</script>

<style lang="less" scoped>
:deep(.x-datetime) {
  * {
    @apply tw-select-none;
  }
  @apply tw-box-border;
  > div {
    @apply tw-box-border;
    &:nth-child(1) {
      @apply tw-box-border;
    }
    &:nth-child(2) {
      @apply tw-border-l tw-border-neutral-2;
    }
    .x-single {
      @apply tw-box-border tw-text-base;
      width: 240px !important;
      .x-span {
        > div:nth-child(odd) {
          @apply tw-box-border;
          margin-top: -5px;
        }
      }
      .x-span,
      .x-show {
        @apply tw-box-border tw-px-3;
        a {
          @apply tw-text-neutral-5;
          &:hover {
            > i {
              @apply tw-text-primary-6;
            }
          }
        }
      }
      .x-span {
        > div:not(:nth-child(2)) {
          a:nth-child(1) {
            @apply tw-mr-3;
          }
        }
        > div:nth-child(2) {
          a {
            @apply tw-text-neutral-6 tw-font-bold;
          }
        }
      }
      .x-show {
        table {
          tr {
            td {
              @apply tw-box-border tw-h-8 tw-w-7;
              > span {
                @apply tw-leading-7;
              }
            }
            td:not(.x-limit) {
              &:hover {
                span:not(.x-selected):not(.x-range-ends) {
                  @apply tw-bg-primary-1;
                }
              }
            }
          }
        }
        .x-range-ends,
        .x-selected {
          @apply tw-bg-primary-6;
        }
        .x-in-range {
          @apply tw-bg-primary-1;
        }
      }
      .x-minute-show {
        bottom: 36px !important;
        left: 59px;
        width: 140px;
      }
      .x-show-time {
        @apply tw-border-none tw-overflow-hidden;
        width: 140px;
        box-shadow: 0px 0px 8px #ebeff0;
        > div {
          ul {
            > li:not(.x-limit):not(.x-time-selected) {
              &:hover {
                @apply tw-bg-primary-1;
              }
            }
          }
        }
        .x-time-selected {
          @apply tw-bg-primary-6;
        }
      }
    }
    .x-minute {
      @apply tw-flex tw-justify-center;
      > span {
        @apply tw-mx-3 tw-flex tw-items-center tw-h-8;
      }
    }
    .x-year,
    .x-month {
      td {
        height: 50px !important;
        > span {
          min-width: 60px;
          min-height: 28px;
        }
      }
    }
  }
}
.d-datetime-picker {
  @apply tw-relative;
  margin-top: -6px;
  .d-datetime-confirm {
    @apply tw-border-t tw-border-neutral-2 tw-box-border tw-flex tw-justify-between tw-pt-2;
    > div:nth-child(1) {
      @apply tw-text-sm tw-text-neutral-5 tw-flex tw-items-center;
    }
    > .d-datetime-btn {
      @apply tw-flex tw-justify-end tw-items-center tw-text-right tw-box-border;
      > button {
        @apply tw-w-16 tw-mr-3 tw-text-sm tw-h-6;
      }
    }
  }
  .d-datetime-tab {
    @apply tw-flex tw-justify-between tw-border-b tw-border-neutral-2 tw-h-10;
    .d-tab-zone {
      @apply tw-box-border tw-flex tw-pl-4 tw-pt-1;
      > div {
        @apply tw-box-border tw-cursor-pointer tw-py-2 tw-mr-8;
        min-width: 60px;
      }
      > div:not(.tab-selected) {
        &:hover {
          @apply tw-text-primary-6;
        }
      }
      > .tab-selected {
        @apply tw-text-primary-6 tw-border-b-2 tw-border-primary-6;
      }
    }
    .d-datetime-show {
      @apply tw-box-border tw-text-neutral-5 tw-text-sm tw-pt-3 tw-pr-3;
      > span:nth-child(2) {
        @apply tw-mx-2;
      }
    }
  }
  .d-datetime-zone {
    @apply tw-flex tw-justify-between;
    .d-datetime-title {
      > div {
        @apply tw-box-border tw-text-center tw-text-neutral-5 tw-text-sm;
        padding-top: 7px;
      }
    }
    .d-datetime-choose {
      .d-datetime-title {
        @apply tw-flex;
        > div {
          @apply tw-relative;
          width: 50%;
          &:nth-child(1) {
            > span {
              @apply tw-absolute tw-top-2;
              right: 10px;
            }
          }
          &:nth-child(2) {
            @apply tw-border-l tw-border-neutral-2;
          }
        }
      }
    }
    .d-datetime-choose {
      @apply tw-box-border tw-text-base;
      width: 500px;
    }
    .d-datetime-quicker {
      @apply tw-border-l tw-border-neutral-2;
      width: 182px;
      .d-quicker-list {
        @apply tw-box-border;
        min-height: 260px;
        padding: 0 4px;
        ul, li {
          padding: 0;
          margin: 0;
        }
        ul {
          @apply tw-flex tw-justify-center tw-flex-wrap tw-flex-shrink;
          li {
            @apply tw-box-border tw-overflow-hidden tw-flex tw-flex-grow tw-max-w-full tw-h-6;
            min-width: 50%;
            margin-top: 10px;
            padding: 0 3px;
            > button {
              @apply tw-text-sm tw-w-full;
              min-width: auto;
            }
            > button:not(.ant-btn-primary) {
              @apply tw-bg-neutral-2;
              border-color: transparent;
            }
          }
        }
      }
    }
  }
}
.d-datetime-picker-show {
  @apply tw-flex tw-items-center !important;
  > * {
    @apply tw-mr-2;
  }
  :nth-child(2) {
    @apply tw-ml-0 !important;
  }
}
.d-datetime-picker-del {
  @apply tw-absolute;
  * {
    @apply tw-text-neutral-4;
  }
  top: 9px;
  right: 7px;
  &:hover {
    @apply tw-cursor-pointer;
    * {
      @apply tw-text-primary-6;
    }
  }
}
</style>
