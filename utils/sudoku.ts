interface Cell {
  id: string
  row: number
  col: number
  value: number
  isOriginal: boolean
  candidates: number[]
  boxPosition: number
}
type sudokuData = Cell[][]

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
        value,
        isOriginal: value !== 0, // 若值不为0，则是原始数据
        candidates: [],
        boxPosition, // 此格在宫内的序号
      })
    }
  }
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
