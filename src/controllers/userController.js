const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken")

const isValid= function(value){
  if( typeof (value)=== 'undefined' || typeof (value)=== 'null'){
      return false
  } 
  if(value.trim().length==0){
      return false
  } if(typeof (value) === 'string' && value.trim().length >0 ){
      return true
  }
}

const createUser = async function (req, res) {
  try {
    const data = req.body
    if (!Object.keys(data).length > 0) return res.status(400).send({ error: "Please enter data" })

    //  checking if any data field is empty or has no value
    if( !isValid(data.password) )    return res.status(400).send({ status : false, msg: 'please provide password'})
    if( !isValid(data.fname) )    return res.status(400).send({ status : false, msg: 'please provide First Name'})    
    if( !isValid(data.email) )    return res.status(400).send({ status : false, msg: 'please provide email'})
    if( !isValid(data.lname) )    return res.status(400).send({ status : false, msg: 'please provide last Name'})    
   
 
    const createUser = await userModel.create(data)
    res.status(201).send({ data: createUser })
  }
  catch (err) {
    console.log(err)
    res.status(500).send({ msg: err.message })
  }
}



const loginUser = async function (req, res) {
  try {
    let email = req.body.email;
    let password = req.body.password;

    // checking if email and password is missing in req body
    if (!email) return res.status(400).send({ error: " Please , enter email Id" })
    if (!password) return res.status(400).send({ error: " Please , enter password" })

    // checking if email and password has no value
    if (!isValid(email)) return res.status(400).send({ status: false, msg: 'please provide email' })
    if (!isValid(password)) return res.status(400).send({ status: false, msg: 'please provide password' })
    

    let user = await userModel.findOne({ email: email, password: password });
    if (!user)
      return res.status(404).send({
        status: false,
        msg: "user not found",
    });

    let token = jwt.sign({ userId: user._id.toString() }, "secuiretyKeyToCheckToken");
    res.setHeader("x-api-key", token);
    res.status(200).send({ status: "Author log-in successfully", data: token });
  }
  catch (err) {
    console.log(err)
    res.status(500).send({ msg: err.message })
  }
}

const user = async function (req, res) {
    try {
        const filter = req.query
        if (!Object.keys(filter).length > 0) return res.status(400).send({ error: "Please provide filetrs" })

        // checking , if any filter has no value
        if (filter.category != undefined) {
            if (!isValid(filter.category)) return res.status(400).send({ status: false, msg: 'please provide category' })
        }
        if (filter.subcategory != undefined) {
            if (!isValid(filter.subcategory)) return res.status(400).send({ status: false, msg: 'please provide subcategory' })
        }
        if (filter.tags != undefined) {
            if (!isValid(filter.tags)) return res.status(400).send({ status: false, msg: 'please provide tags' })
        }
        if (filter.authorId != undefined) {
            if (!isValid(filter.authorId)) return res.status(400).send({ status: false, msg: 'please provide authorId' })
        }

        // Searching if blog exist 
        const blogs = await blogModel.find({ ...filter, isDeleted: false, isPublished: true }).populate("authorId")
        if (!blogs) return res.status(404).send({ error: "No such data found" })

        res.status(200).send({ data: blogs })
    }
    catch (err) {
        console.log(err)
        res.status(500).send({ msg: err.message })
    }
}

const getUser = async function (req, res) {

    try {
      const filters = req.query
      console.log(filters)
      if (Object.keys(filters).length > 0) {
  
        const availableUser= await userModel.find({ $and: [filters, { isDeleted: false }] }).select({ _id: 1, fname: 1, email: 1, userId: 1,})
  
        if (!availableUser.length > 0) {
          return res.status(404).send({ status: false, message: "No user found For Given info" })
        }
  
       
  
        return res.status(200).send({ status: true, message: "user list", data: availableUser })
      }
      else {
        const allUser = await userModel.find()
        return res.status(200).send({ status: true, message: allUser })
      }
    }
  
    catch (err) {
      console.log(err)
      res.status(500).send({ status: "failed", message: err.message })
    }
  
  }
  
module.exports.getUser = getUser
module.exports.createUser = createUser
module.exports.loginUser = loginUser
