
export function DateFormat(d) {
    const date = new Date(d)

    const day = date.getDate()
    const dayth = Dayth(day)
    const month = date.toLocaleString('en-US', { month: 'long' })
    const year = date.getFullYear()

    return `${day}${dayth} ${month} ${year}`
}

function Dayth(day) {
    switch (day % 10) {
        case 1:
            return `st`
        case 2:
            return `nd`
        case 3:
            return `rd`
        default:
            return `th`
    }
}
