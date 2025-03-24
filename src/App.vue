<template>
    <RouterView />
    <NotificationProvider />
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import NotificationProvider from '@/components/common/notificationProvider.vue'
import { useAccount } from './services/account'

const { refreshToken } = useAccount()

if (sessionStorage.getItem('accessToken')) {
    refreshToken()
}
</script>

<style scoped></style>
