const mongoose = require('mongoose')
module.exports = mongoose.model('Warehouse', new mongoose.Schema({ name:{type:String,required:true,unique:true}, code:{type:String,required:true,unique:true,uppercase:true}, address:String, manager:{type:mongoose.Schema.Types.ObjectId,ref:'User'}, active:{type:Boolean,default:true}, deletedAt:Date }, {timestamps:true}))
