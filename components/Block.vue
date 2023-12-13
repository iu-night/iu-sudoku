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
})

const emit = defineEmits(['clickDigit'])

function onClick(digit) {
  emit('clickDigit', digit)
}
</script>

<template>
  <div class="_block w-1/3 flex flex-wrap b-1">
    <Cell
      v-for="(cell, cellIndex) in sudokuBlockData"
      :key="cellIndex"
      :digit="cell"
      :highlight-digit="highlightDigit"
      :selected-position="selectedPosition"
      :candidates="candidates"
      :row="cellRow"
      :col="cellCol"
      :box="blockIndex"
      @select="onClick"
    />
  </div>
</template>

<style lang="scss" scoped></style>
