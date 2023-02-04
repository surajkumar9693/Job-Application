const userModel = require('../Models/UserModel.js')
const jobModel = require('../Models/jobModel.js')
const applyModel = require('../Models/applyModel.js')
const { uploadFile } = require('../aws/aws')
const check = require('../validations/validation.js')




//--------------------|| CREATE USER ||----------------------

const applyuser = async function (req, res) {
   try {
      let data = req.body
      // let userId = req.params.UserId
      let { name, email, jobId, userId } = data

      if (!check.isValidRequestBody(data)) return res.status(400).send({ status: false, message: "please input some data" })

      if (!userId) return res.status(400).send({ status: false, message: "please input userId" })
      if (!check.isValidObjectId(userId)) return res.status(400).send({ status: false, msg: "please enter a valid userId" })
      let checkuserId = await userModel.findOne({ _Id: userId })
      if (!checkuserId) {
         return res.status(400).send({ status: false, message: "user not fount in db" })
      }

      if (!name) return res.status(400).send({ status: false, message: "name is mandatory" })
      if (!check.isValidname(name)) return res.status(400).send({ status: false, message: `name is must in char` })

      if (!email) return res.status(400).send({ status: false, message: "Email is mandatory" })
      if (!check.isVAlidEmail(email)) return res.status(400).send({ status: false, message: "email is not valid" })

      if (!jobId) return res.status(400).send({ status: false, message: "please input jobId" })
      if (!check.isValidObjectId(jobId)) return res.status(400).send({ status: false, msg: "please enter a valid jobId" })
      let checkjobId = await jobModel.findOne({ email: email, jobId: jobId })

      if (checkjobId) {
         return res.status(400).send({ status: false, message: `already applied || email already exist` })
      }
      else {

         let files = req.files
         if (files && files.length == 0)
            return res.status(400).send({ status: false, message: "Profile Image is required" });
         else if (!check.isValidResume(files[0].originalname))
            return res.status(400).send({ status: false, message: "Profile Image is required as an Image format" });
         else data.resume = await uploadFile(files[0]);

         let applyjob = await applyModel.create(data)
         res.status(201).send({ status: true, msg: "success", data: applyjob })
      }
   } catch (error) {
      return res.status(500).send({ status: false, error: error.message })
   }
}

//--------------------|| get apply job ||----------------------

const getapplyjob = async function (req, res) {
   try {

       let requestBody = req.query
       if (requestBody.name === "") {
           return res.status(400).send({ status: false, msg: "please enter a name" })
       }

       if (requestBody.email === "") {
           return res.status(400).send({ status: false, msg: "please enter a email" })
       }
       if (requestBody.userId === "") {
           return res.status(400).send({ status: false, msg: "please enter userId id" })
       }

       let findapplyjob = await jobModel.find({ isDeleted: false, ...requestBody }).sort({ title: 1 }).select({ title:1, discription:1, email:1, skills:1, experience:1 })

       if (!findapplyjob) {
           return res.status(404).send({ status: false, msg: 'no job found' })
       } else {
           return res.status(200).send({ status: true, msg: "job fetch is successful", data: findapplyjob })
       }
   } catch (error) {
       return res.status(500).send({ status: false, msg: error.message })
   }
}



module.exports = { applyuser, getapplyjob }