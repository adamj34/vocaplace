import queries from "../sql/sqlQueries.js";

class UserRelationshipsRepository {
    constructor(db, pgp) {
        this.db = db;
        this.pgp = pgp;
    }

    addFriend(values) {
        return this.db.one(queries.user_relationships.addFriend, values);
    }

    acceptFriend(values) {
        return this.db.one(queries.user_relationships.acceptFriend, values);
    }

    checkRelationship(values) {
        return this.db.one(queries.user_relationships.checkRelationship, values);
    }

    deleteFriend(values) {
        return this.db.one(queries.user_relationships.deleteFriend, values);
    }

    findFriends(value) {
        return this.db.any(`
        SELECT user1_id AS friend_id
        FROM user_relationships
        WHERE user2_id = $1 AND relationship = 'friends'
        UNION ALL
        SELECT user2_id AS friend_id
        FROM user_relationships
        WHERE user1_id = $1 AND relationship = 'friends'`
        , [value.id]);
    }

    getPendingRequests(value) {
        return this.db.any(`
        SELECT
            CASE
                WHEN user1_id = $1 THEN user2_id
                ELSE user1_id
            END AS user_id
        FROM
            user_relationships
        WHERE 
            (user2_id = $1 AND relationship = 'pending_user1_user2') 
            OR 
            (user1_id = $1 AND relationship = 'pending_user2_user1')`
        , [value.id]);
    }
}

export default UserRelationshipsRepository;
