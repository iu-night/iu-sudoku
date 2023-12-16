<script setup>
import {
  calculateCandidates,
  calculateSelectedCandidates,
  convertStringToSudokuBoxes,
  isValidSudokuString,
} from '~/utils/sudoku'

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
const isMark = ref(false)

const inputValue = ref('')

const selectedCell = ref({ block: 0, row: 0, col: 0, boxPosition: 0, isOriginal: true })
const selectedPosition = computed(() => {
  return selectedCell.value
})

onKeyStroke(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'], (e) => {
  modifySudoku(Number(e.key))
})

function onClickBottomNum(num) {
  modifySudoku(num)
}

function onClickBottomCandidateNum(num) {
  modifySudoku(num, true)
}

/**
 * 修改数独数据中的value
 * @param {object} param
 * @param {number} param.blockIndex 宫的序号
 * @param {number} param.cellIndex 宫内的cell的序号
 * @param {number} digit
 */
function modifyCell({ blockIndex, cellIndex }, digit) {
  blockData.value[blockIndex][cellIndex].value = digit
  blockData.value[blockIndex][cellIndex].candidates = []
  highlightDigit.value = digit
}

/**
 * 修改数独数据中的候选数candidates
 */
function modifyCandidates({ blockIndex, cellIndex }, digit) {
  blockData.value[blockIndex][cellIndex].value = 0
  highlightDigit.value = 0
  const arr = blockData.value[blockIndex][cellIndex].candidates
  if (arr.includes(digit)) {
    arr.splice(arr.indexOf(digit), 1)
    blockData.value[blockIndex][cellIndex].candidates = arr
  }
  else {
    blockData.value[blockIndex][cellIndex].candidates.push(digit)
  }
}

/**
 * 判断是否为标记模式，修改数独还是候选数
 */
function modifySudoku(key, clickCanNum = false) {
  if (selectedCell.value.block === 0)
    return
  if (selectedCell.value.isOriginal)
    return
  if (isMark.value || clickCanNum) {
    modifyCandidates({
      blockIndex: selectedCell.value.block - 1,
      cellIndex: selectedCell.value.boxPosition,
    }, key)
  }
  else {
    modifyCell({
      blockIndex: selectedCell.value.block - 1,
      cellIndex: selectedCell.value.boxPosition,
    }, key)
  }
}

function onClickDigit(digit, param) {
  highlightDigit.value = digit

  selectedCell.value = param
}

/**
 * 计算空格子的候选数
 */
function onClickCalulateCandidates() {
  const sudokuHasCandidates = calculateCandidates(blockData.value)
  blockData.value = sudokuHasCandidates
}

/**
 * 计算选中的空格子的候选数
 */
function onClickCalulateSelectedCandidates() {
  if (selectedCell.value.isOriginal)
    return
  const sudokuHasCandidates = calculateSelectedCandidates(blockData.value, selectedCell.value)
  blockData.value = sudokuHasCandidates
}

function onClickNewGame() {
  if (isValidSudokuString(inputValue.value)) {
    blockData.value = convertStringToSudokuBoxes(inputValue.value)
    highlightDigit.value = 0
    isMark.value = false
    inputValue.value = ''
  }
}
</script>

<template>
  <div class="flex flex-col items-center pt-60px">
    <div class="w-96vmin flex flex-col items-center sm:w-70vmin">
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
              :box-position="cellData.boxPosition"
              @select="onClickDigit"
            />
          </div>
        </div>
      </div>
      <div class="flex-center">
        <DarkToggle />
        <input v-model="inputValue" class="b-1 rounded-5px">
        <div
          class="ml-5px inline-flex-center cursor-pointer select-none b-1 rounded-5px px-4px py-3px text-[calc(3vmin)]"
          @click="onClickNewGame"
        >
          new
        </div>
        <div
          class="ml-5px inline-flex-center cursor-pointer select-none b-1 rounded-5px px-4px py-3px text-[calc(3vmin)] transition ease-in-out"
          :class="[isMark ? 'bg-teal-500 c-white' : '']"
          @click="isMark = !isMark"
        >
          mark
        </div>
        <div
          class="ml-5px inline-flex-center cursor-pointer select-none b-1 rounded-5px px-4px py-3px text-[calc(3vmin)]"
          @click="onClickCalulateCandidates"
        >
          auto
        </div>
        <div
          class="ml-5px inline-flex-center cursor-pointer select-none b-1 rounded-5px px-4px py-3px text-[calc(3vmin)]"
          @click="onClickCalulateSelectedCandidates"
        >
          mark selected
        </div>
      </div>
      <div class="mt-10px w-full flex items-center justify-around">
        <button v-for="i in 9" :key="i" class="digit-btn" @click="onClickBottomNum(i)">
          {{ i }}
        </button>
      </div>
      <div class="mt-10px w-full flex items-center justify-around">
        <button
          v-for="i in 9" :key="`can${i}`" class="digit-btn italic"
          :class="[isMark ? 'c-teal-500' : '']"
          @click="onClickBottomCandidateNum(i)"
        >
          {{ i }}
        </button>
      </div>
    </div>
  </div>
</template>

<style>
.sudoku-container {
  --uno: absolute flex flex-wrap items-stretch flex-1 w-full h-full top-0 left-0
    b-1 overflow-hidden bg-gray-100;
}
.digit-btn {
  @apply mx-3px flex-center flex-1 cursor-pointer select-none b-1 rounded-5px py-4px
  text-[calc(3.5vmin)]
  active:bg-teal-500 active:c-white;
}
</style>
