const router = require('express').Router()
const UserModel = require('../model/model')
const Joi=require('@hapi/joi')
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken')
const {registerValidation,loginValidation}= require('../validation')



router.get('/', (req, res) => {
    res.send("her is home route")
})

router.post('/register', async (req, res) => {
    
    // Validate user info before creating a user
    // with version 16
    // schema.validate(req.body)

    const {error} = registerValidation(req.body);

    // console.log(error);

    if (error){return res.status(400).send(error.details[0].message)}
    
// Checking if the user is already in the databsase

const emailExist=await UserModel.findOne({email:req.body.email})

console.log(emailExist);

if(emailExist){return res.status(400).send({"message":"Email already exist"})}

// the Password Hashing
const salt = await bcrypt.genSalt(10)  
const hashPassword=await bcrypt.hash(req.body.password,salt)
        

// create the new user
        const user = new UserModel({
        name: req.body.name,
        email: req.body.email,
        password: hashPassword
        });

        try{
            const savedUser=await user.save();
            // console.log(savedUser._id);
            res.send({user:user._id});
        }catch(err){
        console.log(err);
        res.status(400).send(err);
        };
       
 

})

router.post('/login',async (req,res)=>{
   
    // login Validation
    const {error} = loginValidation(req.body);
    if (error){return res.status(400).send(error.details[0].message)}

    // Checkin if the email exist
    const userLogin=await UserModel.findOne({email:req.body.email})
if(!userLogin)return res.status(400).send({"message":"email not found"})

// Checking if password is correct
const validPass= await bcrypt.compare(req.body.password,userLogin.password)
if(!validPass){return res.status(400).send({"message":"Invalid Password"})}

// create and assign a token
const token =await jwt.sign({ expiresIn: 60 * 60 },process.env.TOKEN_SECRET);
res.header('auth-token',token).send({"token":token})
console.log(token);

res.send({"message":"You are Logged"})

})

module.exports=router
