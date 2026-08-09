import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useData } from '../context/DataContext'

export function UserManagementPage({ addToast }) {
  const { user: currentUser } = useAuth()
  const { users, addUser, toggleUserStatus } = useData()

  const [search, setSearch] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [newUser, setNewUser] = useState({
    name: '', email: '', role: 'inventory_planner', roleName: 'Inventory Planner', scope: 'All Clinics'
  })

  const isAdmin = currentUser?.role === 'administrator'

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.roleName.toLowerCase().includes(search.toLowerCase())
  )

  const handleUserSubmit = async (e) => {
    e.preventDefault()
    if (!newUser.email || !newUser.name) return
    try { await addUser(newUser); addToast('User Account Created', `Issued account for ${newUser.name}`, 'success'); setShowAddModal(false) }
    catch (error) { addToast('Unable to create account', error.response?.data?.error?.message || 'Please try again.', 'error') }
  }

  return (
    <div>
      <div className="filter-bar" style={{ justifyContent: 'space-between' }}>
        <input 
          type="text" 
          className="form-input" 
          placeholder="Search user name, email, or assigned role..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ width: '280px' }}
        />

        {isAdmin ? (
          <button className="btn-primary" onClick={() => setShowAddModal(true)}>
            + Create User Account
          </button>
        ) : (
          <span style={{ fontSize: '11px', color: '#94a3b8' }}>Admin rights required to modify user access</span>
        )}
      </div>

      <div className="panel" style={{ marginBottom: '20px' }}>
        <div className="panel-head">
          <div>
            <h2>User & Role Access Management (RBAC)</h2>
            <p>Managing Procurement Managers, Inventory Planners, Warehouse Users, Suppliers, Finance Reviewers, Admins</p>
          </div>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>USER ID</th>
                <th>FULL NAME & EMAIL</th>
                <th>ASSIGNED ROLE</th>
                <th>ORGANISATIONAL SCOPE</th>
                <th>LAST LOGIN</th>
                <th>ACCOUNT STATUS</th>
                <th>ADMIN ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(u => (
                <tr key={u.id}>
                  <td><strong>{u.id}</strong></td>
                  <td>
                    <strong>{u.name}</strong>
                    <small>{u.email}</small>
                  </td>
                  <td><span className="type reorder">{u.roleName}</span></td>
                  <td>{u.scope}</td>
                  <td><small>{u.lastLogin}</small></td>
                  <td>
                    <span className={`priority ${u.status === 'Active' ? 'medium' : 'high'}`} style={{ background: u.status === 'Active' ? '#dcfce7' : '#fee2e2', color: u.status === 'Active' ? '#15803d' : '#b91c1c' }}>
                      {u.status}
                    </span>
                  </td>
                  <td>
                    {isAdmin ? (
                      <button className="btn-outline" style={{ padding: '3px 8px', fontSize: '10px' }} onClick={async () => { try { await toggleUserStatus(u.id); addToast('User status updated', `${u.name}'s access was updated.`, 'success') } catch (error) { addToast('Unable to update user', error.response?.data?.error?.message || 'Please try again.', 'error') } }}>
                        {u.status === 'Active' ? 'Deactivate' : 'Activate'}
                      </button>
                    ) : (
                      <span style={{ fontSize: '10px', color: '#94a3b8' }}>View Only</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Create User Account</h3>
              <button className="close-btn" onClick={() => setShowAddModal(false)}>✕</button>
            </div>
            <form onSubmit={handleUserSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Full Name</label>
                  <input type="text" className="form-input" required value={newUser.name} onChange={e => setNewUser({ ...newUser, name: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Work Email</label>
                  <input type="email" className="form-input" required value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Role</label>
                  <select 
                    className="form-select" 
                    value={newUser.role} 
                    onChange={e => {
                      const roleNameMap = {
                        procurement_manager: 'Procurement Manager',
                        inventory_planner: 'Inventory Planner',
                        warehouse_user: 'Warehouse User',
                        supplier: 'Supplier Partner',
                        finance_reviewer: 'Finance Reviewer',
                        administrator: 'System Administrator'
                      }
                      setNewUser({ ...newUser, role: e.target.value, roleName: roleNameMap[e.target.value] })
                    }}
                  >
                    <option value="inventory_planner">Inventory Planner</option>
                    <option value="procurement_manager">Procurement Manager</option>
                    <option value="warehouse_user">Warehouse User</option>
                    <option value="supplier">Supplier Partner</option>
                    <option value="finance_reviewer">Finance Reviewer</option>
                    <option value="administrator">System Administrator</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-outline" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Create Account</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
