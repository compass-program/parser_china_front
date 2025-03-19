import type { SessionsResponse } from '@/interfaces/sessions'
import type { UsersResponse } from '@/interfaces/users'
import httpService from '@/utils/api'
interface NewUser {
    username: string
    password: string
    is_admin: false
}

export const useAdmin = () => {
    const fetchSessions = async () => {
        const { data, status } = await httpService.get<SessionsResponse>(
            `${import.meta.env.VITE_API_URL}/auth/sessions`
        )
        return { data, status }
    }

    const endSessions = async (id: number) => {
        const { status } = await httpService.delete(
            `${import.meta.env.VITE_API_URL}/auth/sessions/${id}`
        )
        return { status }
    }

    const fetchUsers = async () => {
        const { data } = await httpService.get(`${import.meta.env.VITE_API_URL}/auth/users`)
        return data as UsersResponse
    }

    const createUser = async (body: NewUser) => {
        const { data, status } = await httpService.post(
            `${import.meta.env.VITE_API_URL}/auth/register`,
            body
        )
        return { data, status }
    }

    const deleteUser = async (id: number) => {
        const response = await httpService.delete(
            `${import.meta.env.VITE_API_URL}/auth/users/${id}`
        )
        return { status: response.status }
    }

    return { fetchSessions, fetchUsers, createUser, deleteUser, endSessions }
}
