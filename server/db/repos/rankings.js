import queries from "../sql/sqlQueries.js";

class RankingsRepository {
    constructor(db, pgp) {
        this.db = db;
        this.pgp = pgp;
    }

    getTopUsers() {
        return this.db.any(`
        SELECT
            id,
            username,
            points,
            (SELECT profile_pictures.picture FROM profile_pictures WHERE profile_pictures.id = users.id) AS picture
        FROM
            users
        ORDER BY points DESC
        LIMIT 10
        `);
    }

}


export default RankingsRepository;
