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
}
