<script setup lang="ts">
import { useSocket } from '@/services/socketIo'
import appLeague from '@/components/app-league.vue'
import { onUnmounted, ref } from 'vue'
import appPopup from '@/components/common/app-popup.vue'
import { fetchLogsFavorite, checkFavorite, fetchLogsOB, fetchLogsFB } from '@/services/index'
import AppModal from '@/components/common/app-modal.vue'
import { isAdmin } from '@/services/account'
import { useAccount } from '@/services/account'

const { logOut } = useAccount()
const { openSocket, closeSocket } = useSocket(import.meta.env.VITE_API_URL)

const logsContent = ref<string[]>([])
const logsTitle = ref('')

const isModalOpen = ref(false)

const isAdminStorageValue = ref(sessionStorage.getItem('isAdmin'))

onUnmounted(() => {
    closeSocket()
})

openSocket()

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
    <div class="up-panel--wrp">
        <div class="up-panel">
            <p>FB -<span class="blue">Синий</span></p>
            <p>OB - <span class="white">Белый</span></p>
        </div>
        <div class="up-panel__btns-wrp">
            <button class="btn" @click="handleFetchLogs('fb')">Лог FB</button>
            <button class="btn" @click="handleFetchLogs('ob')">Лог OB</button>
            <button class="btn" @click="checkFavorite">Проверить избранное</button>
            <button class="btn" @click="handleFetchLogs('favorite')">Лог избранное</button>
        </div>
        <div class="up-panel__lk-btns--wrp">
            <button
                class="btn btn-dark"
                @click="$router.push({ name: 'users', query: { page: 1 } })"
                v-if="isAdmin || isAdminStorageValue === 'true'"
            >
                В лк
            </button>
            <div class="up-panel__logout">
                <img src="/icons/iconExit.webp" alt="logout" @click="logOut()" />
            </div>
        </div>
    </div>
    <div class="app-wrp">
        <app-league class="league" :name="'IPBL Pro Division'" :color-title="'#0094FF'" />
        <app-league class="league" :name="'Rocket Basketball League'" :color-title="'#FF5C00'" />
        <app-league class="league" :name="'IPBL Pro Division Women'" :color-title="'#FF3D3D'" />
        <app-league
            class="league"
            :name="'Rocket Basketball League Women'"
            :color-title="'#FF00C7'"
        />
        <appPopup ref="popup"></appPopup>
    </div>
    <AppModal
        :content="logsContent"
        :title="logsTitle"
        v-if="isModalOpen"
        @close="isModalOpen = false"
    />
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
    background: linear-gradient(90deg, #d0deea 0%, #1f2b3e 40%, #1f2b3e 60%, #d0deea 100%);
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
    color: #d0deea;
    font-family: Ubuntu;
    font-size: 16px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
}

.up-panel p .blue {
    color: #0094ff;
    font-family: Ubuntu;
    font-size: 16px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
}

.up-panel p .white {
    color: #fff;
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
}

.up-panel__btns-wrp .btn,
.up-panel__lk-btns--wrp .btn {
    font-size: 14px;
    padding: 3px 10px;
    width: fit-content;
}

.up-panel__lk-btns--wrp {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    grid-gap: 10px;
}

.up-panel__logout {
    background: #fff;
    display: flex;
    align-items: center;
    border-radius: 3px;
    cursor: pointer;
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

.btn {
    border-radius: 3px;
    background: #fff;
    width: 100%;
    color: #1f2b3e;
    font-family: Ubuntu;
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
    text-align: center;
    padding: 11px 28px;
    cursor: pointer;
    border: none;
}

.btn-dark {
    color: #fff;
    background: #1f2b3e;
}
</style>
