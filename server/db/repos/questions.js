import queries from "../sql/sqlQueries.js";

class QuestionsRepository {
    constructor(db, pgp) {
        this.db = db;
        this.pgp = pgp;
    }

    add(values) {
        return this.db.one(queries.questions.add, {
            unitId: +values.unitId,
            polishQuestionBody: values.polishQuestionBody,
            polishPossibleAnswers: values.polishPossibleAnswers,
            polishCorrectAnswers: values.polishCorrectAnswers,
            englishQuestionBody: values.englishQuestionBody,
            englishPossibleAnswers: values.englishPossibleAnswers,
            englishCorrectAnswers: values.englishCorrectAnswers,
            difficulty: +values.difficulty,
        });
    }

    findAll() {
        return this.db.any('SELECT * FROM questions');
    } 
}


export default QuestionsRepository;
