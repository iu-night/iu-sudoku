<script setup>
import { appName } from '~/constants'

useHead({
  title: appName,
})
</script>

<template>
  <VitePwaManifest />
  <NuxtPage />
</template>

<style>
html,
body,
#__nuxt {
  height: 100%;
  margin: 0;
  padding: 0;
  transition: background-color 0.3s;
  overscroll-behavior: none;
  touch-action: manipulation;
}

html.dark {
  background: #222;
  color: white;
}

html.cafe {
  background: #f1e7d0;
}
</style>
