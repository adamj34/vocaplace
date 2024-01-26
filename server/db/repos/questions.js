import queries from "../sql/sqlQueries.js";

class QuestionsRepository {
    constructor(db, pgp) {
        this.db = db;
        this.pgp = pgp;
    }
  
    findAll() {
        return this.db.any('SELECT * FROM questions');
    }

    add(values) {
        return this.db.one(queries.questions.add, values);
    }

    getQuiz(values) {
        return this.db.many(queries.questions.getQuiz, values);
    }

    getRepetition(values) {
        return this.db.any(queries.questions.getRepetition, values);
    }        

    repetitionOverview(values) { 
        return this.db.many(queries.questions.repetitionOverview, values);
    }

    addToAnswered(values) {
        // const question_ids = JSON.parse(values.question_ids);
        const question_ids = values.question_ids;
        const dataMulti = question_ids.map(item => ({user_id: values.user_id, question_id: item}));

        const cs = new this.pgp.helpers.ColumnSet(['user_id', 'question_id'], {table: 'answered_questions'});
        const query = this.pgp.helpers.insert(dataMulti, cs) + ' ON CONFLICT (user_id, question_id) DO NOTHING';
        
        return this.db.none(query)
            .then(() => {
                const query = `
                    DELETE FROM
                        repetitions
                    WHERE
                        user_id = $1
                        AND question_id IN ($2:csv)`;
                return this.db.none(query, [values.user_id, question_ids]);
            })
            .catch((err) => {
                console.error(err);
            });
    }

    addToRepetition(values) {
        // const question_ids = JSON.parse(values.question_ids);
        const question_ids = values.question_ids;
        const dataMulti = question_ids.map(item => ({user_id: values.user_id, question_id: item}));

        const cs = new this.pgp.helpers.ColumnSet(['user_id', 'question_id'], {table: 'repetitions'});
        const query = this.pgp.helpers.insert(dataMulti, cs) + ' ON CONFLICT (user_id, question_id) DO NOTHING';

        return this.db.none(query);
    }
}


export default QuestionsRepository;
