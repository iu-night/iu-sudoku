<script setup>
import {
  calculateCandidates,
  calculateSelectedCandidates,
  convertStringToSudokuBoxes,
  isValidSudokuString,
  removeSelectedDigitInCandidates,
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
const isMark = ref(false)

const inputValue = ref('')
const modalShow = ref(false)
const showInput = ref(false)

const history = ref([])

const highlightDigit = ref(0)
const selectedCell = ref({ block: 0, row: 0, col: 0, boxPosition: 0, isOriginal: true })
const selectedPosition = computed(() => {
  return selectedCell.value
})

onKeyStroke(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'], (e) => {
  modifySudoku(Number(e.key))
})

function recordAction(value) {
  const valueCopy = JSON.parse(JSON.stringify(value))

  if (history.value.length >= 5)
    history.value.shift()

  history.value.push(valueCopy)
}

function undo() {
  if (history.value.length > 0) {
    const last = history.value.pop()
    blockData.value = last
    resetHighlightDigit()
  }
}

function resetHighlightDigit() {
  highlightDigit.value = 0
  selectedCell.value = { block: 0, row: 0, col: 0, boxPosition: 0, isOriginal: true }
}

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
  recordAction(blockData.value)
  blockData.value[blockIndex][cellIndex].value = digit
  blockData.value[blockIndex][cellIndex].candidates = []
  highlightDigit.value = digit
  blockData.value = removeSelectedDigitInCandidates(blockData.value, digit, selectedCell.value)
}

/**
 * 修改数独数据中的候选数candidates
 */
function modifyCandidates({ blockIndex, cellIndex }, digit) {
  recordAction(blockData.value)
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

function onClickNew() {
  modalShow.value = true
}

function onClickInputConfirm() {
  if (isValidSudokuString(inputValue.value)) {
    blockData.value = convertStringToSudokuBoxes(inputValue.value)
    isMark.value = false
    modalShow.value = false
    showInput.value = false
    inputValue.value = ''
    resetHighlightDigit()
  }
}
</script>

<template>
  <div class="flex flex-col items-center pt-30px">
    <div class="w-96vmin flex flex-col items-center sm:w-70vmin">
      <div class="mb-10px w-full flex items-center justify-between">
        <div class="flex-center space-x-8px">
          <DarkToggle />
          <div
            class="icon-btn"
            i-custom:new
            @click="onClickNew"
          />
          <SudoModal v-model:show="modalShow" title="New">
            <div class="w-240px flex items-center justify-around">
              <button
                class="text-[calc(4vmin)] btn sm:text-[calc(2vmin)]"
                disabled
              >
                生成
              </button>
              <button
                class="text-[calc(4vmin)] btn sm:text-[calc(2vmin)]"
                @click="showInput = !showInput"
              >
                自定义
              </button>
            </div>
            <template v-if="showInput" #action>
              <div class="w-240px flex items-center justify-around">
                <input v-model="inputValue" class="w-150px b-1 rounded-5px">
                <div
                  class="i-carbon:checkbox-checked icon-btn"
                  @click="onClickInputConfirm"
                />
              </div>
            </template>
          </SudoModal>
        </div>
        <div class="flex-center space-x-16px">
          <div
            class="icon-btn"
            :class="[isMark ? 'c-teal-500 i-custom:lock' : 'i-custom:lockopen']"
            title="锁定标记模式"
            @click="isMark = !isMark"
          />
          <div
            class="icon-btn"
            i-carbon:edit
            title="自动计算所有候选数"
            @click="onClickCalulateCandidates"
          />
          <div
            class="icon-btn"
            i-carbon:pen
            title="计算选中的候选数"
            @click="onClickCalulateSelectedCandidates"
          />
          <div
            class="icon-btn"
            i-carbon:undo
            title="撤回"
            @click="undo"
          />
        </div>
      </div>
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
  text-[calc(5vmin)] sm:text-[calc(3.5vmin)]
  active:bg-teal-500 active:c-white;
}
</style>
