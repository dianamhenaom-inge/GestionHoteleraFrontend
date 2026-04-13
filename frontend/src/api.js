const BASE = '/api'

const token = () => localStorage.getItem('token')

const headers = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${token()}`
})

async function request(method, path, body) {
  const res = await fetch(BASE + path, {
    method,
    headers: body ? headers() : { Authorization: `Bearer ${token()}` },
    body: body ? JSON.stringify(body) : undefined
  })
  const json = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(json.message || 'Error en la solicitud')
  return json
}

// Auth
export const login    = (data) => fetch(BASE + '/auth/login',    { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(r => r.json())
export const register = (data) => fetch(BASE + '/auth/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(r => r.json())

// Rooms — CLIENT
export const getAvailableRooms = () => request('GET', '/rooms/available')

// Rooms — ADMIN
export const getAllRooms        = (status) => request('GET', '/rooms' + (status ? `?status=${status}` : ''))
export const getRoomById        = (id)     => request('GET', `/rooms/${id}`)
export const createRoom         = (data)   => request('POST', '/rooms', data)
export const updateRoom         = (id, data) => request('PUT', `/rooms/${id}`, data)
export const updateRoomStatus   = (id, status) => request('PATCH', `/rooms/${id}/status`, { status })

// Bookings — CLIENT
export const createBooking  = (data) => request('POST', '/books', data)
export const getMyBookings  = ()     => request('GET',  '/books/my')
export const cancelBooking  = (id)   => request('PATCH', `/books/${id}`, { status: 'CANCELLED' })

// Bookings — ADMIN
export const getAllBookings  = ()   => request('GET', '/books')
export const getBookingById = (id) => request('GET', `/books/${id}`)
