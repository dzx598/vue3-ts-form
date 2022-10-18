<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import HelloWorld from "./components/HelloWorld.vue";
</script>

<template>
  <n-message-provider>
    <router-view  />
  </n-message-provider>

  <HelloWorld msg="Vite + Vue" />
</template>

<style scoped></style>
