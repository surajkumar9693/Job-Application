const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const jobSchema = new mongoose.Schema({
    title:{
        type: String,
        require: true
    },
    discription:{
        type: String,
        require: true
    },
    email:{
        type: String,
        require: true
    },
    skills:{
        type: [String],
        require: true
    },
    experience:{
        type: Number,
        require: true
    },
    isDeleted:{
        type: Boolean,
        require: true,
        default:false
    }

},{timestamps: true})

module.exports = mongoose.model('job', jobSchema)