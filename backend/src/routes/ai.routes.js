const router = require('express').Router()
const { z } = require('zod')
const { protect, allow } = require('../middleware/auth')
const { createRecommendation } = require('../services/aiRecommendation.service')
const Recommendation = require('../models/AIRecommendation')
const Item = require('../models/InventoryItem')
const AuditLog = require('../models/AuditLog')
router.use(protect)
router.get('/recommendations', async (_req,res,next)=>{try{res.json({success:true,data:await Recommendation.find().sort('-createdAt').limit(100).lean()})}catch(error){next(error)}})
router.post('/recommendations', allow('administrator', 'inventory_planner', 'procurement_manager'), async (req, res, next) => {
  try { const input = z.object({ type: z.enum(['reorder', 'transfer', 'safety_stock', 'expiry_risk', 'stockout_risk']), item: z.string().min(2), signals: z.record(z.string(), z.unknown()) }).parse(req.body); const generated=await createRecommendation(input); const record=await Recommendation.create({...generated,itemName:input.item,signals:input.signals}); res.status(201).json({ success: true, data: record }) } catch (error) { next(error) }
})
router.post('/recommendations/generate', allow('administrator','inventory_planner','procurement_manager'), async(_req,res,next)=>{try{const items=await Item.find({deletedAt:null,$expr:{$lte:['$currentStock','$reorderPoint']}}).lean();const records=[];for(const item of items){const signals={warehouse:item.warehouse,currentStock:item.currentStock,reorderPoint:item.reorderPoint,safetyStock:item.safetyStock,suggestedQty:Math.max(item.reorderPoint*2-item.currentStock,item.safetyStock),window:'7 days'};const generated=await createRecommendation({type:'reorder',item:item.name,signals});records.push(await Recommendation.create({...generated,item:item._id,itemName:item.name,signals}))}res.status(201).json({success:true,data:records})}catch(error){next(error)}})
router.patch('/recommendations/:id/decision', allow('administrator','inventory_planner','procurement_manager'), async(req,res,next)=>{try{const body=z.object({status:z.enum(['approved','rejected','overridden','deferred']),reason:z.string().min(3)}).parse(req.body);const previous=await Recommendation.findById(req.params.id).lean();const record=await Recommendation.findByIdAndUpdate(req.params.id,{status:body.status,decisionReason:body.reason,decidedBy:req.user.id,decidedAt:new Date()},{new:true});if(!record)return res.status(404).json({success:false,error:{message:'Recommendation not found'}});await AuditLog.create({actor:req.user.id,action:`RECOMMENDATION_${body.status.toUpperCase()}`,entityType:'AIRecommendation',entityId:record.id,before:previous,after:record.toObject(),reason:body.reason});res.json({success:true,data:record})}catch(error){next(error)}})
module.exports = router
