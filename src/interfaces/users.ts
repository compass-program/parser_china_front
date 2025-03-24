export interface UsersResponse {
    all_users: number
    users: User[]
}

export interface User {
    created_at: string
    id: number
    is_active: boolean
    is_admin: boolean
    username: string
}
