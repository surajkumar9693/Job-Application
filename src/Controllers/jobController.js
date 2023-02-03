const jobModel = require('../Models/jobModel.js')
const userModel = require('../Models/UserModel')
const check = require('../validations/validation.js')


//--------------------|| CREATE JOB  ||----------------------

const createJob = async function (req, res) {
    try {
        let data = req.body
        let { title, discription, email, skills, experience } = data

        if (!check.isValidRequestBody(data)) return res.status(400).send({ status: false, message: "please input some data" })

        let userId = req.params.UserId
        if (!userId) return res.status(400).send({ status: false, message: "please provide userId in params" })
        if (!check.isValidObjectId(userId)) return res.status(400).send({ status: false, msg: "please enter a valid userId" })

        if (!check.isValid(title)) return res.status(400).send({ status: false, message: `title is mandatory` })

        if (!check.isValid(discription)) return res.status(400).send({ status: false, message: `discription is mandatory` })

        if (!email) return res.status(400).send({ status: false, message: "Email is mandatory" })
        if (!check.isVAlidEmail(email)) return res.status(400).send({ status: false, message: "email is not valid" })

        let job = await jobModel.findOne({ email: email, userId: userId, title: title, discription: discription, skills: skills, experience: experience })
        if (job) {
            return res.status(400).send({ status: false, message: `job already posted` })
        }
        else {
            if (!check.isValid(skills)) return res.status(400).send({ status: false, message: `skills is mandatory` })

            if (!check.isValid(experience)) return res.status(400).send({ status: false, message: `experience is mandatory` })
            if (!check.isValidNumber(experience)) return res.status(400).send({ status: false, message: "Exprience should be in Number" })

            data.userId = userId
            let Document = await jobModel.create(data)
            return res.status(201).send({ status: true, msg: "success", data: Document })
        }
    } catch (error) {
        return res.status(500).send({ status: false, error: error.message })
    }
}

//--------------------|| GET JOB ||----------------------

let getJobDetails = async function (req, res) {
    try {
        let jobId = req.params.jobId

        let findApplicants = await userModel.find({ jobId: jobId })

        if (!findApplicants) return res.status(404).send({ status: false, msg: "no application found" })


    } catch (error) {
        return res.status(500).send({ status: false, error: error.message })
    }
}


//--------------------|| UPDATE JOB ||----------------------

const updateJobDetails = async function (req, res) {
    try {
        let jobId = req.params.jobId
        let data = req.body

        if (!check.isValid(data)) return res.status(400).send({ status: false, message: "please input data" })

        if (!jobId) return res.status(400).send({ status: false, message: "please provide a jobId in params" })
        if (!check.isValidObjectId(jobId)) return res.status(400).send({ status: false, msg: "please enter a valid jobId" })
        let findJobPosting = await jobModel.findOne({ _id: jobId, isDeleted: false })
        if (!findJobPosting) return res.status(404).send({ status: false, msg: "Job doesn't exists" })


        let updatedData = await jobModel.findOneAndUpdate({
            _id: findJobPosting._id
        },
            { $set: { ...data } },
            { new: true });
        return res.status(200).send({ status: true, message: "sucessfully updated", updatedData });

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}


//--------------------|| Delete JOB  ||----------------------

const deleteJobPosting = async function (req, res) {
    try {
        let jobId = req.params.jobId

        if (!jobId) return res.status(400).send({ status: false, message: "please provide a jobId in params" })
        if (!check.isValidObjectId(jobId)) return res.status(400).send({ status: false, msg: "please enter a valid jobId" })

        let findJobPosting = await jobModel.findOne({ _id: jobId, isDeleted: false })
        if (!findJobPosting) return res.status(404).send({ status: false, message: "job is already deleted" })

        let deleteJob = await jobModel.findByIdAndUpdate({
            _id: jobId
        },
            { $set: { isDeleted: true } },
            { new: true });
        return res.status(200).send({ status: true, message: "job sucessfully deleted", deleteJob });

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}






module.exports = { createJob, getJobDetails, updateJobDetails, deleteJobPosting }