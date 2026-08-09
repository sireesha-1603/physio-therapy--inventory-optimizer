require('dotenv').config()
const { connectDatabase } = require('../config/database')
const User = require('../models/User')
const InventoryItem = require('../models/InventoryItem')
const Supplier = require('../models/Supplier')
const Notification = require('../models/Notification')
const AuditLog = require('../models/AuditLog')

async function seed() {
  await connectDatabase()
  const email = 'admin@physioflow.local'
  let admin = await User.findOne({ email })
  if (!admin) admin = await User.create({ name: 'System Administrator', email, password: 'ChangeMe!2026', role: 'administrator', scope:'Global Admin' })
  const items = [
    { sku: 'PHY-GEL-005', name: 'Therapeutic Ultrasound Gel 5L', category: 'Therapy consumables', currentStock: 18, reorderPoint: 24, safetyStock: 12, unitCost: 860, warehouse: 'Koregaon Park', status: 'critical' },
    { sku: 'PHY-RB-MED', name: 'Resistance Band – Medium', category: 'Rehabilitation', currentStock: 86, reorderPoint: 30, safetyStock: 20, unitCost: 280, warehouse: 'Bandra', status: 'healthy' },
    { sku: 'PHY-COLD-001', name: 'Cold Pack, Reusable', category: 'Therapy equipment', currentStock: 11, reorderPoint: 18, safetyStock: 10, unitCost: 410, warehouse: 'Whitefield', status: 'low' }
  ]
  for (const item of items) await InventoryItem.updateOne({ sku: item.sku }, { $setOnInsert: item }, { upsert: true })
  const suppliers = [
    { code:'SUP-MEDTECH', name:'MedTech Supplies', category:'Therapy consumables', onTimeRate:92.5, qualityScore:96.8, costIndex:'Standard', status:'Active' },
    { code:'SUP-PHYSIO', name:'PhysioEquipment Corp', category:'Therapy equipment', onTimeRate:98.2, qualityScore:99.1, costIndex:'Optimal', status:'Preferred' },
    { code:'SUP-CLEAN', name:'CleanHygiene Corp', category:'Hygiene supplies', onTimeRate:99, qualityScore:98.5, costIndex:'Low Cost', status:'Preferred' }
  ]
  for (const supplier of suppliers) await Supplier.updateOne({ code:supplier.code }, { $setOnInsert:supplier }, { upsert:true })
  if (!await Notification.exists({ title:'Inventory setup complete' })) await Notification.create({ recipient:admin.id, title:'Inventory setup complete', message:'Seed data is ready for AI recommendation generation.', category:'AI Results', severity:'info', link:'/recommendations' })
  if (!await AuditLog.exists({ action:'INITIAL_SEED' })) await AuditLog.create({ actor:admin.id, action:'INITIAL_SEED', entityType:'System', entityId:'seed', reason:'Initial persistent data created' })
  console.log(`Seed complete. Administrator: ${email} / ChangeMe!2026`)
  process.exit(0)
}
seed().catch(error => { console.error(error); process.exit(1) })
