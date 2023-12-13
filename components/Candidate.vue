<script setup>
defineOptions({
  name: 'Candidate',
})

const props = defineProps ({
  candidates: {
    type: Array,
    default: () => [2, 3, 4],
  },
  highlightDigit: {
    type: Number,
    default: 0,
  },
})
function isHighlight(candidate) {
  return candidate === props.highlightDigit ? 'candidate-highlight' : ''
}
</script>

<template>
  <div v-if="candidates.length && !candidates.includes(0)" class="relative grid grid-cols-3 grid-rows-3 h-1/1 w-1/1 text-[calc(2vmin)] c-black">
    <div
      v-for="candidate in candidates"
      :key="candidate"
      class="absolute inset-0 flex items-center justify-center rounded-2px"
      :class="[`candidate-${candidate}`, isHighlight(candidate)]"
    >
      {{ candidate }}
    </div>
  </div>
</template>

<style>
.candidate-highlight {
  @apply bg-teal-500 c-white;
}
.candidate-1 {
  grid-area: 1 / 1 / 2 / 2;
}
.candidate-2 {
  grid-area: 1 / 2 / 2 / 3;
}
.candidate-3 {
  grid-area: 1 / 3 / 2 / 4;
}
.candidate-4 {
  grid-area: 2 / 1 / 3 / 2;
}
.candidate-5 {
  grid-area: 2 / 2 / 3 / 3;
}
.candidate-6 {
  grid-area: 2 / 3 / 3 / 4;
}
.candidate-7 {
  grid-area: 3 / 1 / 4 / 2;
}
.candidate-8 {
  grid-area: 3 / 2 / 4 / 3;
}
.candidate-9 {
  grid-area: 3 / 3 / 4 / 4;
}
</style>
