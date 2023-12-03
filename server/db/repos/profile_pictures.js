import queries from "../sql/sqlQueries.js";

class ProfilePicturesRepository {
    constructor(db, pgp) {
        this.db = db;
        this.pgp = pgp;
    }

    upsert(values) {
        return this.db.one(queries.profile_pictures.upsert, values);
    }

    delete(value) {
        return this.db.one(queries.profile_pictures.delete, value);
    }
}

export default ProfilePicturesRepository;
