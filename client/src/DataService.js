import axios from 'axios'
const Server = axios.create({
    baseURL: `http://${window.location.hostname}:8000`,
    withCredentials: true,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    }
})

export default {

    SetToken(token) {
        Server.defaults.headers.common['Authorization'] = `Bearer ${token}`
        console.log('token set')
    },

    async GetUserData() {
        console.log("Fetching userdata")
        const res = await Server.get(`/user`)
        console.log("Userdata fetched")
        return res.data
    },

}