<script setup>
import { convertStringToSudokuBoxes } from '~/utils/sudoku'

// example data
const sudokuString = '530070000600195000098000060800060003400803001700020006060000280000419005000080079'
const sudokuData = ref([
  [5, 3, 0, 0, 7, 0, 0, 0, 0],
  [6, 0, 0, 1, 9, 5, 0, 0, 0],
  [0, 9, 8, 0, 0, 0, 0, 6, 0],
  [8, 0, 0, 0, 6, 0, 0, 0, 3],
  [4, 0, 0, 8, 0, 3, 0, 0, 1],
  [7, 0, 0, 0, 2, 0, 0, 0, 6],
  [0, 6, 0, 0, 0, 0, 2, 8, 0],
  [0, 0, 0, 4, 1, 9, 0, 0, 5],
  [0, 0, 0, 0, 8, 0, 0, 7, 9],
])

const blockData = ref(convertStringToSudokuBoxes(sudokuString))

const highlightDigit = ref(0)

const selectedCell = ref({ block: 0, row: 0, col: 0 })
const selectedPosition = computed(() => {
  return {
    block: selectedCell.value.block,
    row: selectedCell.value.row,
    col: selectedCell.value.col,
  }
})

function onClickDigit(digit, { block, row, col }) {
  highlightDigit.value = digit

  selectedCell.value = { block, row, col }
}
</script>

<template>
  <div flex flex-col items-center pt-60px>
    <div w-96vmin flex flex-col items-center sm:w-70vmin>
      <div class="relative mb-10px h-0px w-full pt-1/1">
        <div class="sudoku-container dark:bg-gray-500">
          <div
            v-for="(block, blockIndex) in blockData"
            :key="blockIndex"
            class="_block w-1/3 flex flex-wrap b-1"
          >
            <Cell
              v-for="cellData in block"
              :key="cellData.id"
              :digit="cellData.value"
              :highlight-digit="highlightDigit"
              :selected-position="selectedPosition"
              :candidates="cellData.candidates"
              :box="blockIndex + 1"
              :row="cellData.row"
              :col="cellData.col"
              :isOriginal="cellData.isOriginal"
              @select="onClickDigit"
            />
          </div>
        </div>
      </div>
      <DarkToggle />
      <!-- <button @click="useRouter().push({ path: '/sudo' })">sudo</button> -->
    </div>
  </div>
</template>

<style>
.sudoku-container {
  --uno: absolute flex flex-wrap items-stretch flex-1 w-full h-full top-0 left-0
    b-1 overflow-hidden bg-gray-100;
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type='number'] {
  -moz-appearance: textfield;
}
</style>
