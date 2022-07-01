const express = require('express');
const router = express.Router();
const bossController = require("../controllers/bossController")
const userController= require("../controllers/userController")

const mw = require("../middleware/mw")

// create admin
router.post("/createAdmin", bossController.createBoss)



//  login  admin
router.post("/loginAdmin" , bossController.loginBoss)

//create user
router.post("/createUser",userController.createUser)

//login user
router.post("/loginUser",userController.loginUser)

//get api
router.get("/user",mw.authentication,userController.getUser)
module.exports = router;