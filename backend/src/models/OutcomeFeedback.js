const mongoose=require('mongoose')
module.exports=mongoose.model('OutcomeFeedback',new mongoose.Schema({message:{type:String,required:true},category:String,submittedBy:{type:mongoose.Schema.Types.ObjectId,ref:'User'}},{timestamps:true}))
