import queries from "../sql/sqlQueries.js";

class UnitsRepository {
    constructor(db, pgp) {
        this.db = db;
        this.pgp = pgp;
    }

    add(values) {
        return this.db.one(queries.units.add, values);
    }

    userProgress(value) {
        return this.db.many(queries.units.userProgress, value);
    }
}

export default UnitsRepository;
