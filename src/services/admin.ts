export const useAdmin = () => {
    const fetchSessions = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/sessions`, {
                method: 'GET',
                headers: {
                    Authorization: sessionStorage.getItem('accessToken') as string
                }
            })
            const data = await response.json()
            return { data, status: response.status }
        } catch (error: unknown) {
            console.error('Error fetching sessions', error)
            return { data: {}, status: error.status }
        }
    }
    return { fetchSessions }
}
