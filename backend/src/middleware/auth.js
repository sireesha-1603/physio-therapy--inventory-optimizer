const jwt = require('jsonwebtoken')
exports.protect=(req,res,next)=>{try{const token=req.headers.authorization?.split(' ')[1];if(!token)return res.status(401).json({success:false,error:{message:'Authentication required'}});req.user=jwt.verify(token,process.env.JWT_SECRET);next()}catch{res.status(401).json({success:false,error:{message:'Invalid or expired token'}})}}
exports.allow=(...roles)=>(req,res,next)=>roles.includes(req.user.role)?next():res.status(403).json({success:false,error:{message:'Access denied'}})
