import queries from "../sql/sqlQueries.js";

class UsersRepository {
    constructor(db, pgp) {
        this.db = db;
        this.pgp = pgp;
    }

    add(values) {
        return this.db.one(queries.users.add, values);
    }

    delete(value) {
        return this.db.one(queries.users.delete, value);
    }

    update(values) {
        return this.db.one(queries.users.update, {
            id: values.id || null,
            bio: values.bio || null,
            username: values.username || null,
            privateProfile: values.privateProfile || null,
        });
    }

    findById(value) {
        return this.db.one(queries.users.find, value);
    }

    findGroupsByUserId(value) {
        return this.db.any(`
        SELECT
            group_id
        FROM
            group_membership
        WHERE user_id = $1
        `, [value.id]);
    }

    searchByUsername(value) {
        console.log(value);
        return this.db.any(`
        SELECT
            id,
            username,
            (SELECT profile_pictures.picture FROM profile_pictures WHERE profile_pictures.id = users.id) AS picture
        FROM
            users
        WHERE username ILIKE $1
        `,  ['%' + value.searchPhrase + '%']);
    } 
}

export default UsersRepository;
