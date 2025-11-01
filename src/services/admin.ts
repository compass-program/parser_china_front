import type { SessionsResponse } from '@/interfaces/sessions'
import type { UsersResponse } from '@/interfaces/users'
import httpService from '@/utils/api'
import { useAccount } from './account'
import { AxiosError } from 'axios'

interface NewUser {
    username: string
    password: string
    is_admin: false
}

interface Handicap {
    value: number;
}

export const useAdmin = () => {
    const { logOut } = useAccount()
    const fetchSessions = async (offset: string, limit: string = '10') => {
        try {
            const { data, status } = await httpService.get<SessionsResponse>(
                `${import.meta.env.VITE_API_URL}/auth/sessions?limit=${limit}&offset=${offset}`
            )

            return { data, status }
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                if (error.response?.status === 401) {
                    await logOut()
                }
            }
            return {
                data: null,
                status: 500,
                error: 'Unknown error'
            }
        }
    }

    const endSessions = async (id: number) => {
        try {
            const { status } = await httpService.delete(
                `${import.meta.env.VITE_API_URL}/auth/sessions/${id}`
            )
            return { status }
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                if (error.response?.status === 401) {
                    await logOut()
                }
            }
            return {
                data: null,
                status: 500,
                error: 'Unknown error'
            }
        }
    }

    const fetchUsers = async (offset: string, limit: string = '10') => {
        try {
            const { data } = await httpService.get(
                `${import.meta.env.VITE_API_URL}/auth/users?limit=${limit}&offset=${offset}`
            )
            return data as UsersResponse
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                if (error.response?.status === 401) {
                    await logOut()
                }
            }
            return null
        }
    }

    const createUser = async (body: NewUser) => {
        try {
            const { data, status } = await httpService.post(
                `${import.meta.env.VITE_API_URL}/auth/register`,
                body
            )
            if (status === 401) {
                await logOut()
            }
            return { data, status, error: null }
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                return {
                    data: null,
                    status: error?.response?.status,
                    error: error.response?.data.detail
                }
            }
            return { data: null, status: 500, error: 'Server Error' }
        }
    }

    const deleteUser = async (id: number) => {
        try {
            const { status } = await httpService.delete(
                `${import.meta.env.VITE_API_URL}/auth/users/${id}`
            )
            return { status }
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                if (error.response?.status === 401) {
                    await logOut()
                }
            }
            return {
                data: null,
                status: 500,
                error: 'Unknown error'
            }
        }
    }

    const getHandicap = async () => {
        try {
        const { data, status } = await httpService.get<Handicap>(
            `${import.meta.env.VITE_API_URL}/settings/handicap`
        )
        return { data, status, error: null }
        } catch (error: unknown) {
        if (error instanceof AxiosError && error.response?.status === 401) {
            await logOut()
        }
        return { data: null, status: 500, error: 'Unknown error' }
        }
    }

    const setHandicap = async (value: number) => {
        try {
        const { data, status } = await httpService.post<Handicap>(
            `${import.meta.env.VITE_API_URL}/settings/handicap`,
            { value }
        )
        return { data, status, error: null }
        } catch (error: unknown) {
        if (error instanceof AxiosError) {
            if (error.response?.status === 401) {
            await logOut()
            }
            return {
            data: null,
            status: error.response?.status ?? 500,
            error: error.response?.data?.detail ?? 'Unknown error'
            }
        }
        return { data: null, status: 500, error: 'Server Error' }
        }
    }
    
    return { fetchSessions, fetchUsers, createUser, deleteUser, endSessions, getHandicap, setHandicap, }
}
