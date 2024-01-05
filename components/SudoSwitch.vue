<script setup lang="ts">
defineOptions({
  name: 'IuSwitch',
})
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  color: {
    type: String,
    default: 'rgba(42, 148, 125, 1)',
  },
  round: {
    type: Boolean,
    default: true,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})
const emit = defineEmits(['update:modelValue'])

const value = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  },
})

const left = computed(() => value.value ? '20px' : '2px')

const className = computed(() => {
  return {
    'iu-switch-active': value.value,
    'iu-switch-square': !props.round,
    'iu-switch-disabled': props.disabled,
  }
})

function handleClick() {
  hapticsImpactMedium()
  if (props.disabled)
    return
  if (value.value)
    value.value = false
  else
    value.value = true
}
</script>

<template>
  <div class="iu-switch" @click="handleClick">
    <div
      class="iu-switch-rail"
      :class="className"
    >
      <div class="iu-switch-btn">
        <div v-if="$slots.icon">
          <slot name="icon" />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.iu-switch {
  @apply inline-flex-center align-middle
    leading-normal
    select-none
    h-22px min-w-40px outline-unset;
}

.iu-switch-rail {
  @apply overflow-hidden relative
    bg-black:20
    dark:bg-white:20
    rounded-11px
    h-22px min-w-40px
    cursor-pointer
    transition-all-300;

  &.iu-switch-square {
    @apply rounded-4px;
  }

  &.iu-switch-disabled {
    @apply cursor-not-allowed opacity-50;
  }
}

.iu-switch-active {
  background-color: v-bind(color);

  .dark & {
    background-color: v-bind(color);
  }
}

.iu-switch-btn {
  @apply absolute
    bg-white
    rounded-1/2 box-border
    shadow-switch
    cursor-inherit
    top-2px
    h-18px w-18px
    transition-all-300;

  left: v-bind(left);

  .iu-switch-square & {
    @apply rounded-4px;
  }
}
</style>
