import queries from "../sql/sqlQueries.js";
import {IDatabase, IMain} from 'pg-promise';


class GroupsRepository {
    db: IDatabase<any>;
    pgp: IMain;
    constructor(db, pgp) {
        this.db = db;
        this.pgp = pgp;
    }

    findById(value: { id: number; }) {
        return this.db.oneOrNone(`
            SELECT
                *
            FROM
                groups
            WHERE id = $<id>
            `, value);
    }

    findGroupIdByName(value: { group_name: string; }) {
        return this.db.oneOrNone(`
            SELECT
                id
            FROM
                groups
            WHERE group_name = $<group_name>
            `, value);
    }

    findMembersByGroupId(value: { id: number; }) {
        return this.db.any(`
            SELECT
                user_id,
                admin
            FROM
                group_membership
            WHERE group_id = $<id>
            `, value);
    }

    addGroup(values: { group_name: string; bio: string; picture: string; }) {
        return this.db.one('INSERT INTO groups (group_name, bio, picture) VALUES(${group_name}, ${bio}, ${picture}) RETURNING *', values);
    }

    addMember(values: { group_id: number; user_id: string; admin: boolean; }) {
        return this.db.one('INSERT INTO group_membership (group_id, user_id, admin) VALUES(${group_id}, ${user_id}, ${admin}) RETURNING *', values);
    }

    searchByGroupname(value: { searchPhrase: string; }) {
        return this.db.any(`
        SELECT
            id,
            group_name,
            picture
        FROM
            groups
        WHERE group_name ILIKE $1
        `,  ['%' + value.searchPhrase + '%']);
    }
}

export default GroupsRepository;
