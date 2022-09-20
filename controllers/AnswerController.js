import mongoose from "mongoose";
import Form from "../models/Form.js";
import Answer from "../models/Answer.js";
import isQuestionRequiredEmpty from "../libraries/isQuestionRequiredEmpty.js";
import isQuestionIdNotValid from "../libraries/isQuestionIdNotValid.js";
import isAnswerDuplicated from "../libraries/isAnswerDuplicated.js";
import isOptionValueExist from "../libraries/isOptionValueExist.js";

class AnswerController {
    async store(req, res) {
        //simpan sebuah task baru
        try {
            if(!mongoose.Types.ObjectId.isValid(req.params.formId)) { throw { code: 400, message: "INVALID_ID" } }

            const forms = await Form.findById(req.params.formId)
            if(!forms) { throw { code: 404, message: "FORM_NOT_FOUND" } }

            const isDuplicate = await isAnswerDuplicated(req.body.answers)
            if(isDuplicate) { throw { code: 400, message: "ANSWER_DUPLICATED" } }

            const notValid = await isQuestionIdNotValid(forms, req.body.answers)
            if(notValid) { throw { code: 400, message: "QUESTION_NOT_FOUND" } }

            const questionRequiredEmpty = await isQuestionRequiredEmpty(forms, req.body.answers)
            if(questionRequiredEmpty) { throw { code: 428, question: questionRequiredEmpty, message: "QUESTION_REQUIRED" } }

            const valueNotExist = await isOptionValueExist(forms, req.body.answers)
            if(valueNotExist) { throw { code: 400, question: valueNotExist, message: "VALUE_IS_NOT_EXIST_IN_OPTIONS" } }

            let fields = {};
            req.body.answers.forEach((answer) => {
                fields[answer.questionId] = answer.value
            })

            //create answers
            const newAnswer = new Answer({
                userId: req.JWT.id,
                formId: req.params.formId,
                ...fields
            });
            const answer = await newAnswer.save();
            if(!answer) { throw { code: 500, message: "FAILED_ANSWER" } }

            res.status(200).json({
                status: true,
                message: "SUCCESS_ANSWER",
                answer
            })
        } catch (err) {
            let returnError = {
                status: false,
                message: err.message,
            }

            if(err.question) {
                returnError.question = err.question
            }

            res.status(err.code || 500)
                .json(returnError)
        }
    }
}

export default new AnswerController();