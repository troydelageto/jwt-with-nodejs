const jwt =require('jsonwebtoken')

function auth(req,res,next){

    const token =req.header('auth-token')
    if(!token) return res.status(400).send({"message":"Access denied"})

    try{
        const verified= jwt.verify(token,process.env.TOKEN_SECRET)
          req.user=verified
          next();
    }catch(err){
        res.status(400).send({"messsage":"Invalid token"})
    }
} 

module.exports=auth;
