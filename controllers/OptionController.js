import mongoose from "mongoose";
import Form from "../models/Form.js";

class OptionController {

    //add options
    async store(req, res) {
        try {
            //check form id
            if(!req.params.id) { throw { code: 428, message: "FORM_ID_REQUIRED" } }
            if(!req.params.questionId) { throw { code: 428, message: "QUESTION_ID_REQUIRED" } }
            if(!mongoose.Types.ObjectId.isValid(req.params.questionId)) { throw { code: 428, message: "INVALID_QUESTION_ID" } }
            if(!mongoose.Types.ObjectId.isValid(req.params.id)) { throw { code: 400, message: "INVALID_ID" } }
            if(!req.body.options) { throw { code: 428, message: "OPTIONS_REQUIRED" } }

            //field
            let option = {
                id: mongoose.Types.ObjectId(),
                value: req.body.options
            }

            //update form
            const question = await Form.findOneAndUpdate(
                                        { _id: req.params.id, userId: req.JWT.id }, 
                                        { $push : { 'questions.$[inner].options' : option } },
                                        { 
                                            arrayFilters: [{ "inner.id": mongoose.Types.ObjectId(req.params.questionId) }],
                                            new: true 
                                        })
            if(!question) { throw { code: 500, message: "UPDATE_OPTIONS_FAILED" } }

            res.status(200).json({
                    status: true,
                    message: 'UPDATE_OPTIONS_SUCCESS',
                    option
                })
        } catch (err) {
            res.status(err.code || 500)
                .json({
                    status: false,
                    message: err.message,
                })
        }
    }
    
    //update options
    async update(req, res) {
        try {
            if(!req.params.id) { throw { code: 428, message: "FORM_ID_REQUIRED" } }
            if(!req.params.questionId) { throw { code: 428, message: "QUESTION_ID_REQUIRED" } }
            if(!req.params.optionId) { throw { code: 428, message: "OPTION_ID_REQUIRED" } }
            if(!mongoose.Types.ObjectId.isValid(req.params.id)) { throw { code: 400, message: "INVALID_ID" } }
            if(!mongoose.Types.ObjectId.isValid(req.params.questionId)) { throw { code: 428, message: "INVALID_QUESTION_ID" } }
            if(!mongoose.Types.ObjectId.isValid(req.params.optionId)) { throw { code: 400, message: "OPTION_ID_REQUIRED" } }

            //update form
            const question = await Form.findOneAndUpdate(
                                        {  _id: req.params.id, userId: req.JWT.id }, 
                                        { $set : { "questions.$[indexQuestion].options.$[indexOption].value": req.body.options } },
                                        { 
                                            arrayFilters: [
                                                { 'indexQuestion.id': mongoose.Types.ObjectId(req.params.questionId) },
                                                { 'indexOption.id': mongoose.Types.ObjectId(req.params.optionId) }
                                            ],
                                            new: true 
                                        })
            if(!question) { throw { code: 500, message: "UPDATE_OPTIONS_FAILED" } }

            res.status(200).json({
                    status: true,
                    message: 'UPDATE_OPTIONS_SUCCESS',
                    option: {
                        id: req.params.optionId,
                        value: req.body.options
                    }
                })
        } catch (err) {
            res.status(err.code || 500)
                .json({
                    status: false,
                    message: err.message,
                })
        }
    }

    //delete options
    async destroy(req, res) {
        try {
            //check form id
            if(!req.params.id) { throw { code: 428, message: "FORM_ID_REQUIRED" } }
            if(!req.params.questionId) { throw { code: 428, message: "QUESTION_ID_REQUIRED" } }
            if(!req.params.optionId) { throw { code: 428, message: "OPTION_ID_REQUIRED" } }
            if(!mongoose.Types.ObjectId.isValid(req.params.id)) { throw { code: 400, message: "INVALID_ID" } }
            if(!mongoose.Types.ObjectId.isValid(req.params.questionId)) { throw { code: 428, message: "INVALID_QUESTION_ID" } }
            if(!mongoose.Types.ObjectId.isValid(req.params.optionId)) { throw { code: 400, message: "OPTION_ID_REQUIRED" } }


            const question = await Form.findOneAndUpdate({ _id: req.params.id, userId: req.JWT.id,  }, 
                                                        { 
                                                            $pull: { 
                                                                'questions.$[indexQuestion].options': { id: mongoose.Types.ObjectId(req.params.optionId) } 
                                                            } 
                                                        },
                                                        {
                                                            arrayFilters: [{ 
                                                                "indexQuestion.id": mongoose.Types.ObjectId(req.params.questionId)
                                                            }],
                                                            new: true 
                                                        });

            if(!question) { throw { code: 500, message: "DELETE_OPTIONS_FAILED" } }

            res.status(200).json({
                    status: true,
                    message: 'DELETE_OPTIONS_SUCCESS',
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

}

export default new OptionController();