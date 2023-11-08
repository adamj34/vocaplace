import queries from "../sql/sqlQueries.js";

class SubcategoriesRepository {
    constructor(db, pgp) {
        this.db = db;
        this.pgp = pgp;
    }

    add(values) {
        return this.db.one(queries.subcategories.add, {
            subcategory: values.subcategory,
        });
    }
}

export default SubcategoriesRepository;