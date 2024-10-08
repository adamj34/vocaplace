import pgPromise from 'pg-promise';
const { QueryFile } = pgPromise;

// Helper for linking to external query files
function sql(file) {
    const fullPath = new URL(file, import.meta.url).pathname; // generating full path;
    const currQueryFile = new QueryFile(fullPath, { minify: true });
    if (currQueryFile.error) {
        console.error(currQueryFile.error);
    }

    return currQueryFile;
}

const queries = {
    users: {
        add: sql('users/add.sql'),
        delete: sql('users/delete.sql'),
        find: sql('users/find.sql'),
        all: sql('users/all.sql'),
    },
    questions: {
        add: sql('questions/add.sql'),
        getQuiz: sql('questions/get_quiz.sql'),
        getRepetition: sql('questions/get_repetition.sql'),
        repetitionOverview: sql('questions/repetition_overview.sql'),
    },
    units: {
        add: sql('units/add.sql'),
        generalUserProgress: sql('units/general_user_progress.sql'),
        detailedUserProgress: sql('units/detailed_user_progress.sql'),
        overview: sql('units/overview.sql'),
    },
    topics: {
        add: sql('topics/add.sql'),
    },
    user_relationships: {
        changeRelationship: sql('user_relationships/change_relationship.sql'),
        acceptFriend: sql('user_relationships/accept_friend.sql'),
        checkRelationship: sql('user_relationships/check_relationship.sql'),
        deleteRelationship: sql('user_relationships/delete_relationship.sql'),
    },
    notifications: {
        add: sql('notifications/add.sql'),
        get: sql('notifications/get.sql'),
        delete: sql('notifications/delete.sql'),
        deleteAll: sql('notifications/delete_all.sql'),
        markAsRead: sql('notifications/mark_as_read.sql'),
        markAllAsRead: sql('notifications/mark_all_as_read.sql'),
        getByFriendId: sql('notifications/get_by_friend_id.sql'),
        deleteByGroupId: sql('notifications/delete_by_group_id.sql'),
        
    },
    messages: {
        add: sql('messages/add.sql'),
        get: sql('messages/get.sql'),
        delete: sql('messages/delete.sql'),
        findById: sql('messages/find_by_id.sql'),
        deleteByGroupId: sql('messages/delete_by_group_id.sql'),
    },

};

export default queries;
