export const formatData = (date: string | Date, withHours: boolean = false) => {
    const dateObj = new Date(date as Date)
    const day = dateObj.getDate().toString().padStart(2, '0')
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0')
    const year = dateObj.getFullYear()

    if (withHours) {
        const hours = dateObj.getHours().toString().padStart(2, '0')
        const minutes = dateObj.getMinutes().toString().padStart(2, '0')
        return `${day}/${month}/${year} ${hours}:${minutes}`
    }

    return `${day}/${month}/${year}`
}
