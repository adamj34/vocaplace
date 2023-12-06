import express from 'express';
import { db, pgp } from "../db/connection/db.js";
import getUserId from './getUserIdMiddleware.js';

const router = express.Router();

const userId = '123e4567-e89b-12d3-a456-426614174001';

router.get('/quiz', (req, res) => {
    // const userId = req.userId;
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


export default router;
