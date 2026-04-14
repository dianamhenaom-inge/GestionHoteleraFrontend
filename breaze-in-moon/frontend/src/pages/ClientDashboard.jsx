import { useState, useEffect } from 'react'
import { getAvailableRooms, createBooking, getMyBookings, cancelBooking } from '../api'

export default function ClientDashboard() {
  const [tab, setTab] = useState('rooms')
  const [rooms, setRooms] = useState([])
  const [bookings, setBookings] = useState([])
  const [modal, setModal] = useState(null)   // room selected for booking
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')

  useEffect(() => { loadRooms() }, [])
  useEffect(() => { if (tab === 'bookings') loadBookings() }, [tab])

  async function loadRooms() {
    try { setRooms((await getAvailableRooms()).data || []) } catch {}
  }
  async function loadBookings() {
    try { setBookings((await getMyBookings()).data || []) } catch {}
  }

  async function handleBook() {
    setError(''); setMsg('')
    try {
      await createBooking({ roomId: modal.id })
      setMsg('¡Reserva creada!')
      setModal(null)
      loadRooms()
      loadBookings()
    } catch (err) { setError(err.message) }
  }

  async function handleCancel(id) {
    if (!confirm('¿Cancelar esta reserva?')) return
    try {
      await cancelBooking(id)
      loadBookings()
      loadRooms()
    } catch (err) { alert(err.message) }
  }

  return (
    <>
      <div className="tabs">
        <button className={`tab ${tab === 'rooms' ? 'active' : ''}`} onClick={() => setTab('rooms')}>Habitaciones disponibles</button>
        <button className={`tab ${tab === 'bookings' ? 'active' : ''}`} onClick={() => setTab('bookings')}>Mis reservas</button>
      </div>

      <div className="page">
        {msg && <p className="success">{msg}</p>}

        {tab === 'rooms' && (
          <>
            <div className="section-header">
              <h2>Habitaciones disponibles</h2>
              <button className="btn btn-primary btn-sm" onClick={loadRooms}>Actualizar</button>
            </div>
            {rooms.length === 0
              ? <p className="empty">No hay habitaciones disponibles en este momento.</p>
              : <div className="cards">
                  {rooms.map(r => (
                    <div className="card" key={r.id}>
                      <span className="badge AVAILABLE">DISPONIBLE</span>
                      <h3>Habitación {r.number}</h3>
                      <p><strong>Tipo:</strong> {r.type}</p>
                      <p><strong>Capacidad:</strong> {r.capacity} personas</p>
                      <p><strong>Precio:</strong> ${r.price} / noche</p>
                      {r.description && <p>{r.description}</p>}
                      <div className="btn-group">
                        <button className="btn btn-primary btn-sm"
                          onClick={() => { setModal(r); setError('') }}>
                          Reservar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
            }
          </>
        )}

        {tab === 'bookings' && (
          <>
            <div className="section-header">
              <h2>Mis reservas</h2>
              <button className="btn btn-primary btn-sm" onClick={loadBookings}>Actualizar</button>
            </div>
            {bookings.length === 0
              ? <p className="empty">No tienes reservas aún.</p>
              : <div className="cards">
                  {bookings.map(b => (
                    <div className="card" key={b.id}>
                      <span className={`badge ${b.status}`}>{b.status}</span>
                      <h3>Reserva #{b.id}</h3>
                      <p><strong>Habitación:</strong> {b.roomId}</p>
                      <p><strong>Desde:</strong> {b.startDate}</p>
                      <p><strong>Hasta:</strong> {b.endDate}</p>
                      {b.status === 'ACTIVE' &&
                        <div className="btn-group">
                          <button className="btn btn-danger btn-sm" onClick={() => handleCancel(b.id)}>
                            Cancelar
                          </button>
                        </div>
                      }
                    </div>
                  ))}
                </div>
            }
          </>
        )}
      </div>

      {modal && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>Reservar habitación {modal.number}</h3>
            <p><strong>Tipo:</strong> {modal.type}</p>
            <p><strong>Capacidad:</strong> {modal.capacity} personas</p>
            <p><strong>Precio:</strong> ${modal.price} / noche</p>
            {error && <p className="error">{error}</p>}
            <div className="btn-group">
              <button className="btn" onClick={() => setModal(null)}
                style={{ background: '#f3f4f6' }}>Cancelar</button>
              <button className="btn btn-primary" onClick={handleBook}>Confirmar reserva</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
