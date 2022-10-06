import mongoose from "mongoose";
import User from "../models/User.js";
import Form from "../models/Form.js";
import emailNotValid from "../libraries/emailNotValid.js";

class InviteController {
    async index(req, res) {
        //simpan sebuah task baru
        try {
            if(!req.params.id) { throw { code: 428, message: "ID_REQUIRED" } }
            if(!mongoose.Types.ObjectId.isValid(req.params.id)) { throw { code: 400, message: "INVALID_ID" } }

            //find form
            const form = await Form.findOne({ _id: req.params.id, userId: req.JWT.id })
                                    .select('invites');
            if(!form) { throw { code: 404, message: "INVITES_NOT_FOUND" } }

            res.status(200).json({
                status: true,
                message: 'INVITES_FOUND',
                invites: form.invites
            })
        } catch (err) {
            res.status(err.code || 500)
                .json({
                    status: false,
                    message: err.message,
                })
        }
    }

    async store(req, res) {
        try {
            if(!req.params.id) { throw { code: 428, message: "ID_REQUIRED" } }
            if(!req.body.email) { throw { code: 428, message: "EMAIL_REQUIRED" } }
            if(!mongoose.Types.ObjectId.isValid(req.params.id)) { throw { code: 400, message: "INVALID_ID" } }

            //owner can't invite himself
            const user = await User.findOne({ _id: req.JWT.id, email: req.body.email });
            if(user) { throw { code: 400, message: "CANNOT_INVITE_YOUR_SELF" } }
            
            //check is email invited before
            const userInvited = await Form.findOne({ invites: {"$in": req.body.email} });
            if(userInvited) { throw { code: 409, message: "EMAIL_INVITED" } }
            
            //is email valid?
            if(/.+@.+/.test(req.body.email) === false) { throw { code: 400, message: "EMAIL_IS_NOT_VALID" } }

            //update form
            const invite = await Form.findOneAndUpdate(
                                        { _id: req.params.id, userId: req.JWT.id }, 
                                        { $push: { invites: req.body.email } }, 
                                        { new: true })
            if(!invite) { throw { code: 500, message: "ADD_INVITE_FAILED" } }

            res.status(200).json({
                status: true,
                message: 'ADD_INVITE_SUCCESS',
                email: req.body.email
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
        //simpan sebuah task baru
        try {
            if(!req.params.id) { throw { code: 428, message: "ID_REQUIRED" } }
            if(!req.body.email) { throw { code: 428, message: "EMAIL_REQUIRED" } }
            if(!mongoose.Types.ObjectId.isValid(req.params.id)) { throw { code: 400, message: "INVALID_ID" } }
            
            //update form
            const invite = await Form.findOneAndUpdate(
                                        { _id: req.params.id, userId: req.JWT.id }, 
                                        { $pull: { invites: req.body.email } }, 
                                        { new: true })
            if(!invite) { throw { code: 500, message: "REMOVE_INVITE_FAILED" } }

            res.status(200).json({
                status: true,
                message: 'REMOVE_INVITE_SUCCESS',
                email: req.body.email
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

export default new InviteController();