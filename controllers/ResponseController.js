import mongoose from "mongoose";
import Form from "../models/Form.js";
import Answer from "../models/Answer.js";

class ResponseController {
    async lists(req, res) {
        try {
            if(!req.params.formId) { throw { code: 400, message: "ID_REQUIRED" } }
            if(!mongoose.Types.ObjectId.isValid(req.params.formId)) { throw { code: 400, message: "INVALID_ID" } }

            const form = await Form.findOne({ _id: req.params.formId })
            if(!form) { throw { code: 404, message: "FORM_NOT_FOUND" } }

            const answers = await Answer.find({ formId: req.params.formId })
            if(!answers) { throw { code: 404, message: "LIST_NOT_FOUND" } }

            res.status(200).json({
                status: true,
                message: "LIST_FOUND",
                total: answers.length,
                form,
                answers
            })
        } catch (err) {
            res.status(err.code || 500)
                .json({
                    status: false,
                    message: err.message,
                })
        }
    }

    async summaries(req, res) {
        try {
            if(!req.params.formId) { throw { code: 400, message: "ID_REQUIRED" } }
            if(!mongoose.Types.ObjectId.isValid(req.params.formId)) { throw { code: 400, message: "INVALID_ID" } }

            const form = await Form.findOne({ _id: req.params.formId })
            if(!form) { throw { code: 404, message: "FORM_NOT_FOUND" } }

            const answers = await Answer.find({ formId: req.params.formId })
            if(!answers) { throw { code: 404, message: "SUMMARY_NOT_FOUND" } }

            const summaries = form.questions.map((question) => {
                let summary = {
                    questionId: question.id,
                    question: question.question,
                    answers: answers.map((answer) => answer[question.id] )
                }

                return summary
            })

            res.status(200).json({
                status: true,
                message: "SUMMARY_FOUND",
                total: answers.length,
                summaries
            })
        } catch (err) {
            res.status(err.code || 500)
                .json({
                    status: false,
                    message: err.message,
                })
        }
    }
}

export default new ResponseController();