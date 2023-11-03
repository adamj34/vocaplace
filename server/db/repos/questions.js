import queries from "../sql/sqlQueries.js";

class QuestionsRepository {
    constructor(db, pgp) {
        this.db = db;
        this.pgp = pgp;
    }

    add(values) {
        return this.db.one(queries.questions.add, {
            categoryId: +values.categoryId,
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
        return this.db.any(queries.questions.findAll);
    } 
}


export default QuestionsRepository;