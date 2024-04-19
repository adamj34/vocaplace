import queries from "../sql/sqlQueries.js";
import { IDatabase, IMain } from "pg-promise";

class RankingsRepository {
    db: IDatabase<any>;
    pgp: IMain;
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
            picture
        FROM
            users
        ORDER BY points DESC
        LIMIT 10
        `);
    }

    getTopUsersByStreak() {
        return this.db.any(`
        SELECT
            id,
            username,
            points,
            picture,
            ongoing_streak
        FROM
            users
        ORDER BY ongoing_streak DESC
        LIMIT 10
        `);
    }

    getTopGroups() {
        return this.db.any(`
        SELECT
            groups.id,
            groups.group_name,
            groups.bio,
            groups.picture,
            AVG(users.points) AS points_avg
        FROM
            groups
        JOIN
            group_membership
        ON
            groups.id = group_membership.group_id
        JOIN
            users 
        ON
            group_membership.user_id = users.id
        WHERE 
            group_membership.accepted = true
        GROUP BY
            groups.id
        LIMIT 10
        `);
    }

}


export default RankingsRepository;
