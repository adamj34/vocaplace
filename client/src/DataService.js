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

    async UpdatePoints(points) {
        await Server.patch(`/user/points`, {points:points})
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

    async GetUnits() {
        const res = await Server.get(`/units/progress`)
        return res.data
    },

    async GetTopics(unitid) {
        const res = await Server.get(`/units/progress/${unitid}`)
        return res.data
    },
    async GenerateQuiz(unitid, topicid) {
        const res = await Server.get(`/questions/quiz/?unitId=${unitid}&topicId=${topicid}`)
        return res.data
    },

    async GetProfileData(userid) {
        const res = await Server.get(`/user/visit/${userid}`)
        return res.data
    },

    // async GetNotifications() {
    //     const res = await Server.get(`/user`)
    //     return res.data
    // },

    async SaveQuestionsAnswered(ids) {
        await Server.post(`/questions/answered`, {questionIds:ids})
    },

    async SaveRepetitions(ids) {
        await Server.post(`/questions/repetition`, {questionIds: ids})
    },
    
    async AddUnit(unit) {
        await Server.post(`/units`, unit)
    },

    async AddTopic(topic) {
        await Server.post(`/topics`, topic)
    },

    async AddQuestion(question) {
        await Server.post(`/questions`, question)
    },

    async GetUnitsTopicsQuestions() { // for admin panel
        const res = await Server.get(`/units/overview`)
        return res.data
    },

    async GetRepetitions() {
        const res = await Server.get(`/questions/repetition/overview`)
        return res.data
    },

    async GenerateRepetitionQuiz() {
        const res = await Server.get(`/questions/repetition`)
        return res.data
    },

    async GetSearchResults(query) {
        const res = await Server.get(`/search?searchPhrase=${query}`)
        return res.data
    },

    async GetRankingTop() {
        const res = await Server.get(`/rankings/top`)
        return res.data
    }
   
   
}