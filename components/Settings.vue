<script setup>
const { showAllMark, showSelectedMark, showLockMark, showMarkKey, showMistake } = storeToRefs(useStore())

const showSetting = ref(false)
function openSettings() {
  hapticsImpactMedium()
  showSetting.value = true
}
</script>

<template>
  <button class="icon-btn @hover:rotate-180" @click="openSettings">
    <i i-carbon-settings />
    <SudoModal v-model:show="showSetting" title="设置">
      <div class="w-60vmin flex-col items-center sm:w-40vmin space-y-2">
        <div class="flex items-center justify-between">
          <span class="text-[calc(4vmin)] sm:text-[calc(2vmin)]">主题</span>
          <DarkToggle />
        </div>

        <div class="flex items-center justify-between">
          <span class="text-[calc(4vmin)] sm:text-[calc(2vmin)]">显示错误</span>
          <SudoSwitch v-model="showMistake" />
        </div>
        <div class="flex items-center justify-between">
          <span class="text-[calc(4vmin)] sm:text-[calc(2vmin)]">快速标记</span>
          <SudoSwitch v-model="showAllMark" />
        </div>
        <div class="flex items-center justify-between">
          <span class="text-[calc(4vmin)] sm:text-[calc(2vmin)]">选中标记</span>
          <SudoSwitch v-model="showSelectedMark" />
        </div>
        <div class="flex items-center justify-between">
          <span class="text-[calc(4vmin)] sm:text-[calc(2vmin)]">显示锁定标记</span>
          <SudoSwitch v-model="showLockMark" />
        </div>
        <div class="flex items-center justify-between">
          <span class="text-[calc(4vmin)] sm:text-[calc(2vmin)]">显示标记数字按键</span>
          <SudoSwitch v-model="showMarkKey" />
        </div>
      </div>
      <!-- <template #action>
        <div>action</div>
      </template> -->
    </SudoModal>
  </button>
</template>
