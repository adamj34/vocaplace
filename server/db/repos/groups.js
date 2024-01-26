import queries from "../sql/sqlQueries.js";

class GroupsRepository {
    constructor(db, pgp) {
        this.db = db;
        this.pgp = pgp;
    }

    findById(value) {
        return this.db.oneOrNone(`
            SELECT
                *
            FROM
                groups
            WHERE id = $1
            `, [value.id]);
    }

    findGroupIdByName(value) {
        return this.db.oneOrNone(`
            SELECT
                id
            FROM
                groups
            WHERE group_name = $1
            `, [value.group_name]);
    }

    findMembersByGroupId(value) {
        return this.db.any(`
            SELECT
                user_id,
                admin
            FROM
                group_membership
            WHERE group_id = $1
            `, [value.id]);
    }

    addGroup(values) {
        return this.db.one('INSERT INTO groups (group_name, bio, picture) VALUES(${group_name}, ${bio}, ${picture}) RETURNING *', values);
    }

    addMember(values) {
        return this.db.one('INSERT INTO group_membership (group_id, user_id, admin) VALUES(${group_id}, ${user_id}, ${admin}) RETURNING *', values);
    }

    searchByGroupname(value) {
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
