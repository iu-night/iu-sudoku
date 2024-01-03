import { defineStore } from 'pinia'

export const useStore = defineStore({
  id: 'sudokuStore',
  state: () => ({
    theme: 'system',
    showMistake: true,
    showAllMark: true,
    showSelectedMark: true,
    showLockMark: true,
    showMarkKey: true,
    emptyCells: [],
    mistake: [],
    history: [],
    emptyCellsHistory: [],
    mistakeHistory: [],
    sudokuData: [],
  }),
  getters: {
    isFinish: state => state.emptyCells.length === 0 && state.mistake.length === 0,
  },
  actions: {
    resetAllSudokuData() {
      this.sudokuData = []
      this.emptyCells = []
      this.mistake = []
      this.history = []
      this.emptyCellsHistory = []
      this.mistakeHistory = []
    },
    resetHistory() {
      this.history = []
      this.emptyCellsHistory = []
      this.mistakeHistory = []
    },
  },
  persist: {
    storage: persistedState.localStorage,
  },
})
if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useStore, import.meta.hot))
