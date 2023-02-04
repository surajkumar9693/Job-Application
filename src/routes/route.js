const express = require('express')
const router = express.Router()

const userController = require('../Controllers/userController')
const jobController = require('../Controllers/jobController')
const applyController = require('../Controllers/applyController')

const mid = require("../middleware/middleware.js")   

//--------------------|| USER API'S ||----------------------

router.post("/createUser",userController.createUser)
router.post("/login",userController.loginUser)

//--------------------|| JOB API'S ||----------------------

router.post('/jobcreate',jobController.createJob)
router.get('/getjob',jobController.getjob)
router.put('/updatejob/:jobId', jobController.updateJobDetails)
router.delete('/deletejob/:jobId', jobController.deleteJobPosting)
// router.delete('/job/:jobId/:UserId',mid.authentication, jobController.deleteJobPosting)

//--------------------|| apply API'S ||----------------------

router.post("/applyuser",applyController.applyuser)
router.get("/getapplyjob",applyController.getapplyjob)

module.exports = router