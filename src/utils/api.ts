import axios from 'axios'

const http = axios.create({
    baseURL: import.meta.env.VITE_API_URL
})

http.interceptors.request.use(
    async (config) => {
        const token = sessionStorage.getItem('accessToken')

        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`
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
