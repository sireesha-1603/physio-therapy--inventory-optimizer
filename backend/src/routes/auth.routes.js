const router=require('express').Router(); const jwt=require('jsonwebtoken'); const {z}=require('zod'); const User=require('../models/User')
const token=user=>jwt.sign({id:user._id,role:user.role},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRES_IN||'8h'})
router.post('/login',async(req,res,next)=>{try{const body=z.object({email:z.string().email(),password:z.string().min(8)}).parse(req.body);const user=await User.findOne({email:body.email,active:true}).select('+password');if(!user||!(await user.comparePassword(body.password)))return res.status(401).json({success:false,error:{message:'Invalid email or password'}});res.json({success:true,data:{token:token(user),user:{id:user.id,name:user.name,email:user.email,role:user.role}}})}catch(e){next(e)}})
router.post('/forgot-password',(_req,res)=>res.json({success:true,data:{message:'If the account exists, reset instructions will be sent.'}}))
module.exports=router
