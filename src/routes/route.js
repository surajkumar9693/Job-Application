const express = require('express')
const router = express.Router()

const userController = require('../Controllers/userController')
const jobController = require('../Controllers/jobController')

const mid = require("../middleware/middleware.js")   

//--------------------|| USER API'S ||----------------------

router.post("/user/:UserId/createApplication",userController.createUser)
router.post("/login",userController.loginUser)
router.get('/user/:UserId/getJobPosting',userController.getUserDeatails)
router.put('/user/:UserId',mid.authentication,userController.updateUserDetails)
router.delete('/user/:UserId',mid.authentication,userController.deleteuser)

//--------------------|| JOB API'S ||----------------------

router.post('/job/:UserId/jobPost',mid.authentication,jobController.createJob)
router.get('/job/:jobId/:UserId',mid.authentication,jobController.getJobDetails)
router.put('/job/:jobId/:UserId',mid.authentication, jobController.updateJobDetails)
router.delete('/job/:jobId/:UserId',mid.authentication, jobController.deleteJobPosting)


module.exports = router