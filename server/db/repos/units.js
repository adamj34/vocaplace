import queries from "../sql/sqlQueries.js";

class UnitsRepository {
    constructor(db, pgp) {
        this.db = db;
        this.pgp = pgp;
    }

    add(values) {
        return this.db.one(queries.categories.add, values);
    }
}

export default UnitsRepository;
