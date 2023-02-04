const jobModel = require('../Models/jobModel.js')
const check = require('../validations/validation.js')


//--------------------|| CREATE JOB  ||----------------------

const createJob = async function (req, res) {
    try {
        let data = req.body
        // let userId = req.params.userId;
        let { title, discription, email, skills, experience } = data

        if (!check.isValidRequestBody(data)) return res.status(400).send({ status: false, message: "please input some data" })

        // if (!userId) return res.status(400).send({ status: false, message: "please provide userId in params" })
        // if (!check.isValidObjectId(userId)) return res.status(400).send({ status: false, msg: "please enter a valid userId" })

        if (!title) return res.status(400).send({ status: false, message: "title is mandatory" })
        if (!check.isValid(title)) return res.status(400).send({ status: false, message: `not isvalid title` })

        if (!discription) return res.status(400).send({ status: false, message: "discription is mandatory" })
        if (!check.isValid(discription)) return res.status(400).send({ status: false, message: `not is valid  discription ` })

        if (!email) return res.status(400).send({ status: false, message: "Email is mandatory" })
        if (!check.isVAlidEmail(email)) return res.status(400).send({ status: false, message: "email is not valid" })

        if (!skills) return res.status(400).send({ status: false, message: "skills is mandatory" })

        if (!experience) return res.status(400).send({ status: false, message: "experience is mandatory" })
        if (!Number(experience)) return res.status(400).send({ status: false, message: "experience is only number" })

        let checkdetails = await jobModel.findOne({
            email: email,
            // userId: userId,
            title: title,
            discription: discription,
            skills: skills,
            experience: experience
        })
        if (checkdetails) {
            return res.status(400).send({ status: false, message: "job allready creted" })
        }
        else {
            // data.userId=userId
            let createdJob = await jobModel.create(data)
            return res.status(201).send({ status: true, message: " creted job", data: createdJob })
        }

    } catch (error) {
        console.log(error)
        return res.status(500).send({ status: false, error: error.message })
    }
}

//--------------------|| GET JOB ||----------------------

const getjob = async function (req, res) {
    try {
                //   title, discription, email, skills, experience
        let requestBody = req.query
        if (requestBody.title === "") {
            return res.status(400).send({ status: false, msg: "please enter a title" })
        }

        if (requestBody.discription === "") {
            return res.status(400).send({ status: false, msg: "please enter a discription" })
        }
        if (requestBody.jobId === "") {
            return res.status(400).send({ status: false, msg: "please enter job id" })
        }

        let getJobDetails = await jobModel.find({ isDeleted: false, ...requestBody }).sort({ title: 1 }).select({ title:1, discription:1, email:1, skills:1, experience:1 })

        if (!getJobDetails) {
            return res.status(404).send({ status: false, msg: 'no job found' })
        } else {
            return res.status(200).send({ status: true, msg: "job fetch is successful", data: getJobDetails })
        }


    } catch (error) {
        return res.status(500).send({ status: false, msg: error.message })
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
        let findJob = await jobModel.findOne({ _id: jobId, isDeleted: false })
        if (!findJob) return res.status(404).send({ status: false, msg: "Job doesn't exists" })

        let updatedData = await jobModel.findOneAndUpdate({
            _id: findJob._id
        },
            { $push: { ...data } },
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
            _id: findJobPosting._id
        },
            { $set: { isDeleted: true } },
            { new: true });
        return res.status(200).send({ status: true, message: "job sucessfully deleted", deleteJob });

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}


module.exports = { createJob, getjob, updateJobDetails, deleteJobPosting }