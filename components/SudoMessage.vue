<script lang="ts" setup>
defineOptions({
  name: 'SudoMessage',
})
const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  message: {
    type: String,
  },
  duration: {
    type: Number,
    default: 5000,
  },
})

const emit = defineEmits(['update:show'])

const timer = ref()

function closeMessage() {
  emit('update:show', false)
}

onMounted(() => {
  timer.value = setTimeout(closeMessage, props.duration)
})

onUnmounted(() => {
  if (timer.value)
    clearTimeout(timer.value)
})
</script>

<template>
  <Teleport to="body">
    <Transition name="iu-message">
      <div v-if="show" class="iu-message-container">
        {{ message }}
      </div>
    </Transition>
  </Teleport>
</template>

<style>

</style>
