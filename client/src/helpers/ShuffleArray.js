
export function ShuffleArray(arr) {
    const shuffled = arr.sort((a, b) => 0.5 - Math.random())
    return shuffled
}
