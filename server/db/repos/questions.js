import queries from "../sql/sqlQueries.js";

class QuestionsRepository {
    constructor(db, pgp) {
        this.db = db;
        this.pgp = pgp;
    }

    add(values) {
        return this.db.one(queries.questions.add, values);
    }

    getQuiz(values) {
        return this.db.many(queries.questions.getQuiz, values);
    }

    findAll() {
        return this.db.any('SELECT * FROM questions');
    } 
}


export default QuestionsRepository;
