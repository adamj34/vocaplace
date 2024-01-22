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
        const question_ids = JSON.parse(values.question_ids);
        const dataMulti = question_ids.map(item => ({user_id: values.user_id, question_id: item}));

        const cs = new this.pgp.helpers.ColumnSet(['user_id', 'question_id'], {table: 'answered_questions'});
        const query = this.pgp.helpers.insert(dataMulti, cs);
        
        return this.db.none(query);
    }

    addToRepetition(values) {
        const question_ids = JSON.parse(values.question_ids);
        const dataMulti = question_ids.map(item => ({user_id: values.user_id, question_id: item}));

        const cs = new this.pgp.helpers.ColumnSet(['user_id', 'question_id'], {table: 'repetitions'});
        const query = this.pgp.helpers.insert(dataMulti, cs);

        return this.db.none(query);
        // return this.db.one('INSERT INTO repetitions (user_id, question_id) VALUES (${user_id}, ${question_id}) RETURNING *', values);
    }
}


export default QuestionsRepository;
