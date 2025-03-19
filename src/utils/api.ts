import axios from 'axios'

const http = axios.create({
    baseURL: import.meta.env.VITE_API_URL
})

const refreshToken = async () => {
    const old_token = sessionStorage.getItem('access_token')

    const { data, status } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/token/refresh/`,
        { old_token }
    )
    if (status === 200) {
        sessionStorage.setItem('accessToken', `${data.token_type} ${data.access_token}`)
    }
}

http.interceptors.request.use(
    async (config) => {
        const token = sessionStorage.getItem('accessToken')

        if (token) {
            config.headers['Authorization'] = token
        }
        return config
    },
    (error) => Promise.reject(error)
)

http.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config

        // Проверяем, истек ли токен
        if (error.response.status === 401 && !originalRequest._retry) {
            console.log('123')
            originalRequest._retry = true // Устанавливаем флаг, чтобы избежать повторного вызова
            try {
                const newToken = await refreshToken()
                originalRequest.headers['Authorization'] = `Bearer ${newToken}`
                return http(originalRequest) // Повторяем исходный запрос с новым токеном
            } catch (refreshError) {
                // Обработка ошибки обновления токена
                return Promise.reject(refreshError)
            }
        }

        return Promise.reject(error)
    }
)

const httpService = {
    get: http.get,
    post: http.post,
    put: http.put,
    delete: http.delete,
    patch: http.patch
}

export default httpService
