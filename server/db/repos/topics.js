import queries from "../sql/sqlQueries.js";

class TopicsRepository {
    constructor(db, pgp) {
        this.db = db;
        this.pgp = pgp;
    }

    add(value) {
        return this.db.one(queries.topics.add, value);
    }

    findTopicIdByName(value) {
        return this.db.oneOrNone(`
            SELECT
                id
            FROM
                topics
            WHERE topic = $1
            `, [value.topic]);
    }
}

export default TopicsRepository;
