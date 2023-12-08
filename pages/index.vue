<template>
  <div flex flex-col items-center pt-60px>
    <div flex flex-col items-center w-70vmin>
      <div class="w-full h-0px relative pt-1/1">
        <div class="sudoku-container">
          <div
            class="_block flex flex-wrap w-1/3 b-1"
            v-for="(blockData, blockIndex) in blockData"
            :key="blockIndex"
          >
            <Cell
              v-for="(cellData, cellIndex) in blockData"
              :key="cellIndex"
              :digit="cellData"
              :highlightDigit="highlightDigit"
              :selectedPosition="selectedPosition"
              :candidates="candidates"
              :box="blockIndex + 1"
              :rowCol="getRowColFromBoxIndex(blockIndex, cellIndex)"
              @select="onClickDigit"
              ></Cell>
          </div>
        </div>
      </div>

      <!-- <button @click="useRouter().push({ path: '/sudo' })">sudo</button> -->
    </div>
  </div>
</template>

<script setup>
// example data
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
]);
const boxData = Array.from({ length: 9 }, () => []);
const candidates = []
const blockData = computed(() => {
  sudokuData.value.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      const boxIndex = getBlockIndex(rowIndex, colIndex);
      if (!boxData[boxIndex]) {
        boxData[boxIndex] = [];
      }
      boxData[boxIndex].push(cell);
    });
  });
  return boxData;
});

const highlightDigit = ref(0);

const selectedCell = ref({ block: 0, row: 0, col: 0 });
const selectedPosition = computed(() => {
  return {
    block: selectedCell.value.block,
    row: selectedCell.value.row,
    col: selectedCell.value.col,
  };
});

const onClickDigit = (digit, { block, row, col }) => {
  highlightDigit.value = digit;

  selectedCell.value = { block, row, col };
};

/**
 * 获取宫的序号
 * @param {number} row
 * @param {number} col
 */
const getBlockIndex = (row, col) => {
  return Math.floor(row / 3) * 3 + Math.floor(col / 3);
};

/**
 * 通过宫和宫中格子的index获取格子的行和列
 * @param {number} boxIndex 
 * @param {number} cellIndex 
 */
const getRowColFromBoxIndex = (boxIndex, cellIndex) => {
  const rowInBox = Math.floor(cellIndex / 3);
  const colInBox = cellIndex % 3;

  const boxRow = Math.floor(boxIndex / 3);
  const boxCol = boxIndex % 3;

  const row = boxRow * 3 + rowInBox + 1;
  const col = boxCol * 3 + colInBox + 1;

  return { row, col };
}
</script>

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

input[type="number"] {
  -moz-appearance: textfield;
}
</style>
