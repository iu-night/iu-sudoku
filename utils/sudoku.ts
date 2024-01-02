interface Cell {
  id: string
  row: number
  col: number
  block: number
  value: number
  isOriginal: boolean
  candidates: number[]
  boxPosition: number
  answer: number
}
export type sudokuData = Cell[][]

/**
 * 通过行和列获取宫的序号
 * @param {number} row
 * @param {number} col
 */
export function getBlockIndex(row: number, col: number) {
  return Math.floor(row / 3) * 3 + Math.floor(col / 3)
}

/**
 * 通过宫和宫中格子的index获取格子的行和列
 * @param {number} boxIndex
 * @param {number} cellIndex
 */
export function getRowColFromBoxIndex(boxIndex: number, cellIndex: number) {
  const rowInBox = Math.floor(cellIndex / 3)
  const colInBox = cellIndex % 3

  const boxRow = Math.floor(boxIndex / 3)
  const boxCol = boxIndex % 3

  const row = boxRow * 3 + rowInBox + 1
  const col = boxCol * 3 + colInBox + 1

  return { row, col }
}

/**
 * 将字符串转换为数独数据 以宫为单位
 * @param sudokuString 数独字符串
 * @returns {sudokuData} 以宫为单位的数独数据
 */
export function convertStringToSudokuBoxes(sudokuString: string): sudokuData {
  const sudoSize = 9
  const boxSize = 3
  const boxes: sudokuData = Array.from({ length: sudoSize }, () => [])

  // 将字符串转换为一个包含值的数组
  const values = sudokuString.split('').map(num => Number.parseInt(num, 10))

  for (let row = 0; row < sudoSize; row++) {
    for (let col = 0; col < sudoSize; col++) {
      const value = values[row * sudoSize + col]
      const boxIndex = Math.floor(row / boxSize) * boxSize + Math.floor(col / boxSize)

      const boxRow = row % boxSize
      const boxCol = col % boxSize
      const boxPosition = boxRow * boxSize + boxCol

      boxes[boxIndex].push({
        id: `${row + 1}${col + 1}`, // 使用行列生成ID
        row: row + 1,
        col: col + 1,
        block: boxIndex + 1,
        value,
        isOriginal: value !== 0, // 若值不为0，则是原始数据
        candidates: [],
        boxPosition, // 此格在宫内的序号
        answer: 0,
      })
    }
  }
  // console.log('🚀  boxes:', JSON.stringify(boxes))
  return boxes
}

/**
 * 检查字符串是否是有效的数独
 * @param sudokuString 数独字符串
 * @returns {boolean} true or false
 */
export function isValidSudokuString(sudokuString: string): boolean {
  // 长度必须为81
  if (sudokuString.length !== 81)
    return false

  // 只能包含数字0-9
  const validCharacters = /^[0-9]+$/
  if (!validCharacters.test(sudokuString))
    return false

  return true
}

/**
 * 计算空格子的候选数
 */
export function calculateCandidates(sudo: sudokuData) {
  if (!sudo) {
    console.error('sudo is undefined')
    return
  }
  const newSudo = sudo.map((block, blockIdx) => {
    if (!block) {
      console.error(`Block at index ${blockIdx} is undefined`)
      return block
    }

    return block.map((cell) => {
      if (!cell) {
        console.error(`Cell in block ${blockIdx} is undefined`)
        return cell
      }
      if (cell.isOriginal || cell.value !== 0)
        return cell
      const candidates = []
      for (let i = 1; i <= 9; i++) {
        if (!isNumberInBlock(sudo, cell.block - 1, i)) {
          if (!isNumberInRowOrCol(sudo, i, cell.row, true) && !isNumberInRowOrCol(sudo, i, cell.col, false))
            candidates.push(i)
        }
      }
      cell.candidates = candidates
      return cell
    })
  })
  return newSudo
}

/**
 * 计算选中的空格子的候选数
 */
export function calculateSelectedCandidates(
  sudo: sudokuData,
  selectedCell: {
    block: number
    row: number
    col: number
    boxPosition: number
    isOriginal: boolean
  },
) {
  if (!sudo) {
    console.error('sudo is undefined')
    return
  }

  const { block, row, col, boxPosition, isOriginal } = selectedCell
  const cell = sudo[block - 1][boxPosition]
  const candidates = []
  for (let i = 1; i <= 9; i++) {
    if (!isNumberInBlock(sudo, block - 1, i)) {
      if (!isNumberInRowOrCol(sudo, i, row, true) && !isNumberInRowOrCol(sudo, i, col, false))
        candidates.push(i)
    }
  }
  cell.candidates = candidates
  sudo[block - 1][boxPosition] = cell
  return sudo
}

/**
 * 去掉选中的格子所在行、列、宫中的此格子数字的候选数
 */
export function removeSelectedDigitInCandidates(
  sudo: sudokuData,
  digit: number,
  selectedCell: {
    block: number
    row: number
    col: number
    boxPosition: number
    isOriginal: boolean
  },
) {
  if (!sudo) {
    console.error('sudo is undefined')
    return
  }
  const { block, row, col } = selectedCell
  return isCandidateInRowOrCol(
    isCandidateInRowOrCol(
      isCandidateInBlock(sudo, block - 1, digit),
      digit,
      row,
      true,
    ),
    digit,
    col,
    false,
  )
}

