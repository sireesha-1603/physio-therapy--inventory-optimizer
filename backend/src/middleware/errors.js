exports.notFound=(req,res)=>res.status(404).json({success:false,error:{message:`Route ${req.method} ${req.originalUrl} not found`}})
exports.errorHandler=(err,_req,res,_next)=>{console.error(err);res.status(err.statusCode||500).json({success:false,error:{message:err.message||'Internal server error'}})}
