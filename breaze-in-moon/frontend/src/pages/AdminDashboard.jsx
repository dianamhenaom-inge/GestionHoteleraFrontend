import { useState, useEffect } from 'react'
import { getAllRooms, createRoom, updateRoom, updateRoomStatus, getAllBookings } from '../api'

const STATUSES = ['AVAILABLE', 'OCCUPIED', 'MAINTENANCE']
const STATUS_ES = { AVAILABLE: 'Disponible', OCCUPIED: 'Ocupada', MAINTENANCE: 'Mantenimiento' }

const emptyRoom = { number: '', type: 'SINGLE', description: '', capacity: 1, price: '' }

export default function AdminDashboard() {
  const [tab, setTab] = useState('rooms')

  // Rooms state
  const [rooms, setRooms] = useState([])
  const [filterStatus, setFilterStatus] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editRoom, setEditRoom] = useState(null)
  const [roomForm, setRoomForm] = useState(emptyRoom)
  const [roomError, setRoomError] = useState('')

  // Bookings state
  const [bookings, setBookings] = useState([])

  useEffect(() => { loadRooms() }, [filterStatus])
  useEffect(() => { if (tab === 'bookings') loadBookings() }, [tab])

  async function loadRooms() {
    try { setRooms((await getAllRooms(filterStatus)).data || []) } catch {}
  }
  async function loadBookings() {
    try { setBookings((await getAllBookings()).data || []) } catch {}
  }

  function openCreate() {
    setEditRoom(null); setRoomForm(emptyRoom); setRoomError(''); setShowForm(true)
  }
  function openEdit(r) {
    setEditRoom(r)
    setRoomForm({ number: r.number, type: r.type, description: r.description || '', capacity: r.capacity, price: r.price })
    setRoomError(''); setShowForm(true)
  }

  async function handleRoomSubmit(e) {
    e.preventDefault(); setRoomError('')
    try {
      if (editRoom) await updateRoom(editRoom.id, roomForm)
      else await createRoom(roomForm)
      setShowForm(false); loadRooms()
    } catch (err) { setRoomError(err.message) }
  }

  async function handleStatusChange(id, status) {
    try { await updateRoomStatus(id, status); loadRooms() }
    catch (err) { alert(err.message) }
  }

  return (
    <>
      <div className="tabs">
        <button className={`tab ${tab === 'rooms' ? 'active' : ''}`} onClick={() => setTab('rooms')}>Habitaciones</button>
        <button className={`tab ${tab === 'bookings' ? 'active' : ''}`} onClick={() => setTab('bookings')}>Reservas</button>
      </div>

      <div className="page">

        {/* ── ROOMS ── */}
        {tab === 'rooms' && (
          <>
            <div className="section-header">
              <h2>Habitaciones</h2>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
                  style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #ddd', fontSize: '0.875rem' }}>
                  <option value="">Todos los estados</option>
                  {STATUSES.map(s => <option key={s} value={s}>{STATUS_ES[s]}</option>)}
                </select>
                <button className="btn btn-primary btn-sm" onClick={openCreate}>+ Nueva habitación</button>
              </div>
            </div>

            {rooms.length === 0
              ? <p className="empty">No hay habitaciones registradas.</p>
              : <div className="cards">
                  {rooms.map(r => (
                    <div className="card" key={r.id}>
                      <span className={`badge ${r.status}`}>{STATUS_ES[r.status] || r.status}</span>
                      <h3>Habitación {r.number}</h3>
                      <p><strong>Tipo:</strong> {r.type}</p>
                      <p><strong>Capacidad:</strong> {r.capacity}</p>
                      <p><strong>Precio:</strong> ${r.price} / noche</p>
                      {r.description && <p style={{ color: '#888', fontSize: '0.8rem' }}>{r.description}</p>}
                      <div className="btn-group">
                        <button className="btn btn-warning btn-sm" onClick={() => openEdit(r)}>Editar</button>
                        {STATUSES.filter(s => s !== r.status).map(s => (
                          <button key={s} className="btn btn-sm"
                            style={{ background: '#e0e7ff', color: '#3730a3' }}
                            onClick={() => handleStatusChange(r.id, s)}>
                            → {STATUS_ES[s]}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
            }
          </>
        )}

        {/* ── BOOKINGS ── */}
        {tab === 'bookings' && (
          <>
            <div className="section-header">
              <h2>Todas las reservas</h2>
              <button className="btn btn-primary btn-sm" onClick={loadBookings}>Actualizar</button>
            </div>
            {bookings.length === 0
              ? <p className="empty">No hay reservas registradas.</p>
              : <table>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Cliente</th>
                      <th>Habitación</th>
                      <th>Entrada</th>
                      <th>Salida</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map(b => (
                      <tr key={b.id}>
                        <td>{b.id}</td>
                        <td>{b.userId}</td>
                        <td>{b.roomId}</td>
                        <td>{b.startDate}</td>
                        <td>{b.endDate}</td>
                        <td><span className={`badge ${b.status}`}>{b.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
            }
          </>
        )}
      </div>

      {/* ── MODAL FORM ROOM ── */}
      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>{editRoom ? 'Editar habitación' : 'Nueva habitación'}</h3>
            <form onSubmit={handleRoomSubmit}>
              <div className="form-group">
                <label>Número</label>
                <input value={roomForm.number}
                  onChange={e => setRoomForm({ ...roomForm, number: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Tipo</label>
                <select value={roomForm.type}
                  onChange={e => setRoomForm({ ...roomForm, type: e.target.value })}>
                  <option value="SINGLE">Sencilla</option>
                  <option value="DOUBLE">Doble</option>
                  <option value="SUITE">Suite</option>
                </select>
              </div>
              <div className="form-group">
                <label>Capacidad</label>
                <input type="number" min="1" value={roomForm.capacity}
                  onChange={e => setRoomForm({ ...roomForm, capacity: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Precio por noche</label>
                <input type="number" step="0.01" value={roomForm.price}
                  onChange={e => setRoomForm({ ...roomForm, price: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Descripción</label>
                <input value={roomForm.description}
                  onChange={e => setRoomForm({ ...roomForm, description: e.target.value })} />
              </div>
              {roomError && <p className="error">{roomError}</p>}
              <div className="btn-group">
                <button type="button" className="btn" onClick={() => setShowForm(false)}
                  style={{ background: '#f3f4f6' }}>Cancelar</button>
                <button type="submit" className="btn btn-primary">
                  {editRoom ? 'Guardar cambios' : 'Crear habitación'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
