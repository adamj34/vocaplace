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
    },

    async GetUserData() {
        const res = await Server.get(`/user`)
        return res.data
    },

    async UpdateUserData(data) { // expects: keycloak token in header, body {nickname, bio, private_profile, picture}
        await Server.patch(`/user`, data)
    },

    async DeleteProfilePicture() {
        await Server.delete(`/user/profilePicture`)
    },

    async SendFriendRequest(userid) {
        await Server.post(`/relationships/request/friend/${userid}`)
    },

    async AcceptFriendRequest(userid) {
        await Server.post(`/relationships/accept/friend/${userid}`)
    },

    async IsFriend(userid) {
        const res = await Server.get(`/relationships/check/user/${userid}`)
        if (res.data.relationship == 'friends') {
            return true
        } else { // null
            return false
        }
    },

    async DeleteFriend(userid) {
        await Server.delete(`/relationships/friend/${userid}`)
    },

    async GetUnitsProgress() {
        const res = await Server.get(`/units/progress`)
        return res.data
    },

    async GetUnitData(unitid) {
        const res = await Server.get(`/units/progress/${unitid}`)
        return res.data
    },


    async GetNotifications() {
        const res = await Server.get(`/user`)
        return res.data
    },

   
}