/**
 *  检查数字是否在行、列或宫内
 */
function isNumberInRowOrCol(sudo: sudokuData, num: number, rowOrCol: number, isRow: boolean) {
  const { boxes, indices } = getBoxesAndIndices(rowOrCol - 1, isRow)

  return boxes.some(b => indices.some(i => sudo[b][i].value === num))
}

function isNumberInBlock(sudo: sudokuData, blockIndex: number, num: number): boolean {
  return sudo[blockIndex].some(cell => cell.value === num)
}

/**
 *  检查此数字是否在行、列或宫内的格子中的候选数中,如果在则删除此单个候选数
 */
function isCandidateInRowOrCol(sudo: sudokuData, num: number, rowOrCol: number, isRow: boolean) {
  const { boxes, indices } = getBoxesAndIndices(rowOrCol - 1, isRow)

  boxes.forEach(b => indices.forEach((i) => {
    const canArr = sudo[b][i].candidates
    if (canArr.includes(num)) {
      canArr.splice(canArr.indexOf(num), 1)
      sudo[b][i].candidates = canArr
    }
  }))
  return sudo
}

function isCandidateInBlock(sudo: sudokuData, blockIndex: number, num: number) {
  // return sudo[blockIndex].some(cell => cell.candidates.includes(num))
  const cell = sudo[blockIndex]
  cell.forEach((c) => {
    const canArr = c.candidates
    if (canArr.includes(num)) {
      canArr.splice(canArr.indexOf(num), 1)
      c.candidates = canArr
    }
  })
  sudo[blockIndex] = cell
  return sudo
}

/**
 * 通过行或列获取所涉及到的宫和宫内格的索引
 */
function getBoxesAndIndices(rowOrCol: number, isRow: boolean) {
  // 数独宫的大小，3x3
  const boxSize = 3
  // 计算起始宫的索引
  const startBoxIndex = Math.floor(rowOrCol / boxSize)
  // 宫内行或列的索引
  const boxRowOrColIndex = rowOrCol % boxSize
  // 宫的索引、此行或此列的数据在宫中的索引
  const result: {
    boxes: number[]
    indices: number[]
  } = {
    boxes: [],
    indices: [],
  }

  // 计算宫的索引
  if (isRow) {
    for (let i = 0; i < boxSize; i++) {
      const boxIndex = startBoxIndex * boxSize + i
      result.boxes.push(boxIndex)
    }
  }
  else {
    for (let i = 0; i < boxSize; i++) {
      const boxIndex = startBoxIndex + i * boxSize
      result.boxes.push(boxIndex)
    }
  }
  // 此行或此列的数据在宫中的索引（所有宫中的都一样，只需要计算一个）
  for (let j = 0; j < boxSize; j++) {
    // 行
    if (isRow)
      result.indices.push(boxRowOrColIndex * boxSize + j)

    // 列
    else
      result.indices.push(j * boxSize + boxRowOrColIndex)
  }
  // if (!isRow) {
  //   console.log(rowOrCol)
  //   console.log(result.boxes)
  //   console.log(result.indices)
  // }

  return result

  // const boxSize = 3
  // const baseIndex = Math.floor(rowOrCol / boxSize) * boxSize
  // const rowColOffset = rowOrCol % boxSize
  // const boxes = Array.from({ length: boxSize }, (_, i) => baseIndex + i + 1)
  // const indices = Array.from({ length: boxSize }, (_, j) => isRow
  //   ? rowColOffset * boxSize + j
  //   : j * boxSize + rowColOffset)
  // return { boxes, indices }
}

export function toRowArray(arr: number[]) {
  const result = []
  const size = 9 // 子数组的大小

  const modifiedArr = arr.map(item => item === null ? 0 : item + 1)

  for (let i = 0; i < modifiedArr.length; i += size) {
    const subArray = modifiedArr.slice(i, i + size)
    result.push(subArray)
  }

  return result
}

export function rowsToBlocks(rows: number[][], answer?: number[][]) {
  const sudoSize = 9
  const boxSize = 3

  const blocks: sudokuData = Array.from({ length: sudoSize }, () => [])

  for (let row = 0; row < sudoSize; row++) {
    for (let col = 0; col < sudoSize; col++) {
      const value = rows[row][col]
      const boxIndex = Math.floor(row / boxSize) * boxSize + Math.floor(col / boxSize)

      const boxRow = row % boxSize
      const boxCol = col % boxSize
      const boxPosition = boxRow * boxSize + boxCol

      blocks[boxIndex].push({
        id: `${row + 1}${col + 1}`, // 使用行列生成ID
        row: row + 1,
        col: col + 1,
        block: boxIndex + 1,
        value,
        isOriginal: value !== 0, // 若值不为0，则是原始数据
        candidates: [],
        boxPosition, // 此格在宫内的序号
        answer: answer ? answer[row][col] : 0,
      })
    }
  }

  return blocks
}
