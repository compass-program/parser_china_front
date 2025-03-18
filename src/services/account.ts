import { useRouter } from 'vue-router'
import { useAdmin } from './admin'

export const useAccount = () => {
    const { fetchSessions } = useAdmin()
    const router = useRouter()
    
    const logIn = async (body: FormData) => {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/token`, {
            method: 'POST',
            body
        })
        if (response.ok) {
            const data = await response.json()
            sessionStorage.setItem('accessToken', `${data.token_type} ${data.access_token}`)
            const { status } = await fetchSessions()
            if (status == 200) {
                sessionStorage.isAdmin = true
                router.push('/admin')
            }
        }
    }

    const logOut = async () => {
        const response = await fetch(`${import.meta.env.VITE_API}/auth/logout`)
        if (response.ok) {
            sessionStorage.removeItem('accessToken')
        }
    }

    return { logIn, logOut }
}
