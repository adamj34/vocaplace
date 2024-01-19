import express from 'express';
import { db, pgp } from "../db/connection/db.js";

const router = express.Router();


router.post('/', (req, res) => {
    console.log(req.body);
    let questionId;
    db.tx(async () => {
        // check if unit and topic exist
        const unitId = await db.units.findUnitIdByName({unit: req.body.unit});
        const topicId = await db.topics.findTopicIdByName({topic: req.body.topic});
        if (!unitId || !topicId) {
            console.log('Unit or topic does not exist');
            res.status(400).json({
                success: false,
                err: 'Unit or topic does not exist'
            });
            return;
        }

        const question = {
            topic_id: topicId.id,
            content: req.body.content,
            correct_answers: JSON.parse(req.body.correctAnswers),
            misleading_answers: JSON.parse(req.body.misleadingAnswers),
            question_type: req.body.questionType,
            difficulty: req.body.difficulty,
        };
        const result = await db.questions.add(question);
        questionId = result.id;
    })
    .then(() => {
        res.setHeader('Location', '/question/' + questionId);
        res.status(201).json({
            success: true,
            data: {id: questionId}
        });
    })
    .catch((err) => {
        console.error(err);
        res.status(500).json({
            success: false,
            err
        });
    });

});

router.get('/quiz', (req, res) => {
    const userId = req.userId;
    const unitId = req.query.unitId;
    const topicId = req.query.topicId;
    db.questions.getQuiz({user_id: userId, unit_id: unitId, topic_id: topicId})
    .then((data) => {
        console.log(data);
        data = data[0];
        // validate when either answered_questions or unanswered_questions is null
        const dataFiltered = {
            answeredQuestions: (data.answered_questions || []).slice(0, 5),
            unansweredQuestions: (data.unanswered_questions || []).slice(0, 5)
        };
        res.status(200).json({
            success: true,
            data: dataFiltered
        });
    })
    .catch((err) => {
        console.error(err);
        res.status(500).json({
            success: false,
            err
        });
    });
});

router.post('/answered', (req, res) => {
    const userId = req.userId;
    const questionId = req.body.questionId;
    db.questions.addToAnswered({user_id: userId, question_id: questionId})
    .then((data) => {
        res.setHeader('Location', '/answered_question/' + questionId);
        res.status(201).json({
            success: true,
            data
        });
    })
    .catch((err) => {
        console.error(err);
        res.status(500).json({
            success: false,
            err
        });
    });
});

router.post('/repetition', (req, res) => {
    const userId = req.userId;
    const questionId = req.body.questionId;
    db.questions.addToRepetition({user_id: userId, question_id: questionId})
    .then((data) => {
        res.setHeader('Location', '/repetitions/' + questionId);
        res.status(201).json({
            success: true,
            data
        });
    })
    .catch((err) => {
        console.error(err);
        res.status(500).json({
            success: false,
            err
        });
    });
});

export default router;
