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

    addToAnswered(values) {
        return this.db.one('INSERT INTO answered_questions (user_id, question_id) VALUES (${user_id}, ${question_id}) RETURNING *', values);
    }

    addToRepetition(values) {
        return this.db.one('INSERT INTO repetitions (user_id, question_id) VALUES (${user_id}, ${question_id}) RETURNING *', values);
    }
}


export default QuestionsRepository;
