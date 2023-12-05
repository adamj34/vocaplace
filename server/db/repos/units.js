import queries from "../sql/sqlQueries.js";

class UnitsRepository {
    constructor(db, pgp) {
        this.db = db;
        this.pgp = pgp;
    }

    add(values) {
        return this.db.one(queries.units.add, values);
    }

    generalUserProgress(value) {
        return this.db.many(queries.units.generalUserProgress, value);
    }

    detailedUserProgress(values) {
        return this.db.many(queries.units.detailedUserProgress, values);
    }

    overview() {
        return this.db.many(queries.units.overview);
    }
}

export default UnitsRepository;
