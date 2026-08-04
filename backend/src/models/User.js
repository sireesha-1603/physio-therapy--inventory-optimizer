const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const schema = new mongoose.Schema({
  name:{type:String,required:true,trim:true}, email:{type:String,required:true,unique:true,lowercase:true,trim:true},
  password:{type:String,required:true,select:false}, role:{type:String,enum:['administrator','procurement_manager','inventory_planner','warehouse_user','supplier','finance_reviewer'],default:'inventory_planner'},
  active:{type:Boolean,default:true}, deletedAt:Date
},{timestamps:true})
schema.pre('save', async function(){ if(this.isModified('password')) this.password=await bcrypt.hash(this.password,12) })
schema.methods.comparePassword=function(password){return bcrypt.compare(password,this.password)}
module.exports=mongoose.model('User',schema)
