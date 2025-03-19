<template>
    <RouterView />
    <NotificationProvider />
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import NotificationProvider from '@/components/common/notificationProvider.vue'
</script>

<style scoped></style>
