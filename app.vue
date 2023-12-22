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
  transition: all 0.3s;
}

html.dark {
  background: #222;
  color: white;
}
</style>
