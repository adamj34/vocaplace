import queries from "../sql/sqlQueries.js";
import { IDatabase, IMain } from 'pg-promise';
import { pgp } from "../connection/db";
import { string } from "yup";


class UsersRepository {
    db: IDatabase<any>;
    pgp: IMain;
    constructor(db, pgp) {
        this.db = db;
        this.pgp = pgp;
    }

    getAll() {
        return this.db.any(queries.users.all);
    }

    add(values: { id: string; username: string; }) {
        return this.db.one(queries.users.add, values);
    }

    delete(value: { id: string; }) {
        return this.db.one(queries.users.delete, value);
    }

    deleteProfilePicture(value: { id: string; }) {
        return this.db.none(`
        UPDATE
            users
        SET
            picture = NULL
        WHERE id = $<id>
        `, value);
    }

    updateUser(id: string, values: { bio?: string; private_profile?: boolean; picture?: string; }) {
        const condition = pgp.as.format(' WHERE id = ${id} RETURNING *', { id });
        const updateQuery = pgp.helpers.update(values, null, 'users') + condition;
        return this.db.one(updateQuery);
    }

    updatePoints(values: { id: string; points: number; }) {
        return this.db.one(`
        UPDATE
            users
        SET points = points + $<points>
        WHERE id = $<id>
        RETURNING points
        `, values);
    }

    findById(value: { id: string; }) {
        return this.db.one(queries.users.find, value);
    }

    findGroupsByUserId(value: { id: string; }) {
        return this.db.any(`
        SELECT
            g.*,
            gp.admin,
            gp.accepted
        FROM
            group_membership gp
        JOIN 
            groups g ON g.id = gp.group_id
        WHERE user_id = $<id>
        `, value);
    }

    searchByUsername(value: { searchPhrase: string; }) {
        return this.db.any(`
        SELECT
            id,
            username,
            picture
        FROM
            users
        WHERE username ILIKE $1
        `, ['%' + value.searchPhrase + '%']);
    }

    resetUsersStreak(value: { ids: string[]; }) {
        return this.db.none(`
        UPDATE
            users
        SET
        ongoing_streak = 0
        WHERE id IN ($1:csv)
        `, [value.ids]);
    }

    incrementUsersStreak(value: { ids: string[]; }){
        return this.db.none(`
        UPDATE
            users
        SET
            ongoing_streak = ongoing_streak + 1
        WHERE id IN ($1:csv)
        `, [value.ids]);
    } 

    updateLastPracticeDay(value: { id: string; }) {
        return this.db.none(`
        UPDATE
            users
        SET
            last_practice_day = NOW()
        WHERE id = $<id>
        `, value);
    }

}

export default UsersRepository;
