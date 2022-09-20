import mongoose from "mongoose";
import mongoosePaginate  from 'mongoose-paginate-v2';

const Schema = mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    formId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Form'
    },
    createdAt:{
        type: Number
    },
    updatedAt:{
        type: Number
    }
},
{
    timestamps: { currentTime: () => Math.floor(Date.now() / 1000) },
    strict: false
})

Schema.plugin(mongoosePaginate);

export default mongoose.model('Answer', Schema);