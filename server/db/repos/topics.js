import queries from "../sql/sqlQueries.js";

class TopicsRepository {
    constructor(db, pgp) {
        this.db = db;
        this.pgp = pgp;
    }

    add(value) {
        return this.db.one(queries.topics.add, value);
    }
}

export default TopicsRepository;
