import queries from "../sql/sqlQueries.js";

class UsersRepository {
    constructor(db, pgp) {
        this.db = db;
        this.pgp = pgp;
    }

    add(value) {
        return this.db.one(queries.users.add, value);
    }

    delete(value) {
        return this.db.one(queries.users.delete, value);
    }

    update(values) {
        const p = {
            id: values.id || '',
            bio: values.bio || '',
            nickname: values.nickname || '',
            private_profile: values.privateProfile || '',
        };
        console.log(p);
        return this.db.one(queries.users.update, {
            id: values.id || null,
            bio: values.bio || null,
            nickname: values.nickname || null,
            privateProfile: values.privateProfile || null,
        });
    }

    find(value) {
        return this.db.one(queries.users.find, value);
    }
}

export default UsersRepository;
