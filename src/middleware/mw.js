const jwt = require("jsonwebtoken")
const bossModel=require("../models/bossModel")
const userModel=require("../models/userModel")


const authentication = function (req, res, next) {
    try {
        let token = req.headers["x-api-key"]
        if (!token) {
            return res.status(400).send({ status: false, msg: "token must be present" });
        }
        let decodedToken = jwt.verify(token, "secuiretyKeyToCheckToken");
        
        if (!decodedToken) {
            return res.status(401).send({ status: false, msg: "token is invalid" });
        }
        next();
    }
    catch (err) {
        console.log(err)
        res.status(500).send({ msg: err.message })
    }


}

const authorization = async function (req, res, next) {
    try {
        let token = req.headers["x-api-key"];
        let decodedtoken = jwt.verify(token, "secuiretyKeyToCheckToken")

        let userId = req.params.userId
        if ( userId ) {
            let bossId = await bossModel.find({ _id: userId }).select({ bossId: 1, _id: 0 })
            bossId = bossId.map(x => x.bossId)

            if (decodedtoken.bossId != bossId) return res.status(403).send({ status: false, msg: "You haven't right to perform this task" })
        }
        else {
            let bossId = req.query.bossId
            if ( !bossId )  return res.status(400).send({error : "Please, enter bossId"})
            if (decodedtoken.bossId != bossId) return res.status(403).send({ status: false, msg: "You haven't right to perform this task" })
        }
        next()
    }
    catch (error) {
        console.log(error)
        res.status(500).send({ msg: error.message })
    }
}
module.exports.authentication = authentication;
module.exports.authorization=authorization;