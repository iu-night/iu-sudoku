<script setup lang="ts">
const color = useColorMode()

const { theme } = storeToRefs(useStore())

useHead({
  meta: [{
    id: 'theme-color',
    name: 'theme-color',
    content: () => color.value === 'dark' ? '#222222' : color.value === 'light' ? '#ffffff' : '#f1e7d0',
  }],
})

const { state, next } = useCycleList(['dark', 'light', 'cafe', 'system'], { initialValue: theme.value })

function toggleTheme() {
  next()
}

watchEffect(() => {
  color.preference = state.value
  theme.value = state.value
})
</script>

<template>
  <button class="icon-btn" @click="toggleTheme">
    <i v-if="state === 'dark'" i-carbon-moon />
    <i v-if="state === 'light'" i-carbon-sun />
    <i v-if="state === 'cafe'" i-carbon-cafe />
    <i v-if="state === 'system'" i-carbon-laptop />
  </button>
</template>
