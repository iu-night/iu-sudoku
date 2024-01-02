<script setup lang="ts">
const color = useColorMode()

useHead({
  meta: [{
    id: 'theme-color',
    name: 'theme-color',
    content: () => color.value === 'dark' ? '#222222' : color.value === 'light' ? '#ffffff' : '#f1e7d0',
  }],
})
// TODO 设置中设置，本地存储且读取偏好
const { state, next: toggleTheme } = useCycleList(['dark', 'light', 'cafe', 'system'], { initialValue: 'system' })

watchEffect(() => color.preference = state.value)
</script>

<template>
  <button class="icon-btn" @click="toggleTheme()">
    <i v-if="state === 'dark'" i-carbon-moon />
    <i v-if="state === 'light'" i-carbon-sun />
    <i v-if="state === 'cafe'" i-carbon-cafe />
    <i v-if="state === 'system'" i-carbon-laptop />
  </button>
</template>
