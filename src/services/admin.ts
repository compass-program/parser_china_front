import type { SessionsResponse } from '@/interfaces/sessions'
import type { UsersResponse } from '@/interfaces/users'
import httpService from '@/utils/api'
import { useAccount } from './account'

interface NewUser {
    username: string
    password: string
    is_admin: false
}

export const useAdmin = () => {
    const { logOut } = useAccount()
    const fetchSessions = async (offset: string, limit: string = '10') => {
        const { data, status } = await httpService.get<SessionsResponse>(
            `${import.meta.env.VITE_API_URL}/auth/sessions?limit=${limit}&offset=${offset}`
        )
        if (status === 401) {
            await logOut()
        }
        return { data, status }
    }

    const endSessions = async (id: number) => {
        const { status } = await httpService.delete(
            `${import.meta.env.VITE_API_URL}/auth/sessions/${id}`
        )
        if (status === 401) {
            await logOut()
        }
        return { status }
    }

    const fetchUsers = async (offset: string, limit: string = '10') => {
        const { data, status } = await httpService.get(
            `${import.meta.env.VITE_API_URL}/auth/users?limit=${limit}&offset=${offset}`
        )
        if (status === 401) {
            await logOut()
        }
        return data as UsersResponse
    }

    const createUser = async (body: NewUser) => {
        const { data, status } = await httpService.post(
            `${import.meta.env.VITE_API_URL}/auth/register`,
            body
        )
        if (status === 401) {
            await logOut()
        }
        return { data, status }
    }

    const deleteUser = async (id: number) => {
        const { status } = await httpService.delete(
            `${import.meta.env.VITE_API_URL}/auth/users/${id}`
        )
        if (status === 401) {
            await logOut()
        }
        return { status }
    }

    return { fetchSessions, fetchUsers, createUser, deleteUser, endSessions }
}
