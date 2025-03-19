export interface SessionsResponse {
    total_sessions: number
    sessions: Sessions[]
}

export interface Sessions {
    id: number
    device_info: string
    ip_address: '172.19.0.1'
    created_at: string
    last_activity: string
    duration: string
    username: string
}
