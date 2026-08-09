const mongoose=require('mongoose')
module.exports=mongoose.model('SystemSetting',new mongoose.Schema({key:{type:String,unique:true},value:mongoose.Schema.Types.Mixed,updatedBy:{type:mongoose.Schema.Types.ObjectId,ref:'User'}},{timestamps:true}))
