<template>
    <div class="authorization-wrp">
        <form name="authForm" class="authorization-form" @submit.prevent="handleLogIn">
            <div class="authorization-form__title">Вход</div>
            <input
                class="custom-input"
                type="text"
                name="username"
                placeholder="Логин"
                v-model="login"
                :class="{ error: errorAuth }"
            />
            <input
                class="custom-input"
                type="password"
                name="password"
                placeholder="Пароль"
                v-model="password"
                :class="{ error: errorAuth }"
            />
            <span v-if="errorAuth" class="authorization-form__error-msg">{{ errorAuth }}</span>
            <button class="btn btn-form" type="submit">Войти</button>
        </form>
    </div>
</template>

<script setup lang="ts">
import { useAccount } from '@/services/account'
import { ref } from 'vue'

const login = ref('')
const password = ref('')

const errorAuth = ref('')

const { logIn } = useAccount()

const handleLogIn = async () => {
    const form = document.forms.namedItem('authForm') as HTMLFormElement
    const formdata = new FormData(form)
    const { error } = await logIn(formdata)
    if (error) {
        errorAuth.value = error.detail as string
    }
}
</script>

<style scoped>
.authorization-wrp {
    height: 100vh;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.authorization-form {
    border-radius: 3px;
    background: #d0deea;
    display: flex;
    flex-direction: column;
    grid-gap: 16px;
    padding: 40px;
    max-width: 480px;
    width: 100%;
}

.authorization-form__title {
    color: #1f2b3e;
    text-align: center;
    font-family: Ubuntu;
    font-size: 40px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
    margin-bottom: 24px;
}

.authorization-form__error-msg {
    color: #f00;
    font-family: Ubuntu;
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
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
    transition: box-shadow 0.3s;
    border-radius: 3px;
    background: #fff;
    transition: 0.3s;
}

.custom-input.error {
    background-color: #ff9a9a !important;
}

.custom-input:placeholder {
    color: #b0bec5;
}

.custom-input:focus {
    outline: none;
    box-shadow: 4px 8px 6px 0px rgba(34, 60, 80, 0.14);
}

.btn {
    border-radius: 3px;
    font-size: 20px;
    background: var(--LightBlue, #d0deea);
    width: 100%;
    padding: 10px;
    cursor: pointer;
    text-align: center;
    border: none;
}

.btn-form {
    border-radius: 3px;
    background: #1f2b3e;
    color: #fff;
    font-family: Ubuntu;
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
    width: fit-content;
    padding: 11px 28px;
    margin: 0 auto;
    margin-top: 16px;
}
</style>
