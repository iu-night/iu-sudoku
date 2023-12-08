<template>
  <div class="flex items-center justify-center rounded-5px p-1% w-1/3 h-1/3">
    <div
      class="cell"
      :class="[
        isSelected ? 'c-[#fff] bg-teal-500' : '',
        isSameGroup ? 'bg-[#eee]' : ' bg-[#fff]',
        isHighlightDigit ? 'c-[#fff] bg-teal-500' : '',
        isError ? 'c-red-700' : '',
      ]"
      @click="select"
    >
      {{ digit === 0 ? "" : digit }}
    </div>
  </div>
</template>

<script setup>
defineOptions({
  name: "Cell",
});
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
  // row: {
  //   type: Number,
  //   default: 0,
  // },
  // 所在列
  // col: {
  //   type: Number,
  //   default: 0,
  // },
  // 所在宫
  box: {
    type: Number,
    default: 0,
  },
  // 所在行和列
  rowCol: {
    type: Object,
    default: () => {
      return {
        row: 0,
        col: 0,
      };
    },
  },
});
const emit = defineEmits(["select"]);

const isSelected = computed(() => {
  return (
    props.rowCol.row === props.selectedPosition.row &&
    props.rowCol.col === props.selectedPosition.col &&
    props.box === props.selectedPosition.block
  );
});

const isEmpty = computed(() => {
  return props.digit === 0;
});

/**
 * 如果同行或同列或同宫中有同样的数字，则出错，样式标红
 */
const isError = computed(() => {
  if (isSelected.value) {
    return false;
  }
  if (props.digit === props.highlightDigit && isSameGroup.value) {
    return true;
  } else {
    return false;
  }
});

const isHighlightDigit = computed(() => {
  if (props.highlightDigit === 0) return false;
  return props.highlightDigit === props.digit;
});

/**
 * 是否和选中的数字在同一行或者同一列或者同一宫
 */
const isSameGroup = computed(() => {
  return (
    props.rowCol.row === props.selectedPosition.row ||
    props.rowCol.col === props.selectedPosition.col ||
    props.box === props.selectedPosition.block
  );
});
const select = () => {
  if (isSelected.value) {
    emit("select", 0, {
      block: 0,
      row: 0,
      col: 0,
    });
  } else {
    emit("select", props.digit, {
      block: props.box,
      row: props.rowCol.row,
      col: props.rowCol.col,
    });
  }
};
</script>

<style>
.cell {
  --uno: flex items-center justify-center rounded-5px
  w-full h-full
  select-none cursor-pointer
   hover:bg-teal-500 hover:c-white;
}
</style>
