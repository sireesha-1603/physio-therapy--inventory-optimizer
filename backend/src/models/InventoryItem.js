const mongoose = require('mongoose')
const schema = new mongoose.Schema({
  sku:{type:String,required:true,unique:true,index:true}, name:{type:String,required:true,index:true}, category:String, unit:{type:String,default:'each'},
  currentStock:{type:Number,default:0,min:0}, reorderPoint:{type:Number,default:0,min:0}, safetyStock:{type:Number,default:0,min:0}, unitCost:{type:Number,default:0,min:0},
  warehouse:String, status:{type:String,enum:['healthy','low','critical'],default:'healthy'}, deletedAt:Date
},{timestamps:true})
module.exports=mongoose.model('InventoryItem',schema)
