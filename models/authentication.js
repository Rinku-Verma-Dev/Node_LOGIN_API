// const {jwt} = require('./require');
const jwt = require('jsonwebtoken');
function authenticataToken(req, res, next){
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    if(token==null) return res.status(403);

    jwt.verify(token, process.env.TOKEN_SECRET, (err, user)=>{
        if(err) return res.send("error");

        req.user = user;
        next();
    })

}

module.exports  = authenticataToken;