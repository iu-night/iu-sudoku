<script setup>
defineOptions({
  name: 'Cell',
})
const props = defineProps({
  digit: {
    type: Number,
    default: 0,
  },
  // 当前高亮数字 （选中的数字）
  highlightDigit: {
    type: Number,
    default: 0,
  },
  // 选中的数字
  selectedDigit: {
    type: Number,
    default: 0,
  },
  // 选中的数字在数独中的位置
  selectedPosition: {
    type: Object,
    default: () => {},
  },
  // 候选数字
  candidates: {
    type: Array,
    default: () => [],
  },
  // 所在行
  row: {
    type: Number,
    default: 0,
  },
  // 所在列
  col: {
    type: Number,
    default: 0,
  },
  // 所在宫
  box: {
    type: Number,
    default: 0,
  },
  // 宫内序号
  boxPosition: {
    type: Number,
    default: 0,
  },
  isOriginal: {
    type: Boolean,
    default: false,
  },
  answer: {
    type: Number,
    default: 0,
  },
})
const emit = defineEmits(['select', 'getIsError'])

const { showMistake } = storeToRefs(useStore())

const isSelected = computed(() => {
  return (
    props.row === props.selectedPosition.row
    && props.col === props.selectedPosition.col
    && props.box === props.selectedPosition.block
  )
})

const isEmpty = computed(() => {
  return props.digit === 0
})

/**
 * 是否和选中的数字在同一行或者同一列或者同一宫
 */
const isSameGroup = computed(() => {
  return (
    props.row === props.selectedPosition.row
    || props.col === props.selectedPosition.col
    || props.box === props.selectedPosition.block
  )
})

/**
 * 如果同行或同列或同宫中有同样的数字，则出错，样式标红
 * 和答案不同时出错(需判断设置中是否开启显示错误)
 * 源数据时不出错
 */
const isError = computed(() => {
  if (props.isOriginal)
    return false

  if (props.digit === 0)
    return false

  if (showMistake.value && props.digit !== props.answer)
    return true

  if (isSelected.value)
    return false

  if (props.digit === props.selectedDigit && isSameGroup.value)
    return true

  return false
})

const isHighlightDigit = computed(() => {
  if (props.highlightDigit === 0)
    return false
  return props.highlightDigit === props.digit
})

const digitColor = computed(() => {
  if (isError.value)
    return 'c-red-700'

  if (isSelected.value)
    return 'c-[#fff]'

  if (isHighlightDigit.value)
    return 'c-[#fff]'

  if (!props.isOriginal && props.digit !== 0)
    return 'c-blue-600 dark:c-sky-400'

  return ''
})

const digitBgcolor = computed(() => {
  if (isSelected.value || isHighlightDigit.value)
    return 'bg-teal-500 dark:bg-teal-600'
  if (isSameGroup.value)
    return 'bg-[#eee] dark:bg-[#000] cafe:bg-[#e6d3a8]'
  else
    return 'bg-[#fff] dark:bg-[#222] cafe:bg-[#f1e7d0]'
})

function select() {
  if (isSelected.value) {
    emit('select', 0, {
      block: 0,
      row: 0,
      col: 0,
      digit: 0,
      boxPosition: 0,
      isOriginal: true,
    })
  }
  else {
    emit('select', props.digit, {
      block: props.box,
      row: props.row,
      col: props.col,
      digit: props.digit,
      boxPosition: props.boxPosition,
      isOriginal: props.isOriginal,
    })
  }
}

watch(() => props.digit, () => {
  emit('getIsError', isError.value)
})
</script>

<template>
  <div class="relative h-1/3 w-1/3 flex items-center justify-center rounded-5px p-1%">
    <div
      class="cell"
      :class="[
        digitBgcolor,
        digitColor,
      ]"
      @click="select"
    >
      <template v-if="digit === 0">
        <Candidate
          v-if="candidates.length > 0"
          :candidates="candidates"
          :highlightDigit="highlightDigit"
        />
      </template>
      <template v-else>
        {{ digit }}
      </template>
    </div>
  </div>
</template>

<style>
.cell {
  @apply flex items-center justify-center rounded-2px
  w-full h-full aspect-square text-[calc(6vmin)] sm:text-[calc(4vmin)]
  select-none cursor-pointer
  @hover:bg-teal-500 dark:@hover:bg-teal-600 @hover:c-white;
}
</style>
