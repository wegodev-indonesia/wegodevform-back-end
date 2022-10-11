import express from 'express';
import jwtAuth from "../middlewares/jwtAuth.js";
import Auth from '../controllers/AuthController.js';
import Form from '../controllers/FormController.js';
import Question from '../controllers/QuestionController.js';
import Option from '../controllers/OptionController.js';
import Answer from '../controllers/AnswerController.js';
import Response from '../controllers/ResponseController.js';
import Invite from '../controllers/InviteController.js';

var router = express.Router();

//Auth
router.post('/auth/register', Auth.register);
router.post('/auth/login', Auth.login);
router.post('/auth/refresh-token', Auth.refreshToken);

// forms
router.get('/forms', jwtAuth(), Form.index);
router.post('/forms', jwtAuth(), Form.store);
router.get('/forms/:id', jwtAuth(), Form.show);
router.put('/forms/:id', jwtAuth(), Form.update);
router.delete('/forms/:id', jwtAuth(), Form.destroy);
router.get('/forms/:id/users', jwtAuth(), Form.showToUser);

//question
router.get('/forms/:id/questions', jwtAuth(), Question.index);
router.post('/forms/:id/questions', jwtAuth(), Question.store);
router.put('/forms/:id/questions/:questionId', jwtAuth(), Question.update);
router.delete('/forms/:id/questions/:questionId', jwtAuth(), Question.destroy);

//option
router.post('/forms/:id/questions/:questionId/options', jwtAuth(), Option.store); //add options
router.put('/forms/:id/questions/:questionId/options/:optionId', jwtAuth(), Option.update); //update options
router.delete('/forms/:id/questions/:questionId/options/:optionId', jwtAuth(), Option.destroy); //delete options

//invite
router.get('/forms/:id/invites', jwtAuth(), Invite.index);
router.post('/forms/:id/invites', jwtAuth(), Invite.store);
router.delete('/forms/:id/invites', jwtAuth(), Invite.destroy);

//answer
router.post('/answers/:formId', jwtAuth(), Answer.store);

//summary
router.get('/responses/:formId/summaries', jwtAuth(), Response.summaries);
router.get('/responses/:formId/lists', jwtAuth(), Response.lists);

export default router;
