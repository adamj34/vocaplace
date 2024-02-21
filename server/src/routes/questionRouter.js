import express from 'express';
import questionController from '../controllers/questionController';

const router = express.Router();


router.post('/', (req, res) => {
    questionController.createQuestion(req, res);
});

router.get('/quiz', (req, res) => {
    questionController.getQuiz(req, res);
});  

router.post('/answered', (req, res) => {
    questionController.addToAnswered(req, res);
});

router.post('/repetition', (req, res) => {
    questionController.addToRepetition(req, res);
});

router.get('/repetition', (req, res) => {
    questionController.getRepetition(req, res);
});

router.get('/repetition/overview', (req, res) => {
    questionController.getRepetitionOverview(req, res);
});


export default router;
