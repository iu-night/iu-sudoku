<script setup>
import sudokuSolver from 'sudoku'
import { useStorage } from '@vueuse/core'
import { Haptics, ImpactStyle } from '@capacitor/haptics'
import {
  calculateCandidates,
  calculateSelectedCandidates,
  convertStringToSudokuBoxes,
  isValidSudokuString,
  removeSelectedDigitInCandidates,
  rowsToBlocks,
  toRowArray,
} from '~/utils/sudoku'

async function hapticsImpactMedium() {
  await Haptics.impact({ style: ImpactStyle.Medium })
}

// example data
const sudokuString = '530070000600195000098000060800060003400803001700020006060000280000419005000080079'
const sudokuArray = ref([
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

const { makepuzzle, ratepuzzle, solvepuzzle } = sudokuSolver

const store = useStore()
const {
  showAllMark,
  showSelectedMark,
  showLockMark,
  showMarkKey,
  history,
  sudokuData,
  emptyCells,
  isFinish,
  emptyCellsHistory,
  mistake,
  mistakeHistory,
} = storeToRefs(store)

const blockData = ref()
const isMark = ref(false)

const selectedIsError = ref(false)

const inputValue = ref('')
const modalShow = ref(false)
const showInput = ref(false)

const finishModalShow = ref(false)

const highlightDigit = ref(0)
const selectedCell = ref({
  block: 0,
  row: 0,
  col: 0,
  digit: 0,
  boxPosition: 0,
  isOriginal: true,
  isError: false,
})
const selectedPosition = computed(() => {
  return selectedCell.value
})

onKeyStroke(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'], (e) => {
  shouldHighlightDigit(e.key)
  modifySudoku(Number(e.key))
})

/**
 * 记录操作步骤
 */
function recordAction(value) {
  const valueCopy = JSON.parse(JSON.stringify(value))
  const emptyCopy = JSON.parse(JSON.stringify(emptyCells.value))
  const mistakeCopy = JSON.parse(JSON.stringify(mistake.value))

  if (history.value.length >= 5) {
    history.value.shift()
    emptyCellsHistory.value.shift()
    mistakeHistory.value.shift()
  }

  history.value.push(valueCopy)
  emptyCellsHistory.value.push(emptyCopy)
  mistakeHistory.value.push(mistakeCopy)
}

/**
 * 撤回操作
 */
function undo() {
  if (history.value.length > 0) {
    hapticsImpactMedium()

    blockData.value = history.value.pop()
    emptyCells.value = emptyCellsHistory.value.pop()
    mistake.value = mistakeHistory.value.pop()
    resetHighlightDigit()
  }
}

function resetHistory() {
  store.resetAllSudokuData()
}

function resetHighlightDigit() {
  highlightDigit.value = 0
  selectedCell.value = {
    block: 0,
    row: 0,
    col: 0,
    digit: 0,
    boxPosition: 0,
    isOriginal: true,
    isError: false,
  }
}

function modifyHighlightDigit(num) {
  highlightDigit.value = num
}

/**
 * 判断当前是否应该高亮数字
 */
function shouldHighlightDigit(num) {
  const { block, row, col } = selectedCell.value
  if (block === 0 || row === 0 || col === 0) {
    if (highlightDigit.value === num) {
      modifyHighlightDigit(0)
      return
    }
    modifyHighlightDigit(num)
  }
}

function onClickBottomNum(num) {
  hapticsImpactMedium()

  shouldHighlightDigit(num)
  modifySudoku(num)
}

function onClickBottomCandidateNum(num) {
  hapticsImpactMedium()

  shouldHighlightDigit(num)
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

  // blockData.value[blockIndex][cellIndex].value = digit

  // if (mistake.value.some(v => v.blockIndex === blockIndex && v.cellIndex === cellIndex)) {
  //   if (!selectedCell.value.isError || digit === 0)
  //     mistake.value = mistake.value.filter(v => !(v.blockIndex === blockIndex && v.cellIndex === cellIndex))
  // }
  // else if (selectedCell.value.isError) {
  //   mistake.value.push({ blockIndex, cellIndex })
  // }

  // if (!selectedCell.value.isError && digit !== 0) {
  //   if (emptyCells.value.some(v => v.blockIndex === blockIndex && v.cellIndex === cellIndex))
  //     emptyCells.value = emptyCells.value.filter(v => !(v.blockIndex === blockIndex && v.cellIndex === cellIndex))
  // }
  // else if (!selectedCell.value.isError && digit === 0) {
  //   if (!emptyCells.value.some(v => v.blockIndex === blockIndex && v.cellIndex === cellIndex))
  //     emptyCells.value.push({ blockIndex, cellIndex })
  // }

  // blockData.value[blockIndex][cellIndex].candidates = []
  const cell = blockData.value[blockIndex][cellIndex]
  cell.value = digit

  const mistakeIndex = mistake.value.findIndex(v => v.blockIndex === blockIndex && v.cellIndex === cellIndex)
  setTimeout(() => {
    const selectedCellError = selectedIsError.value
    if (mistakeIndex !== -1) {
      if (!selectedCellError || digit === 0)
        mistake.value.splice(mistakeIndex, 1)
    }
    else if (selectedCellError) {
      mistake.value.push({ blockIndex, cellIndex })
    }

    const emptyCellsIndex = emptyCells.value.findIndex(v => v.blockIndex === blockIndex && v.cellIndex === cellIndex)
    if (!selectedCellError && digit !== 0) {
      if (emptyCellsIndex !== -1)
        emptyCells.value.splice(emptyCellsIndex, 1)
    }
    else if (!selectedCellError && digit === 0) {
      if (emptyCellsIndex === -1)
        emptyCells.value.push({ blockIndex, cellIndex })
    }
  })

  cell.candidates = []
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
  hapticsImpactMedium()

  highlightDigit.value = digit

  selectedCell.value = param
}

function getIsError(value) {
  selectedIsError.value = value
}

/**
 * 计算空格子的候选数
 */
function onClickCalulateCandidates() {
  hapticsImpactMedium()
  recordAction(blockData.value)

  const sudokuHasCandidates = calculateCandidates(blockData.value)
  blockData.value = sudokuHasCandidates
}

/**
 * 计算选中的空格子的候选数
 */
function onClickCalulateSelectedCandidates() {
  hapticsImpactMedium()

  if (selectedCell.value.isOriginal)
    return
  recordAction(blockData.value)
  const sudokuHasCandidates = calculateSelectedCandidates(blockData.value, selectedCell.value)
  blockData.value = sudokuHasCandidates
}

function onClickNew() {
  hapticsImpactMedium()

  modalShow.value = true
}

function onClickInputConfirm() {
  if (isValidSudokuString(inputValue.value)) {
    hapticsImpactMedium()

    resetHistory()
    const { blocks: tempBlcokData, emptyCellsArray: tempCellsArr } = convertStringToSudokuBoxes(inputValue.value)
    setStoreSudokuData(tempBlcokData)
    blockData.value = tempBlcokData
    emptyCells.value = tempCellsArr
    isMark.value = false
    modalShow.value = false
    showInput.value = false
    inputValue.value = ''
    resetHighlightDigit()
  }
}

function generateSudoku() {
  hapticsImpactMedium()

  resetHistory()
  const puzzle = makepuzzle()
  const puzzleAnswer = solvepuzzle(puzzle)
  const { blocks: tempBlcokData, emptyCellsArray: tempCellsArr } = rowsToBlocks(toRowArray(puzzle), toRowArray(puzzleAnswer))
  setStoreSudokuData(tempBlcokData)
  blockData.value = tempBlcokData
  emptyCells.value = tempCellsArr
  isMark.value = false
  modalShow.value = false
  showInput.value = false
  inputValue.value = ''
  resetHighlightDigit()
}

function setStoreSudokuData(value) {
  sudokuData.value = value
}

onMounted(() => {
  if (!isFinish.value)
    blockData.value = sudokuData.value
  else
    generateSudoku()
})

watch(isFinish, (value) => {
  if (value) {
    finishModalShow.value = true
    resetHighlightDigit()
  }
})
</script>

<template>
  <div class="h-full flex items-center justify-center">
    <div class="w-96vmin flex flex-col items-center sm:w-70vmin">
      <div class="mb-10px w-full flex items-center justify-between">
        <div class="flex-center space-x-8px">
          <Settings />
          <div
            class="icon-btn"
            i-custom:new
            @click="onClickNew"
          />
          <SudoModal v-model:show="modalShow" title="新游戏">
            <div class="w-240px flex items-center justify-around">
              <button
                class="text-[calc(4vmin)] btn sm:text-[calc(2vmin)]"
                @click="generateSudoku"
              >
                生成
              </button>
              <button
                class="text-[calc(4vmin)] btn sm:text-[calc(2vmin)]"
                @click="() => {
                  showInput = !showInput;
                  hapticsImpactMedium()
                }"
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
          <SudoModal v-model:show="finishModalShow" :show-close="false">
            <div class="w-240px flex flex-col items-center space-y-20px">
              <div class="text-[calc(4vmin)] sm:text-[calc(2vmin)]">
                成功🎉
              </div>
              <button
                class="text-[calc(4vmin)] btn sm:text-[calc(2vmin)]"
                @click="() => {
                  generateSudoku()
                  finishModalShow = false
                  hapticsImpactMedium()
                }"
              >
                下一局
              </button>
            </div>
          </SudoModal>
        </div>
        <div class="flex-center space-x-16px">
          <div
            v-if="showLockMark"
            class="icon-btn"
            :class="[isMark ? 'c-teal-500 i-custom:lock' : 'i-custom:lockopen']"
            title="锁定标记模式"
            @click="() => {
              isMark = !isMark;
              hapticsImpactMedium()
            }"
          />
          <div
            v-if="showAllMark"
            class="icon-btn"
            i-carbon:edit
            title="自动计算所有候选数"
            @click="onClickCalulateCandidates"
          />
          <div
            v-if="showSelectedMark"
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
        <div class="sudoku-container group dark:bg-gray-500">
          <!-- <span class="absolute right-0 h-150% w-10% translate-x-12 rotate-12 transform bg-white opacity-20 transition-all-3000 -mt-12 group-hover:-translate-x-400" /> -->
          <div
            v-for="(block, blockIndex) in blockData"
            :key="blockIndex"
            class="_block w-1/3 flex flex-wrap b-1 b-[#000]:20 cafe:b-[#000]:60 dark:b-[#fff]:80"
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
              :answer="cellData.answer"
              @select="onClickDigit"
              @getIsError="getIsError"
            />
          </div>
        </div>
      </div>

      <div class="mt-10px w-full flex items-center justify-around">
        <button v-for="i in 9" :key="i" class="digit-btn" @click="onClickBottomNum(i)">
          {{ i }}
        </button>
      </div>
      <div v-if="showMarkKey" class="mt-10px w-full flex items-center justify-around">
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
  @apply absolute flex flex-wrap items-stretch flex-1 w-full h-full top-0 left-0
  b-1 b-[#000]:20 dark:b-[#fff]:80 cafe:b-[#000]:60 overflow-hidden bg-gray-100 cafe:bg-amber-50;
}
.digit-btn {
  @apply mx-3px flex-center flex-1 cursor-pointer select-none
  b-1 cafe:b-[#433422] cafe:@hover:c-[#158876] cafe:@hover:b-[#158876]
  rounded-5px py-4px
  text-[calc(6vmin)] sm:text-[calc(3.5vmin)]
  active:bg-teal-500 active:c-white;
}
</style>
