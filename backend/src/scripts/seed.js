require('dotenv').config()
const { connectDatabase } = require('../config/database')
const User = require('../models/User')
const InventoryItem = require('../models/InventoryItem')

async function seed() {
  await connectDatabase()
  const email = 'admin@physioflow.local'
  if (!await User.exists({ email })) {
    await User.create({ name: 'System Administrator', email, password: 'ChangeMe!2026', role: 'administrator' })
  }
  const items = [
    { sku: 'PHY-GEL-005', name: 'Therapeutic Ultrasound Gel 5L', category: 'Therapy consumables', currentStock: 18, reorderPoint: 24, safetyStock: 12, unitCost: 860, warehouse: 'Koregaon Park', status: 'critical' },
    { sku: 'PHY-RB-MED', name: 'Resistance Band – Medium', category: 'Rehabilitation', currentStock: 86, reorderPoint: 30, safetyStock: 20, unitCost: 280, warehouse: 'Bandra', status: 'healthy' },
    { sku: 'PHY-COLD-001', name: 'Cold Pack, Reusable', category: 'Therapy equipment', currentStock: 11, reorderPoint: 18, safetyStock: 10, unitCost: 410, warehouse: 'Whitefield', status: 'low' }
  ]
  for (const item of items) await InventoryItem.updateOne({ sku: item.sku }, { $setOnInsert: item }, { upsert: true })
  console.log(`Seed complete. Administrator: ${email} / ChangeMe!2026`)
  process.exit(0)
}
seed().catch(error => { console.error(error); process.exit(1) })
