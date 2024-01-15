import axios from 'axios'
import keycloak from "./Keycloak"

const Server = axios.create({
    baseURL: `http://${window.location.hostname}:8000`,
    withCredentials: true,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        // Authorization: `Bearer ${keycloak.token}`
    }
})

export default {
    async GetUserData() {
        console.log("Fetching userdata")
        const res = await Server.get(`/user`)
        console.log(res)
        console.log("Userdata fetched")
    },

}