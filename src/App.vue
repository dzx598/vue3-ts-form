<script setup lang="ts">
import { darkTheme, zhCN, dateZhCN } from "naive-ui";
import { useHomeStore } from "@/store/index";
import { NConfigProvider, GlobalThemeOverrides } from "naive-ui";
const homeStore = useHomeStore();
const themeOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: "#8a2be2",
  },
  Button: {
    textColor: "#8a2be2",
  },
};
</script>

<template>
  <n-config-provider :locale="zhCN" :date-locale="dateZhCN" :theme-overrides="themeOverrides">
    <app-provider>
      <router-view />
    </app-provider>
  </n-config-provider>
</template>

<style scoped></style>
