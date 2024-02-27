import queries from "../sql/sqlQueries.js";
import {IDatabase, IMain} from 'pg-promise';
import { pgp } from "../connection/db";


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

    findMemberByGroupIdAndUserId(value: { user_id: string; group_id: number; }) {
        return this.db.oneOrNone(`
            SELECT
                *
            FROM
                group_membership
            WHERE user_id = $<user_id> AND group_id = $<group_id>
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

    updateGroup(values: { id: number; group_name?: string; bio?: string; picture?: string; }) {
        // return this.db.one('UPDATE groups SET group_name = $<group_name>, bio = $<bio>, picture = $<picture> WHERE id = $<id> RETURNING *', values);
        const condition = pgp.as.format(' WHERE id = ${id} RETURNING *', values);
        const updateQuery = pgp.helpers.update(values, null, 'groups') + condition;
        return this.db.one(updateQuery);
    }

    addMember(values: { group_id: number; user_id: string; admin: boolean; accepted: boolean; }) {
        return this.db.one('INSERT INTO group_membership (group_id, user_id, admin, accepted) VALUES(${group_id}, ${user_id}, ${admin}, ${accepted}) RETURNING *', values);
    }

    removeMember(values: { user_id: string; group_id: number;}) {
        return this.db.none('DELETE FROM group_membership WHERE group_id = $<group_id> AND user_id = $<user_id>', values);
    }

    updateMembership(values: { user_id: string; group_id: number; accepted: boolean; }) {
        return this.db.one('UPDATE group_membership SET accepted = $<accepted> WHERE group_id = $<group_id> AND user_id = $<user_id> RETURNING *', values);
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
