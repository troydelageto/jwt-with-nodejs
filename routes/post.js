const router = require('express').Router()
const verify=require('../privateToken/privateToken')
router.get('/',verify,(req,res)=>{
    // res.json({
    //     posts:{
    //         title:"my first post",
    //         desription:"random data not for you!"
    //     }
    // }) 

    res.send(req.user)
    User.findbyOne({_id:req.user})
})

module.exports = router