const router=require('express').Router();const {protect}=require('../middleware/auth');router.use(protect)
router.get('/dashboard',(_req,res)=>res.json({success:true,data:{inventoryValue:2480000,itemsInStock:1248,stockoutRisks:12,pendingApprovals:8,forecastAccuracy:92.4}}))
module.exports=router
