import queries from "../sql/sqlQueries.js";

class CategoriesRepository {
    constructor(db, pgp) {
        this.db = db;
        this.pgp = pgp;
    }

    add(values) {
        return this.db.one(queries.categories.add, {
            subcategoryId: values.subcategoryId,
            category: values.category,
        });
    }
}

export default CategoriesRepository;