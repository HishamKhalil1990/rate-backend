// import module
require('dotenv').config()
const jwt = require("jsonwebtoken");

// import env variables
const TOKEN_SECRET_KEY = process.env.TOKEN_SECRET_KEY

// create token with expiration date
const createToken = (username) => {
  return jwt.sign({ username: username }, TOKEN_SECRET_KEY, {
    expiresIn: "24h",
  });
};

// cerate access tokens
const create = (username) => {
    auth = {
        token : createToken(username),
        expiresIn : '24 hour'
    }
    return auth
}
// create verify authentication
const authentication = (req,res,next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if(!token){
        res.sendStatus(401)
    }else{
        jwt.verify(token, TOKEN_SECRET_KEY, (err, user) => {
            if (err) return res.sendStatus(403);
            req.user = user;
            next();   
        }); 
    }
}

module.exports = {
    create,
    authentication,
}