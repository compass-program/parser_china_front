<template>
    <form class="form" name="createUser " @submit.prevent="handleCreateUser">
        <div class="form__title-wrp">
            <div class="form__title">Добавить пользователя</div>
            <img src="/icons/iconAddUser.webp" alt="add user" />
        </div>
        <input type="text" placeholder="Логин" name="username" v-model="user.username" />
        <input type="text" placeholder="Пароль" name="password" v-model="user.password" />
        <div class="form__checkbox">
            <input type="checkbox" id="checkbox" name="is_admin" v-model="user.is_admin" />
            <label for="checkbox"> Сделать администратором </label>
        </div>
        <span v-if="errorCreate" class="form__error-msg">{{ errorCreate }}</span>
        <button class="form__btn" type="submit">Добавить</button>
    </form>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useAdmin } from '@/services/admin'
import { useStore } from 'vuex'
import { ref } from 'vue'

const store = useStore()
const { createUser } = useAdmin()

interface NewUser {
    username: string
    password: string
    is_admin: false
}

const emit = defineEmits<{
    (event: 'update'): void
}>()

const user = reactive<NewUser>({
    username: '',
    password: '',
    is_admin: false
})

const errorCreate = ref('')

const handleCreateUser = async () => {
    if (!user.username && !user.password) return
    const { status, error } = await createUser(user)
    if (status === 200) {
        store.dispatch('notificationModule/addNotification', { text: 'Пользователь создан.' })
        emit('update')
        user.username = ''
        user.password = ''
        user.is_admin = false
        errorCreate.value = ''
    }
    if (error && Object.keys(error).length) {
        errorCreate.value = error
    }
}
</script>

<style scoped>
.form {
    clip-path: polygon(49% 0, 100% 0, 100% 74%, 50% 74%, 50% 100%, 25% 100%, 0 100%, 0% 43%, 0 0);
    background: var(--LightBlue, #d0deea);
    padding: 40px;
    display: flex;
    flex-direction: column;
    grid-gap: 16px;
    min-width: 480px;
}

.form__title-wrp {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
}

.form__title {
    color: #1f2b3e;
    text-align: center;
    font-family: Ubuntu;
    font-size: 24px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
}

.form__error-msg {
    color: #f53636;
    font-family: Ubuntu;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    margin-top: 8px;
}

.form__btn {
    padding: 11px 28px;
    border-radius: 3px;
    color: #fff;
    font-family: Ubuntu;
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
    max-width: 40%;
    margin-top: 16px;
    cursor: pointer;
    background: #1f2b3e;
    transition: 0.3s;
}

.form__btn:hover {
    background: #3e4e69;
}

.form__checkbox input {
    border-radius: 3px;
    background: #fff;
    border: none;
    width: 25px;
    height: 25px;
}

input[type='checkbox'] {
    display: none;
}

.form__checkbox label {
    display: flex;
    align-items: center;
    grid-gap: 10px;
    cursor: pointer;
    color: rgba(0, 0, 0, 0.6);
    font-family: Ubuntu;
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
}

.form__checkbox label:before {
    border-radius: 3px;
    width: 25px;
    height: 25px;
    border-radius: 3px;
    background: #fff;
    content: '';
}

input[type='checkbox']:checked + label:before {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 25px;
    height: 25px;
    border-radius: 3px;
    background: #fff;
    content: '\2713';
    text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.2);
    font-size: 20px;
    color: #1f2b3e;
    text-align: center;
    line-height: 15px;
}

input[type='text'] {
    padding: 14px 24px;
    border-radius: 3px;
    background: #fff;
    color: #000;
    font-family: Ubuntu;
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
    border: none;
    outline: none;
}
</style>
