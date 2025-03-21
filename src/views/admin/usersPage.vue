<template>
    <div class="page-cols">
        <div class="page-col page-col--left">
            <CreateUser @update="fetchData" />
        </div>
        <div class="page-col page-col--right">
            <div class="table">
                <div class="table__row">
                    <div class="table__title__row">id</div>
                    <div class="table__title__row">Имя</div>
                    <div class="table__title__row">Дата создания</div>
                    <div class="table__title__row">
                        <img src="/icons/iconTrash.webp" alt="delete user" />
                    </div>
                </div>
                <div
                    class="table__row table__row-bg"
                    v-for="(user, idx) in usersList?.users"
                    :key="'user' + idx"
                >
                    <div class="table__row__item">{{ user.id }}</div>
                    <div class="table__row__item" :class="{ admin: user.is_admin }">
                        {{ user.username }}
                    </div>
                    <div class="table__row__item">{{ formatData(user.created_at) }}</div>
                    <div
                        class="table__row__item"
                        @click="(isModalOpen = true), (deletedUser = user.id)"
                        v-if="!user.is_admin"
                    >
                        <img src="/icons/iconTrash.webp" alt="delete user" />
                    </div>
                </div>
            </div>
            <AppPagination
                v-if="usersList"
                :count-items="usersList?.all_users"
                :limit="10"
                @change-page="fetchData"
            />
        </div>
        <AppModal v-if="isModalOpen" @close="isModalOpen = false">
            <div class="modal__content--wrp">
                <div class="modal__content__text">Удалить пользователя?</div>
                <div class="modal__content__btns-wrp">
                    <div class="btn btn-dark" @click="handleDeleteUser">Да</div>
                    <div class="btn" @click="isModalOpen = false">Нет</div>
                </div>
            </div>
        </AppModal>
    </div>
</template>

<script setup lang="ts">
import AppModal from '@/components/common/app-modal.vue'
import AppPagination from '@/components/common/app-pagination.vue'
import CreateUser from '@/components/users/createUser.vue'
import type { UsersResponse } from '@/interfaces/users'
import { formatData } from '@/mixins/formatData'
import { useAdmin } from '@/services/admin'
import { ref } from 'vue'
import { useStore } from 'vuex'


const isModalOpen = ref(false)
const deletedUser = ref<number>()

const { fetchUsers, deleteUser } = useAdmin()
const store = useStore()

const usersList = ref<UsersResponse>()

const fetchData = async (page: number = 0) => {
    usersList.value = await fetchUsers(page.toString())
}

fetchData()

const handleDeleteUser = async () => {
    const { status } = await deleteUser(deletedUser.value as number)
    if (status === 204) {
        isModalOpen.value = false
        store.dispatch('notificationModule/addNotification', { text: 'Пользователь удален.' })
        await fetchData()
    }
}
</script>

<style scoped>
.page-cols {
    display: flex;
    grid-gap: 24px;
}

.page-col--right {
    width: calc(100% - 480px);
    display: flex;
    flex-direction: column;
    grid-gap: 24px;
}

.table {
    display: flex;
    flex-direction: column;
    grid-gap: 8px;
}

.table__row {
    display: grid;
    padding: 0 24px;
    align-items: center;
    grid-template-columns: 0.5fr 1fr 0.5fr 0.1fr;
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
}

.table__row__item img {
    cursor: pointer;
}

.admin {
    position: relative;
}

.admin::before {
    content: '';
    position: absolute;
    left: -26px;
    top: 50%;
    transform: translateY(-50%);
    width: 24px;
    height: 24px;
    background: url('/icons/iconCrown.webp') no-repeat;
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
