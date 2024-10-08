import axios from 'axios'

const server_port = process.env.REACT_APP_SERVER_PORT || 8000;

const Server = axios.create({
    baseURL: `${window.location.protocol}//${window.location.hostname}:${server_port}`,
    withCredentials: true,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    }
})


const functions = {

    async GetUserData(token) {
        Server.defaults.headers.common['Authorization'] = `Bearer ${token}`
        const res = await Server.get(`/user`)
        return res.data
    },

    async GetUserGroups() {
        const res = await Server.get(`/user/groups`)
        return res.data
    },

    async UpdateUserData(data) {
        const res = await Server.patch(`/user`, data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
        })
        return res.data
    },

    async UpdateGroupData(groupid, data) {
        const res = await Server.patch(`/groups/${groupid}`, data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
        })
        return res.data
    },

    async UpdatePoints(points) {
        await Server.patch(`/user/points`, {points:points})
    },

    async DeleteProfilePicture() {
        await Server.delete(`/user/profilePicture`)
    },

    async DeleteGroupPicture(groupid) {
        await Server.delete(`/groups/picture/${groupid}`)
    },

    async GetFriends() {
        const res = await Server.get(`/user/friends`)
        return res.data
    },

    async GetFriendRequests() {
        const res = await Server.get(`/relationships/pending/`)
        return res.data
    },

    async SendFriendRequest(userid) {
        const res = await Server.post(`/relationships/request/friend/${userid}`)
        return res.data.data
    },

    async CancelFriendRequest(userid) { // sent
        await Server.delete(`/relationships/request/sent/friend/${userid}`)
    },

    async AcceptFriendRequest(userid) {
        await Server.patch(`/relationships/accept/friend/${userid}`)
        return true
    },

    async DeleteFriendRequest(userid) { // received
        await Server.delete(`/relationships/request/received/friend/${userid}`)
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
    
    async GenerateQuiz(type, unitid, topicid) {
        if (type === 'normal') {
            const res = await Server.get(`/questions/quiz/?unitId=${unitid}&topicId=${topicid}`)
            res.data.data = res.data.data.unansweredQuestions.concat(res.data.data.answeredQuestions)
            return res.data
        } else if (type === 'repetition') {
            const res = await Server.get(`/questions/repetition`)
            return res.data
        }
        
    },

    async GetProfileData(userid) {
        const res = await Server.get(`/user/visit/${userid}`)
        return res.data
    },

    async GetNotifications(userid) {
        const res = await Server.get(`/notifications/${userid}`)
        return res.data
    },

    async DeleteNotification(notificationid) {
        await Server.delete(`/notifications/${notificationid}`)
    },

    async DeleteNotifications(userid) {
        await Server.delete(`/notifications/all/${userid}`)
    },
    async MarkNotificationAsRead(notificationid) {
        await Server.patch(`/notifications/${notificationid}`)
    },

    async MarkAllNotificationsAsRead(userid) {
        await Server.patch(`/notifications/all/${userid}`)
    },

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

    async GetSearchResults(query) {
        const res = await Server.get(`/search?searchPhrase=${query}`)
        return res.data
    },

    async GetRankingTop() {
        const res = await Server.get(`/rankings/top`)
        return res.data
    },

    async GetRankingFriends() {
        const res = await Server.get(`/rankings/friends`)
        return res.data
    },

    async GetRankingStreak() {
        const res = await Server.get(`/rankings/topStreaks`)
        return res.data
    },

    async GetRankingGroups() {
        const res = await Server.get(`/rankings/topGroups`)
        return res.data
    },

    async CreateGroup(group) {
        const res = await Server.post(`/groups`, group, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
        })
        return res.data
    },

    async GetGroupData(groupid) {
        const res = await Server.get(`/groups/${groupid}`)
        return res.data
    },

    async SendGroupJoinRequest(groupid) {
        await Server.post(`/groups/join/${groupid}`)
    },

    async RemoveUserFromGroup(groupid, userid) {
        await Server.delete(`/groups/membership/${groupid}/${userid}`)
    },

    async AcceptGroupJoinRequest(groupid, userid) {
        await Server.patch(`/groups/membership/${groupid}/${userid}`)
    },

    async PassGroupAdmin(groupid, userid) {
        await Server.patch(`/groups/admin/${groupid}/${userid}`)
    },

    async DeleteGroup(groupid) {
        await Server.delete(`/groups/${groupid}`)
    },
    async GetGroupMessages(groupid) {
        return await Server.get(`/groups/messages/${groupid}`)
    },
    async SendGroupMessage(groupid, data) {
        const res = await Server.post(`/groups/message/${groupid}`, data)
        return res.data
    },
    
    async DeleteGroupMessage(messageid) {
        return await Server.delete(`/groups/message/${messageid}`)
    }
     
}

export default functions