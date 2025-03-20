import axios from 'axios'

const http = axios.create({
    baseURL: import.meta.env.VITE_API_URL
})

const refreshToken = async () => {
    const old_token = (sessionStorage.getItem('accessToken') as string).replace('bearer ', '')

    const { data, status } = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/token/refresh/`,
        { old_token }
    )

    if (status === 200) {
        const newAccessToken = `${data.token_type} ${data.access_token}`
        sessionStorage.setItem('accessToken', newAccessToken)
        return newAccessToken
    }
}

http.interceptors.request.use(
    async (config) => {
        const token = sessionStorage.getItem('accessToken')

        if (token) {
            const newToken = await refreshToken()
            config.headers['Authorization'] = newToken
        }
        return config
    },
    (error) => Promise.reject(error)
)

const httpService = {
    get: http.get,
    post: http.post,
    put: http.put,
    delete: http.delete,
    patch: http.patch
}

export default httpService
