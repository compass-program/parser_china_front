import { useRouter } from 'vue-router'
import httpService from '@/utils/api'
import { ref } from 'vue'

interface User {
    username: string
    id: number
    is_active: boolean
    is_admin: boolean
    created_at: string
}

export const user = ref<User>()
export const isAdmin = ref<boolean>()

export const useAccount = () => {
    const router = useRouter()

    const logIn = async (body: FormData) => {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/token`, {
            method: 'POST',
            body
        })
        if (response.ok) {
            const data = await response.json()
            sessionStorage.setItem('accessToken', `${data.token_type} ${data.access_token}`)

            user.value = await fetchUser()
            isAdmin.value = user.value.is_admin
            sessionStorage.isAdmin = user.value.is_admin

            if (isAdmin.value) {
                sessionStorage.isAdmin = true
                router.push({ name: 'users', query: { page: 1 } })
            } else {
                router.push('/')
            }
        }
    }

    const fetchUser = async () => {
        const { data } = await httpService.get(`${import.meta.env.VITE_API_URL}/auth/me`)

        return data as User
    }

    const logOut = async () => {
        const { status } = await httpService.post(`${import.meta.env.VITE_API_URL}/auth/logout`)
        if (status == 400) {
            sessionStorage.removeItem('accessToken')
            sessionStorage.removeItem('isAdmin')
        }
    }

    return { logIn, logOut, fetchUser }
}
