const express = require('express')
const router = express.Router()

const userController = require('../Controllers/userController')
const jobController = require('../Controllers/jobController')

const mid = require("../middleware/middleware.js")   

//--------------------|| USER API'S ||----------------------

router.post("/createUser",userController.createUser)
router.post("/login",userController.loginUser)

//--------------------|| JOB API'S ||----------------------

router.post('/job/:UserId/jobPost',jobController.createJob)
router.get('/job/:jobId/:UserId',jobController.getJobDetails)
router.put('/job/:jobId/:UserId', jobController.updateJobDetails)
router.delete('/job/:jobId/:UserId', jobController.deleteJobPosting)
// router.delete('/job/:jobId/:UserId',mid.authentication, jobController.deleteJobPosting)


module.exports = router