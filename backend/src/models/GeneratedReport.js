const mongoose=require('mongoose')
module.exports=mongoose.model('GeneratedReport',new mongoose.Schema({name:String,format:{type:String,enum:['csv','pdf']},range:String,status:{type:String,default:'completed'},generatedBy:{type:mongoose.Schema.Types.ObjectId,ref:'User'},content:String},{timestamps:true}))
