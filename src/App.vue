<script setup lang="ts">
import { useSocket } from '@/services/socketIo'
import appLeague from './components/app-league.vue'
import { onUnmounted, ref } from 'vue'
import appPopup from '@/components/common/app-popup.vue';
import NotificationProvider from './components/common/notificationProvider.vue';
import { fetchLogsFavorite, checkFavorite, fetchLogsOB, fetchLogsFB } from '@/services/index'
import AppModal from './components/common/app-modal.vue';
const { openSocket, closeSocket } = useSocket(import.meta.env.VITE_API_URL)

const isAuth = ref(sessionStorage?.getItem('isAuth') === 'true' ? true : false)
const login = ref('')
const password = ref('')
const envAuth = import.meta.env.VITE_AUTH === 'true'
const logsContent = ref<string[]>([])
const logsTitle = ref('')

const isModalOpen = ref(false)

onUnmounted(() => {
    closeSocket();
});

openSocket()

const logIn = () => {
    if (login.value === import.meta.env.VITE_APP_LOGIN && password.value === import.meta.env.VITE_APP_PASSWORD) {
        sessionStorage.setItem('isAuth', 'true')
        isAuth.value = true
        openSocket()
    }
}

const handleFetchLogs = async (type: string) => {
    switch (type) {
        case 'favorite':
            logsContent.value = await fetchLogsFavorite()
            logsTitle.value = 'Логи по ИЗБРАННОЕ'
            isModalOpen.value = true
            break
        case 'ob':
            logsContent.value = await fetchLogsOB()
            logsTitle.value = 'Логи по OB'
            isModalOpen.value = true
            break
        case 'fb':
            logsContent.value = await fetchLogsFB()
            logsTitle.value = 'Логи по FB'
            isModalOpen.value = true
            break
        default:
            break
    }
}
</script>

<template>
    <template v-if="!isAuth && envAuth">
        <div class="authorization-wrp">
            <form
                class="authorization-form"
                @submit.prevent="logIn"
            >
                <input
                    class="custom-input"
                    type="text"
                    placeholder="Логин"
                    v-model="login"
                >
                <input
                    class="custom-input"
                    type="password"
                    placeholder="Пароль"
                    v-model="password"
                >
                <button
                    class="btn"
                    type="submit"
                >Войти</button>
            </form>
        </div>
    </template>
    <template v-else>
        <div class="up-panel--wrp">

            <div class="up-panel">
                <p>FB -<span class="blue">Синий</span> </p>
                <p>OB - <span class="white">Белый</span> </p>
            </div>
            <div class="up-panel__btns-wrp">
                <button
                    class="btn"
                    @click="handleFetchLogs('fb')"
                >Лог FB</button>
                <button
                    class="btn"
                    @click="handleFetchLogs('ob')"
                >Лог OB</button>
                <button
                    class="btn"
                    @click="checkFavorite"
                >Проверить избранное</button>
                <button
                    class="btn"
                    @click="handleFetchLogs('favorite')"
                >Лог избранное</button>
            </div>
        </div>
        <div class="app-wrp">
            <app-league
                class="league"
                :name="'IPBL Pro Division'"
                :color-title="'#0094FF'"
            />
            <app-league
                class="league"
                :name="'Rocket Basketball League'"
                :color-title="'#FF5C00'"
            />
            <app-league
                class="league"
                :name="'IPBL Pro Division Women'"
                :color-title="'#FF3D3D'"
            />
            <app-league
                class="league"
                :name="'Rocket Basketball League Women'"
                :color-title="'#FF00C7'"
            />
            <appPopup ref="popup"></appPopup>
            <NotificationProvider />
        </div>
        <AppModal
            :content="logsContent"
            :title="logsTitle"
            v-if="isModalOpen"
            @close="isModalOpen = false"
        />
    </template>
</template>

<style scoped>
.app-wrp {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    width: 100%;
    height: 100%;
}

.up-panel--wrp {
    width: calc(100vw - 36px);
    padding: 5px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-radius: 3px;
    margin: 0 auto;
    background: linear-gradient(90deg, #D0DEEA 0%, #1F2B3E 40%, #1F2B3E 60%, #D0DEEA 100%);
    margin-top: 20px;
}

.up-panel {
    display: flex;
    align-items: center;
    justify-content: space-between;
    grid-gap: 24px;
    margin-left: calc(50% - 92px);
}

.up-panel p {
    color: #D0DEEA;
    font-family: Ubuntu;
    font-size: 16px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
}

.up-panel p .blue {
    color: #0094FF;
    font-family: Ubuntu;
    font-size: 16px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
}

.up-panel p .white {
    color: #FFF;
    font-family: Ubuntu;
    font-size: 16px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
}

.up-panel__btns-wrp {
    display: flex;
    align-items: center;
    grid-gap: 8px;
    margin-right: 15%;
}

.up-panel__btns-wrp .btn {
    font-size: 14px;
    padding: 3px 10px;
    width: fit-content;
}

.league {
    width: 100%;
    display: flex;
    flex-direction: column;
    grid-gap: 14px;
    height: calc(50vh - 29px);
    justify-self: center;
    padding: 20px 14px;
}

.league:first-of-type {
    border-bottom: 1px solid #d0deea;
    border-right: 1px solid #d0deea;
}

.league:last-of-type {
    border-top: 1px solid #d0deea;
    border-left: 1px solid #d0deea;
}

.league:nth-child(2) {
    border-left: 1px solid #d0deea;
    border-bottom: 1px solid #d0deea;
}

.league:nth-child(3) {
    border-top: 1px solid #d0deea;
    border-right: 1px solid #d0deea;
}

.league-title {
    border-radius: 3px;
    background: var(--LightBlue, #d0deea);
    color: #0094ff;
    text-align: center;
    font-family: Ubuntu;
    font-size: 26px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
    padding: 7px;
    position: relative;
}

.arrow {
    position: absolute;
    padding: 6px 4px;
    top: 50%;
    right: 10px;
    border-radius: 3px;
    background: #f9f9f9;
    display: flex;
    transform: translateY(-50%);
    cursor: pointer;
}

.authorization-wrp {
    height: 100vh;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.authorization-form {
    max-height: 300px;
    border-radius: 3px;
    border: 2px solid var(--LightBlack, #1F2B3E);
    background: #F9F9F9;
    display: flex;
    flex-direction: column;
    grid-gap: 16px;
    padding: 20px;
}

.custom-input {
    display: block;
    margin: 0;
    padding: 10px 15px;
    color: inherit;
    width: 100%;
    font-family: inherit;
    font-size: 20px;
    font-weight: inherit;
    line-height: 100%;
    border: none;
    border-radius: 0.4rem;
    transition: box-shadow .3s;
}

.custom-input:placeholder {
    color: #B0BEC5;
}

.custom-input:focus {
    outline: none;
    box-shadow: 4px 8px 6px 0px rgba(34, 60, 80, 0.14);
}

.btn {
    border-radius: 3px;
    font-size: 20px;
    background: var(--LightBlue, #D0DEEA);
    width: 100%;
    padding: 10px;
    cursor: pointer;
    text-align: center;
    border: none;
}
</style>
