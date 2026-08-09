const mongoose = require('mongoose')
module.exports = mongoose.model('AuditLog', new mongoose.Schema({ actor:{type:mongoose.Schema.Types.ObjectId,ref:'User'}, action:{type:String,required:true,index:true}, entityType:String, entityId:String, before:mongoose.Schema.Types.Mixed, after:mongoose.Schema.Types.Mixed, reason:String, ipAddress:String }, {timestamps:true}))
