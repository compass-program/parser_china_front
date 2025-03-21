import { useRouter } from 'vue-router'
import httpService from '@/utils/api'
import { ref } from 'vue'
import axios from 'axios'

interface User {
    username: string
    id: number
    is_active: boolean
    is_admin: boolean
    created_at: string
}

export const user = ref<User>()
export const isAdmin = ref<boolean>()
const interval = ref()

export const useAccount = () => {
    const router = useRouter()

    const logIn = async (body: FormData) => {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/token`, {
            method: 'POST',
            body
        })
        if (response.ok) {
            const data = await response.json()
            sessionStorage.setItem('accessToken', data.access_token)

            user.value = await fetchUser()
            isAdmin.value = user.value.is_admin
            sessionStorage.isAdmin = user.value.is_admin

            interval.value = setInterval(async () => await refreshToken(), 180000)

            if (isAdmin.value) {
                sessionStorage.isAdmin = true
                router.push({ name: 'users', query: { page: 1 } })
            } else {
                router.push('/')
            }
            return { error: null }
        } else {
            return { error: await response.json() }
        }
    }

    const fetchUser = async () => {
        const { data } = await httpService.get(`${import.meta.env.VITE_API_URL}/auth/me`)
        return data as User
    }

    const refreshToken = async () => {
        try {
            const old_token = sessionStorage.getItem('accessToken')

            const { data } = await axios.post(
                `${import.meta.env.VITE_API_URL}/auth/token/refresh/`,
                { old_token }
            )
            sessionStorage.setItem('accessToken', data.access_token)
            return data.access_token
        } catch (error: unknown) {
            await logOut()
        }
    }

    const logOut = async () => {
        try {
            await httpService.post(`${import.meta.env.VITE_API_URL}/auth/logout`)
            sessionStorage.removeItem('accessToken')
            sessionStorage.removeItem('isAdmin')

            router.push('/auth')

            clearInterval(interval.value)
        } catch (error) {
            sessionStorage.removeItem('accessToken')
            sessionStorage.removeItem('isAdmin')

            clearInterval(interval.value)
            router.push('/auth')
        }
    }

    return { logIn, logOut, fetchUser, refreshToken }
}
