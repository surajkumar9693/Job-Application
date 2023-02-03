const userModel = require('../Models/UserModel.js')
const { uploadFile } = require('../aws/aws')
const check = require('../validations/validation.js')
const bcrypt = require("bcrypt");
var jwt = require('jsonwebtoken');


//--------------------|| CREATE USER ||----------------------

const createUser = async function (req, res) {
    try {
        let userData = req.body
        let files = req.files

        let { name, mobile, email, password, resume } = userData

        if (!check.isValidRequestBody(userData)) return res.status(400).send({ status: false, message: "please input some data" })

        if (!name) return res.status(400).send({ status: false, message: "name is mandatory" })
        if (!check.isValidUserName(name)) return res.status(400).send({ status: false, message: `name is must in char` })

        if (!mobile) return res.status(400).send({ status: false, message: "mobile is mandatory" })
        if (!check.isValidPhone(mobile)) return res.status(400).send({ status: false, message: "please input mobile nuumber" })
        let checkPhone = await userModel.findOne({ mobile });
        if (checkPhone) return res.status(400).send({ status: false, message: "This Phone is already registered" });

        if (!email) return res.status(400).send({ status: false, message: "Email is mandatory" })
        if (!check.isVAlidEmail(email)) return res.status(400).send({ status: false, message: "email is not valid" })
        let checkEmail = await userModel.findOne({ email });
        if (checkEmail) return res.status(400).send({ status: false, message: "This email is already registered" });

        if (!password) return res.status(400).send({ status: false, message: "password is mandatory" })
        if (!check.isValidPassword(password)) return res.status(400).send({ status: false, message: "please input password nuumber" })
        const encryptedPassword = await bcrypt.hash(password, 10)
        userData.password = encryptedPassword

        let profile = files[0].originalname;

        if (check.isValidImage(resume)) {
            return res.status(400).send({ status: false, message: " Please provide only image  of format only-> pdf" })
        }

        if (!(files && files.length > 0)) {
            return res.status(400).send({ status: false, message: "Please Provide The Profile Image" });
        }

        const uploadedProfileImage = await uploadFile(files[0])
        userData.resume = uploadedProfileImage

        const createuser = await userModel.create(userData);
        return res.status(201).send({ status: true, message: "User created successfully", data: createuser });

    } catch (error) {
        return res.status(500).send({ status: false, error: error.message })
    }
}


//--------------------|| LOGIN USER ||----------------------

const loginUser = async function (req, res) {
    try {
        const requestBody = req.body
        if (!check.isValidRequestBody(requestBody)) return res.status(400).send({ status: false, message: `data is mandatory` })

        const { email, password } = requestBody

        if (!email) return res.status(400).send({ status: false, message: "please provide email" })
        if (!check.isVAlidEmail(email)) return res.status(400).send({ status: false, message: "email is not valid" })

        if (!password) return res.status(400).send({ status: false, message: "please provide password" })
        if (!check.isValidPassword(password)) return res.status(400).send({ status: false, message: `enter a valid password-"password length should be 8 min - 15 max"` })

        let user = await userModel.findOne({ email: email });
        if (!user) return res.status(404).send({ status: false, message: "no user found-invalid user" });

        let passwordCheck = await bcrypt.compare(password, user.password)
        if (!passwordCheck) return res.status(400).send({ status: false, message: "invalid password" });

        let token = jwt.sign({
            userId: user._id.toString()
        }, "suraj-job",
            {
                expiresIn: "12h"
            });

        return res.send({ status: true, message: "Success", data: token });
    } catch (error) {
        return res.status(500).send({ status: false, error: error.message })
    }
}


//--------------------|| UPDATE USER  ||----------------------

const updateUserDetails = async function (req, res) {
    try {
        let userId = req.params.UserId
        let data = req.body

        if (!check.isValidRequestBody(data)) return res.status(400).send({ status: false, message: "please input data" })
        if (!userId) return res.status(400).send({ status: false, message: "please provide userId in params" })
        if (!check.isValidObjectId(userId)) return res.status(400).send({ status: false, msg: "please enter a valid userId" })
        let findApplicant = await userModel.findOne({ userId: userId, isDeleted: false })
        if (!findApplicant) return res.status(404).send({ status: false, msg: "Applicantion doesn't exists" })


        let updatedData = await userModel.findOneAndUpdate({
            userId: userId
        },
            { $set: { ...data } },
            { new: true });
        return res.status(200).send({ status: true, message: "sucessfully updated", updatedData });

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}


//--------------------|| DELETE USER ||----------------------

const deleteuser = async function (req, res) {
    try {
        let userId = req.params.UserId

        if (!userId) return res.status(400).send({ status: false, message: "please provide a UserId in params" })
        if (!check.isValidObjectId(userId)) return res.status(400).send({ status: false, msg: "please enter a valid UserId" })

        let finduser = await userModel.findOne({ userId: userId, isDeleted: false })
        if (!finduser) return res.status(404).send({ status: false, message: "user is already deleted" })

        let deleteuser = await userModel.findOneAndUpdate({
            userId: userId
        },
            { $set: { isDeleted: true } },
            { new: true });
        return res.status(200).send({ status: true, message: "user sucessfully deleted", deleteuser });

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}


module.exports = { createUser, loginUser, deleteuser, updateUserDetails }