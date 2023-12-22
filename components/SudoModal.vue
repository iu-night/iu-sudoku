<script setup>
defineOptions({
  name: 'SudoModal',
})
const props = defineProps({
  to: {
    type: String,
    default: 'body',
  },
  show: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
  },
  maskClose: {
    type: Boolean,
    default: true,
  },
})
const emit = defineEmits(['update:show'])

function maskClose() {
  if (props.maskClose)
    emit('update:show', false)
}

function close() {
  emit('update:show', false)
}
</script>

<template>
  <Teleport to="body">
    <Transition name="iu-modal">
      <div v-if="show" class="iu-modal-mask">
        <div class="iu-modal-wrapper" @click.stop="maskClose">
          <div class="iu-modal-container" @click.stop>
            <div class="iu-modal-close" @click.stop="close">
              <div i-carbon-close />
            </div>
            <div v-if="$slots.header || title" class="iu-modal-header">
              <slot name="header">
                <span class="iu-modal-title">{{ title }}</span>
              </slot>
            </div>
            <div class="iu-modal-body">
              <slot />
            </div>
            <div v-if="$slots.action" class="iu-modal-action">
              <slot name="action" />
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style lang="scss">
.iu-modal-mask {
  @apply fixed flex top-0 left-0 z-9988 w-full h-full transition-opacity-300
    bg-black:40 dark:bg-white:10 backdrop-blur-5px backdrop-saturate-50;
}

.iu-modal-wrapper {
  @apply flex-center w-full h-full;
}

.iu-modal-container {
  @apply flex flex-col relative rounded-4px text-16px text-gray-700
  dark:text-gray-200 bg-white dark:bg-[#222] transition-300 shadow-iu dark:shadow-iud;
}

.iu-modal-close {
  @apply absolute right-0 top-0 mt-20px mr-25px rounded-4px text-20px
    cursor-pointer transition-100;

  &:hover {
    @apply bg-[#000]:20 dark:bg-[#fff]:20;
  }
}

.iu-modal-header {
  @apply flex-1 rounded-4px px-30px py-20px;

  .iu-modal-title {
    @apply text-20px;
  }
}

.iu-modal-body {
  @apply flex-1 rounded-4px px-30px pt-10px pb-20px;
}

.iu-modal-action {
  @apply flex-1 rounded-4px px-30px py-20px bg-[#efefef] dark:bg-[#424242];
}

.iu-modal-enter-from,
.iu-modal-leave-to {
  opacity: 0;
}

.iu-modal-enter-from .iu-modal-container,
.iu-modal-leave-to .iu-modal-container {
  transform: scale(1.1);
}
</style>
