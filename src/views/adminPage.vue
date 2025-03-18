<template>
    <div class="admin-page">
        <div class="header">
            <ul class="header__menu">
                <li
                    class="header__menu__item"
                    :class="{ active: $route.fullPath === '/admin/users' }"
                >
                    <RouterLink to="/admin/users">Пользователи</RouterLink>
                </li>
                <li
                    class="header__menu__item"
                    :class="{ active: $route.fullPath === '/admin/sessions' }"
                >
                    <RouterLink to="/admin/sessions">Сессии</RouterLink>
                </li>
                <li class="header__menu__item" :class="{ active: $route.fullPath === '/' }">
                    <RouterLink to="/">Матчи</RouterLink>
                </li>
            </ul>
            <div class="header__btn" @click="logOut">
                <img src="/icons/iconExit.webp" alt="exit" />
            </div>
        </div>
        <RouterView />
    </div>
</template>

<script setup lang="ts">
import { useAccount } from '@/services/account'

const { logOut } = useAccount()
</script>

<style scoped>
.admin-page {
    padding: 20px 60px;
    display: flex;
    flex-direction: column;
    grid-gap: 24px;
}

.header {
    width: 100%;
    padding: 12px 24px;
    border-radius: 3px;
    background: #d0deea;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.header__menu {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    align-items: center;
    grid-gap: 8px;
}

.header__menu__item {
    border-radius: 3px;
    background: #fff;
    padding: 8px 28px;
    max-width: 200px;
    width: 100%;
}

.header__menu__item a {
    color: #1f2b3e;
    font-family: Ubuntu;
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
    text-decoration: none;
}

.header__menu__item.active {
    background: #1f2b3e;
}

.header__menu__item.active a {
    color: #fff;
}

.header__btn {
    padding: 8px;
    border-radius: 3px;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    cursor: pointer;
}
</style>
