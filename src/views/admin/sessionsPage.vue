<template>
    <div class="page">
        <div class="table">
            <div class="table__row">
                <div class="table__title__row">id</div>
                <div class="table__title__row">Имя</div>
                <div class="table__title__row">Устройство</div>
                <div class="table__title__row">IP-адрес</div>
                <div class="table__title__row">Начало сессии</div>
                <div class="table__title__row">Последняя активность</div>
                <div class="table__title__row">Длительность сессии</div>
                <div class="table__title__row">
                    <img src="/icons/iconClose.webp" alt="finish session" />
                </div>
            </div>
            <div
                class="table__row table__row-bg"
                v-for="(session, idx) in sessionsList?.sessions"
                :key="'user' + idx"
            >
                <div class="table__row__item">{{ session.id }}</div>
                <div class="table__row__item">{{ session.username }}</div>
                <div class="table__row__item">{{ session.device_info }}</div>
                <div class="table__row__item">{{ session.ip_address }}</div>
                <div class="table__row__item">{{ formatData(session.created_at, true) }}</div>
                <div class="table__row__item">{{ formatData(session.last_activity, true) }}</div>
                <div class="table__row__item">{{ session.duration }}</div>
                <div
                    class="table__row__item"
                    @click="(isModalOpen = true), (choosenSessions = session.id)"
                >
                    <img src="/icons/iconClose.webp" alt="finish session" />
                </div>
            </div>
        </div>
        <AppModal v-if="isModalOpen" @close="isModalOpen = false">
            <div class="modal__content--wrp">
                <div class="modal__content__text">Завершить сессию?</div>
                <div class="modal__content__btns-wrp">
                    <div class="btn btn-dark" @click="handleDeleteUser">Да</div>
                    <div class="btn" @click="isModalOpen = false">Нет</div>
                </div>
            </div>
        </AppModal>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAdmin } from '@/services/admin'
import { useStore } from 'vuex'
import { formatData } from '@/mixins/formatData'
import type { SessionsResponse } from '@/interfaces/sessions'
import AppModal from '@/components/common/app-modal.vue'

const { fetchSessions, endSessions } = useAdmin()
const store = useStore()

const isModalOpen = ref(false)
const sessionsList = ref<SessionsResponse>()
const choosenSessions = ref<number>()

const fetchData = async () => {
    const { data } = await fetchSessions()
    sessionsList.value = data
}

fetchData()

const handleDeleteUser = async () => {
    const { status } = await endSessions(choosenSessions.value as number)
    if (status === 200) {
        isModalOpen.value = false
        store.dispatch('notificationModule/addNotification', { text: 'Сессия завершена.' })
        await fetchData()
    }
}
</script>

<style scoped>
.table {
    display: flex;
    flex-direction: column;
    grid-gap: 8px;
}

.table__row {
    display: grid;
    padding: 0 24px;
    align-items: center;
    grid-template-columns: 0.3fr repeat(6, 1fr) 0.1fr;
    grid-gap: 5px;
}

.table__title__row {
    color: #1f2b3e;
    font-family: Ubuntu;
    font-size: 16px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
}

.table__title__row img {
    opacity: 0;
}

.table__row-bg {
    padding: 8px 24px;
    border-radius: 3px;
    background: rgba(208, 222, 234, 0.5);
}

.table__row__item {
    color: #1f2b3e;
    font-family: Ubuntu;
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 400px;
    width: 100%;
    white-space: nowrap;
}

.table__row__item img {
    cursor: pointer;
}

.modal__content--wrp {
    padding: 40px;
    border-radius: 3px;
    background: #d0deea;
    display: flex;
    flex-direction: column;
    grid-gap: 26px;
    height: fit-content;
    margin: auto;
    max-width: 416px;
    width: 100%;
}

.modal__content__text {
    color: #1f2b3e;
    text-align: center;
    font-family: Ubuntu;
    font-size: 24px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
}

.modal__content__btns-wrp {
    display: flex;
    align-items: center;
    grid-gap: 16px;
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
}

.btn-dark {
    color: #fff;
    background: #1f2b3e;
}
</style>
