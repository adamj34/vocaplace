import queries from "../sql/sqlQueries.js";


class QuestionsRepository {
    constructor(db, pgp) {
        this.db = db;
        this.pgp = pgp;

    }

    create() {
        return this.db.none(queries.questions.create);
    }

    // add({ question, answer, possible_answers, category, difficulty }) {
    //     return this.db.none(queries.questions.add, {question, answer, possible_answers, category, difficulty});
    // }

    // delete(id) {
    //     return this.db.none(queries.questions.delete, {id});
    // }

    findAll() {
        return this.db.any(queries.questions.findAll);
    }
}


export default QuestionsRepository;