import mongoose from "mongoose";
import Form from "../models/Form.js";

const allowedTypes = ["Text", "Email", "Radio", "Checkbox", "Dropdown"];

class QuestionController {

    async index(req, res) { 
        try {
            const form = await Form.findOne({ _id: req.params.id })
                                    .select('questions');
            if(!form) { throw { code: 404, message: "QUESTION_NOT_FOUND" } }

            res.status(200).json({
                    status: true,
                    form
                })
        } catch (err) {
            if(!err.code) { err.code = 500 }
            res.status(err.code)
                .json({
                    status: false,
                    message: err.message,
                    index: err.index,
                })
        }
    }

    //add question
    async store(req, res) {
        try {
            //check form id
            if(!req.params.id) { throw { code: 428, message: "ID_REQUIRED" } }
            if(!mongoose.Types.ObjectId.isValid(req.params.id)) { throw { code: 400, message: "INVALID_ID" } }

            //input field
            let newQuestion = {
                id: mongoose.Types.ObjectId(),
                type: 'Text',
                question: null,
                options: [],
                required: false,
            }

            //update form
            const question = await Form.findOneAndUpdate(
                                        { _id: req.params.id, userId: req.JWT.id }, 
                                        { $push: { questions: newQuestion } }, 
                                        { new: true })

            if(!question) { throw { code: 500, message: "ADD_QUESTION_FAILED" } }

            res.status(200).json({
                    status: true,
                    message: 'ADD_QUESTION_SUCCESS',
                    question: newQuestion
                })
        } catch (err) {
            res.status(err.code || 500)
                .json({
                    status: false,
                    message: err.message,
                })
        }
    }

    //update field
    async update(req, res) {
        try {
            //check form id
            if(!req.params.id) { throw { code: 428, message: "FORM_ID_REQUIRED" } }
            if(!req.params.questionId) { throw { code: 428, message: "QUESTION_ID_REQUIRED" } }
            if(!mongoose.Types.ObjectId.isValid(req.params.id)) { throw { code: 400, message: "INVALID_ID" } }

            let field = {}
            if(req.body.hasOwnProperty('question')){
                field['questions.$[indexQuestion].question'] = req.body.question
            }
            else if(req.body.hasOwnProperty('required')){
                field['questions.$[indexQuestion].required'] = req.body.required
            }
            else if(req.body.hasOwnProperty('type')){
                if(!allowedTypes.includes(req.body.type)) { throw { code: 400, message: "INVALID_TYPE" } }
                field['questions.$[indexQuestion].type'] = req.body.type
            }

            //update form
            const question = await Form.findOneAndUpdate(
                                        { _id: req.params.id, userId: req.JWT.id }, 
                                        { $set : field },
                                        { 
                                            arrayFilters: [ { 'indexQuestion.id': mongoose.Types.ObjectId(req.params.questionId) } ],
                                            new: true 
                                        })

            if(!question) { throw { code: 500, message: "UPDATE_QUESTION_FAILED" } }

            res.status(200).json({
                    status: true,
                    message: 'UPDATE_QUESTION_SUCCESS',
                    question
                })
        } catch (err) {
            res.status(err.code || 500)
                .json({
                    status: false,
                    message: err.message,
                })
        }
    }

    async destroy(req, res) {
        try {
            const question = await Form.findOneAndUpdate({ _id: req.params.id, userId: req.JWT.id  }, 
                                                        { 
                                                            $pull: { 
                                                                questions: { id: mongoose.Types.ObjectId(req.params.questionId) } 
                                                            } 
                                                        });
            if(!question) { throw { code: 500, message: "DELETE_QUESTION_FAILED" } }

            res.status(200).json({
                status: true,
                message: 'DELETE_QUESTION_SUCCESS',
                question
            })
        } catch (err) {
            if(!err.code) { err.code = 500 }
            res.status(err.code)
                .json({
                    status: false,
                    message: err.message
                })
        }
    }

}

export default new QuestionController();