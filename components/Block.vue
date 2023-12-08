<template>
  <div class="_block flex flex-wrap w-1/3 b-1">
    <Cell
      v-for="(cell, cellIndex) in sudokuBlockData"
      :key="cellIndex"
      :digit="cell"
      :highlightDigit="highlightDigit"
      :selectedPosition="selectedPosition"
      :candidates="candidates"
      :row="cellRow"
      :col="cellCol"
      :box="blockIndex"
      @select="onClick"
    ></Cell>
  </div>
</template>

<script setup>
defineProps({
  sudokuBlockData: {
    type: Array,
    default: () => [],
  },
  highlightDigit: {
    type: Number,
    default: 0,
  },
  selectedPosition: {
    type: Array,
    default: () => [],
  },
  candidates: {
    type: Array,
    default: () => [],
  },
  cellRow: {
    type: Number,
    default: 0,
  },
  cellCol: {
    type: Number,
    default: 0,
  },
  blockIndex: {
    type: Number,
    default: 0,
  },
});

const emit = defineEmits(["clickDigit"]);

const onClick = (digit) => {
  emit("clickDigit", digit);
};
</script>

<style lang="scss" scoped></style>
