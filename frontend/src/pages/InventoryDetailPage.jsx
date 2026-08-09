import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useData } from '../context/DataContext'

export function InventoryDetailPage({ addToast }) {
  const { user } = useAuth()
  const { items, addItem, updateItem } = useData()

  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [sortField, setSortField] = useState('name')
  const [sortDir, setSortDir] = useState('asc')
  const [selectedItem, setSelectedItem] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)

  // New Item Form State
  const [newItem, setNewItem] = useState({
    name: '', category: 'Consumables', location: 'Koregaon Park', stock: 50, safetyStock: 20, leadTime: 5, unitCost: 500, lot: 'LOT-N2026-01', age: 1, expiry: '2028-12-31', reserved: 0, openOrders: 0, forecast: 40
  })

  const canEdit = ['administrator', 'inventory_planner', 'warehouse_user'].includes(user?.role)

  // Search & Filter
  const filtered = items.filter(i => 
    (categoryFilter === 'All' || i.category === categoryFilter) &&
    (i.name.toLowerCase().includes(search.toLowerCase()) || i.id.toLowerCase().includes(search.toLowerCase()) || i.lot.toLowerCase().includes(search.toLowerCase()))
  )

  // Sort
  const sorted = [...filtered].sort((a, b) => {
    let valA = a[sortField]
    let valB = b[sortField]
    if (typeof valA === 'string') valA = valA.toLowerCase()
    if (typeof valB === 'string') valB = valB.toLowerCase()
    if (valA < valB) return sortDir === 'asc' ? -1 : 1
    if (valA > valB) return sortDir === 'asc' ? 1 : -1
    return 0
  })

  const handleCreateSubmit = async (e) => {
    e.preventDefault()
    if (!newItem.name) return
    try {
      await addItem(newItem)
      addToast('Item Created', `Added ${newItem.name} to inventory`, 'success')
      setShowAddModal(false)
    } catch (error) {
      addToast('Unable to add item', error.response?.data?.error?.message || 'Check that the backend is running and try again.', 'error')
    }
  }

  return (
    <div>
      <div className="filter-bar" style={{ justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <input 
            type="text" 
            className="form-input" 
            placeholder="Search SKU, item name, lot #..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: '260px' }}
          />

          <select className="form-select" value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
            <option value="All">All Categories (5)</option>
            <option>Tapes</option>
            <option>Braces</option>
            <option>Consumables</option>
            <option>Therapy Accessories</option>
            <option>Hygiene Supplies</option>
          </select>
        </div>

        {canEdit && (
          <button className="btn-primary" onClick={() => setShowAddModal(true)}>
            + Add New SKU / Lot
          </button>
        )}
      </div>

      <div className="panel">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th onClick={() => { setSortField('id'); setSortDir(sortDir === 'asc' ? 'desc' : 'asc'); }} style={{ cursor: 'pointer' }}>
                  SKU ID {sortField === 'id' && (sortDir === 'asc' ? '▲' : '▼')}
                </th>
                <th onClick={() => { setSortField('name'); setSortDir(sortDir === 'asc' ? 'desc' : 'asc'); }} style={{ cursor: 'pointer' }}>
                  ITEM NAME / LOT {sortField === 'name' && (sortDir === 'asc' ? '▲' : '▼')}
                </th>
                <th>CATEGORY</th>
                <th>LOCATION</th>
                <th onClick={() => { setSortField('stock'); setSortDir(sortDir === 'asc' ? 'desc' : 'asc'); }} style={{ cursor: 'pointer' }}>
                  STOCK / SAFETY {sortField === 'stock' && (sortDir === 'asc' ? '▲' : '▼')}
                </th>
                <th>EXPIRY & AGE</th>
                <th>OPEN ORDERS</th>
                <th>FORECAST DEMAND</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map(i => (
                <tr key={i.id}>
                  <td><strong>{i.id}</strong></td>
                  <td>
                    <strong>{i.name}</strong>
                    <small>Lot: {i.lot} • Lead: {i.leadTime}d</small>
                  </td>
                  <td><span className="type reorder">{i.category}</span></td>
                  <td>{i.location}</td>
                  <td>
                    <strong>{i.stock} units</strong>
                    <small style={{ color: i.stock <= i.safetyStock ? '#ef4444' : '#64748b' }}>
                      Safety: {i.safetyStock} | Res: {i.reserved}
                    </small>
                  </td>
                  <td>
                    <strong>{i.expiry}</strong>
                    <small>{i.age} days in stock</small>
                  </td>
                  <td>{i.openOrders} units</td>
                  <td><strong>{i.forecast} units/mo</strong></td>
                  <td>
                    <button className="btn-outline" style={{ padding: '4px 8px', fontSize: '10px' }} onClick={() => setSelectedItem(i)}>
                      Inspect Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Item Detail Modal */}
      {selectedItem && (
        <div className="modal-overlay" onClick={() => setSelectedItem(null)}>
          <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '650px' }}>
            <div className="modal-header">
              <h3>📦 SKU & Lot Detail View — {selectedItem.id}</h3>
              <button className="close-btn" onClick={() => setSelectedItem(null)}>✕</button>
            </div>
            <div className="modal-body">
              <h4 style={{ margin: '0 0 10px', fontSize: '16px' }}>{selectedItem.name}</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', background: '#f8fafc', padding: '14px', borderRadius: '8px', fontSize: '12px' }}>
                <div><strong>Category:</strong> {selectedItem.category}</div>
                <div><strong>Location:</strong> {selectedItem.location}</div>
                <div><strong>Unit Cost:</strong> ₹{selectedItem.unitCost}</div>
                <div><strong>Current Stock:</strong> {selectedItem.stock}</div>
                <div><strong>Safety Stock:</strong> {selectedItem.safetyStock}</div>
                <div><strong>Reserved Qty:</strong> {selectedItem.reserved}</div>
                <div><strong>Lot/Batch #:</strong> {selectedItem.lot}</div>
                <div><strong>Age:</strong> {selectedItem.age} days</div>
                <div><strong>Expiry Date:</strong> {selectedItem.expiry}</div>
                <div><strong>Lead Time:</strong> {selectedItem.leadTime} days</div>
                <div><strong>Open Orders:</strong> {selectedItem.openOrders}</div>
                <div><strong>Forecast Demand:</strong> {selectedItem.forecast}</div>
              </div>

              <div style={{ marginTop: '16px' }}>
                <h5 style={{ margin: '0 0 8px', fontSize: '13px' }}>Linked Records & Activity History Log</h5>
                <ul style={{ fontSize: '11px', color: '#475569', paddingLeft: '18px', lineHeight: '1.7' }}>
                  <li>PO-8812 (PhysioEquipment Corp) — Linked Purchase Order for 50 units (Pending Delivery)</li>
                  <li>TRF-402 (Whitefield → Koregaon Park) — Transferred 10 units on 2026-07-28</li>
                  <li>Audit Log: Stock updated by {user?.name} on 2026-08-04</li>
                </ul>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-outline" onClick={() => setSelectedItem(null)}>Close</button>
              {canEdit && (
                <button className="btn-primary" onClick={async () => { try { await updateItem(selectedItem.id, { stock: selectedItem.stock + 10 }); addToast('Stock Updated', 'Added +10 stock', 'success'); setSelectedItem(null) } catch (error) { addToast('Unable to update stock', error.response?.data?.error?.message || 'Please try again.', 'error') } }}>
                  + Adjust Stock (+10)
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Item Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Create New Inventory Item / Lot</h3>
              <button className="close-btn" onClick={() => setShowAddModal(false)}>✕</button>
            </div>
            <form onSubmit={handleCreateSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Item Name</label>
                  <input type="text" className="form-input" required value={newItem.name} onChange={e => setNewItem({ ...newItem, name: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <select className="form-select" value={newItem.category} onChange={e => setNewItem({ ...newItem, category: e.target.value })}>
                    <option>Tapes</option>
                    <option>Braces</option>
                    <option>Consumables</option>
                    <option>Therapy Accessories</option>
                    <option>Hygiene Supplies</option>
                  </select>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div className="form-group">
                    <label>Stock Qty</label>
                    <input type="number" className="form-input" value={newItem.stock} onChange={e => setNewItem({ ...newItem, stock: Number(e.target.value) })} />
                  </div>
                  <div className="form-group">
                    <label>Safety Stock</label>
                    <input type="number" className="form-input" value={newItem.safetyStock} onChange={e => setNewItem({ ...newItem, safetyStock: Number(e.target.value) })} />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-outline" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Save SKU Record</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
