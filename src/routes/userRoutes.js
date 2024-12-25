const express = require('express')
const router = express.Router();
const validateEmail = require('../middlewares/validateEmail.js')


const {registerUser, loginUser,getUsers} = require('../controllers/userControllers.js');


const verifyToken = require('../middlewares/verifyToken.js');
const verifyRole = require('../middlewares/verifyRole.js');



router.route("/register").post(validateEmail,registerUser)
router.route("/login").post(loginUser)
router.get("/",verifyToken,getUsers)




module.exports = router