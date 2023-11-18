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
        return this.db.one(queries.users.update, {
            id: values.id || '',
            bio: values.bio || '',
            nickname: values.nickname || '',
            private_profile: values.privatProfile || '',
        });
    }
}

export default UsersRepository;
