interface User {
    username: string
    password: string
}

export const useAccount = () => {
    const logIn = async (user: User) => {
        const reponse = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
            method: 'POST',
            // headers: {
            //   'Content-Type': 'application/x-www-form-urlencoded',
            // },
            body: JSON.stringify(user)
        })
        console.log(reponse)
    }

    return { logIn }
}
