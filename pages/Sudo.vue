<template>
  <div>
    <table>
      <tr>
        <td v-for="(item, index) in 9" :key="index" class="grid">
          <div v-for="(row, rowIndex) in 9" :key="rowIndex" class="cell">
            <input type="text" v-model="gridData[rowIndex][index]" @change="updateGridData">
            <div class="border">
              <div class="horizontal"></div>
              <div class="vertical"></div>
            </div>
          </div>
        </td>
      </tr>
    </table>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  setup() {
    const gridData = new Array(9).fill(0).map(() => new Array(9).fill(0));

    const updateGridData = () => {
      // 更新数独网格数据的逻辑
    };

    return {
      gridData,
      updateGridData,
    };
  },
});
</script>

<style lang="scss" scoped>
.cell {
  width: 25px;
  height: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #000;
  
  &:not(:first-child) {
    border-left: 1px dashed #000;
  }
  
  &:not(:first-child):not(:last-child) {
    border-right: 1px dashed #000;
  }
}

.row {
  display: flex;
}

.table {
  width: 100%;
  border-collapse: collapse;
}

.border {
  position: relative;
}

.horizontal {
  position: absolute;
  top: 9px;
  left: 11px;
  width: 100%;
  height: 2px;
  background-color: #000;
}

.vertical {
  position: absolute;
  top: 11px;
  left: 9px;
  width: 2px;
  height: 100%;
  background-color: #000;
}
</style>