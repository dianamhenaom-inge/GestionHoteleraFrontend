import React, { useState, useEffect } from 'react';
import {
  CalendarCheck,
  BedDouble,
  Plus,
  Eye,
  Pencil,
  Code,
} from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import Table from '../components/ui/Table';
import api from '../services/api';
import type { Room, Book } from '../types';

type Tab = 'reservas' | 'habitaciones';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('reservas');
  const [rooms, setRooms] = useState<Room[]>([]);
  const [bookings, setBookings] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [isViewBookingOpen, setIsViewBookingOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Book | null>(null);
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [roomForm, setRoomForm] = useState<Partial<Room>>({
    type: '', description: '', capacity: 2, price: 0, status: 'AVAILABLE',
  });
  const [roomLoading, setRoomLoading] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [roomsResponse, bookingsResponse] = await Promise.all([
        api.get('/api/rooms'),
        api.get('/api/books'),
      ]);

      if (roomsResponse.data.success) {
        setRooms(roomsResponse.data.data || []);
      }

      if (bookingsResponse.data.success) {
        setBookings(bookingsResponse.data.data || []);
      }
    } catch (error: any) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenRoomModal = (room?: Room) => {
    if (room) {
      setEditingRoom(room);
      setRoomForm(room);
    } else {
      setEditingRoom(null);
      setRoomForm({ type: '', description: '', capacity: 2, price: 0, status: 'AVAILABLE' });
    }
    setIsRoomModalOpen(true);
    setError('');
  };

  const handleSaveRoom = async () => {
    if (!roomForm.type || !roomForm.description || !roomForm.price) {
      setError('Por favor completa todos los campos');
      return;
    }
    try {
      setRoomLoading(true);
      setError('');
      if (editingRoom) {
        const response = await api.put(`/api/rooms/${editingRoom.id}`, roomForm);
        if (response.data.success) { setIsRoomModalOpen(false); fetchData(); }
      } else {
        const response = await api.post('/api/rooms', roomForm);
        if (response.data.success) { setIsRoomModalOpen(false); fetchData(); }
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Error al guardar la habitación');
    } finally {
      setRoomLoading(false);
    }
  };

  const handleViewBooking = (booking: Book) => {
    setSelectedBooking(booking);
    setIsViewBookingOpen(true);
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm('¿Estás seguro de cancelar esta reserva?')) return;
    try {
      const response = await api.patch(`/api/books/${bookingId}`, { status: 'CANCELLED' });
      if (response.data.success) fetchData();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error al cancelar la reserva');
    }
  };

  const roomsColumns = [
    {
      key: 'id', label: 'ID',
      render: (value: string) => (
        <span className="font-monospace text-muted small">R-{value?.slice(-4)}</span>
      ),
    },
    { key: 'type', label: 'Tipo' },
    {
      key: 'description', label: 'Descripción',
      render: (value: string) => (
        <span
          className="small"
          style={{ overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', maxWidth: '18rem' }}
        >
          {value}
        </span>
      ),
    },
    { key: 'capacity', label: 'Capacidad', render: (value: number) => `${value} huéspedes` },
    { key: 'price', label: 'Precio/Noche', render: (value: number) => `$${value}` },
    {
      key: 'status', label: 'Estado',
      render: (value: string) => (
        <Badge variant={value.toLowerCase() as any}>
          {value === 'AVAILABLE' ? 'Disponible' : value === 'OCCUPIED' ? 'Ocupada' : 'Mantenimiento'}
        </Badge>
      ),
    },
    {
      key: 'actions', label: 'Acciones',
      render: (_: any, row: Room) => (
        <Button variant="secondary" size="sm" onClick={() => handleOpenRoomModal(row)} icon={<Pencil size={15} />}>
          Editar
        </Button>
      ),
    },
  ];

  const bookingsColumns = [
    {
      key: 'id', label: 'ID Reserva',
      render: (value: string) => (
        <span className="font-monospace text-muted small">#{value?.slice(-6)}</span>
      ),
    },
    { key: 'userName', label: 'Cliente' },
    {
      key: 'room', label: 'Habitación',
      render: (_: Room, row: Book) => rooms.find((r) => r.id === row.roomId)?.type || 'N/A',
    },
    {
      key: 'startDate', label: 'Check-In',
      render: (value: string) => new Date(value).toLocaleDateString('es-ES'),
    },
    {
      key: 'endDate', label: 'Check-Out',
      render: (value: string) => new Date(value).toLocaleDateString('es-ES'),
    },
    {
      key: 'status', label: 'Estado',
      render: (value: string) => (
        <Badge variant={value.toLowerCase() as any}>
          {value === 'CONFIRMED' ? 'Confirmada' : value === 'PENDING' ? 'Pendiente' : 'Cancelada'}
        </Badge>
      ),
    },
    {
      key: 'actions', label: 'Acciones',
      render: (_: any, row: Book) => (
        <div className="d-flex gap-2">
          <Button variant="tertiary" size="sm" icon={<Eye size={15} />} onClick={() => handleViewBooking(row)}>Ver</Button>
          <Button
            variant="tertiary"
            size="sm"
            onClick={() => handleCancelBooking(row.id!)}
            disabled={row.status === 'CANCELLED'}
          >
            Cancelar
          </Button>
        </div>
      ),
    },
  ];

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: 'reservas', label: 'Reservas', icon: CalendarCheck },
    { id: 'habitaciones', label: 'Habitaciones', icon: BedDouble },
  ];

  if (loading) {
    return (
      <DashboardLayout>
        <div className="d-flex justify-content-center align-items-center" style={{ height: '16rem' }}>
          <div className="text-center">
            <div className="hotel-spinner mx-auto mb-3" />
            <p className="text-muted small">Cargando...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Page header */}
      <div className="mb-4">
        <h1 className="fw-bold mb-1" style={{ fontFamily: 'Manrope, sans-serif' }}>
          Centro de Control
        </h1>
        <p className="text-muted">
          Gestiona el inventario de tu propiedad y los compromisos de los huéspedes a través de
          nuestra interfaz editorial lunar.
        </p>
      </div>

      {/* Tab navigation */}
      <ul className="nav hotel-tabs mb-4 flex-wrap gap-1">
        {tabs.map(({ id, label, icon: Icon }) => (
          <li key={id} className="nav-item">
            <button
              className={`nav-link d-flex align-items-center gap-2 ${activeTab === id ? 'active' : ''}`}
              onClick={() => setActiveTab(id)}
            >
              <Icon size={18} />
              <span>{label}</span>
            </button>
          </li>
        ))}
      </ul>

      {/* Reservas tab */}
      {activeTab === 'reservas' && (
        <>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="fw-bold mb-0 fs-4" style={{ fontFamily: 'Manrope, sans-serif' }}>
              Gestión de Reservas
            </h2>
            <span className="api-badge">
              <Code size={12} />
              GET /api/books
            </span>
          </div>
          <Card>
            <Table columns={bookingsColumns} data={bookings} emptyMessage="No hay reservas registradas" />
          </Card>
        </>
      )}

      {/* Habitaciones tab */}
      {activeTab === 'habitaciones' && (
        <>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="fw-bold mb-0 fs-4" style={{ fontFamily: 'Manrope, sans-serif' }}>
              Gestión de Habitaciones
            </h2>
            <div className="d-flex align-items-center gap-3">
              <span className="api-badge">
                <Code size={12} />
                GET /api/rooms
              </span>
              <Button variant="primary" onClick={() => handleOpenRoomModal()} icon={<Plus size={18} />}>
                Nueva Habitación
              </Button>
            </div>
          </div>
          <Card>
            <Table columns={roomsColumns} data={rooms} emptyMessage="No hay habitaciones registradas" />
          </Card>
        </>
      )}

      {/* Ver reserva modal */}
      <Modal
        isOpen={isViewBookingOpen}
        onClose={() => setIsViewBookingOpen(false)}
        title="Detalle de Reserva"
        footer={
          <Button variant="secondary" onClick={() => setIsViewBookingOpen(false)}>
            Cerrar
          </Button>
        }
      >
        {selectedBooking && (
          <div className="d-flex flex-column gap-3">
            <div className="row g-3">
              <div className="col-6">
                <p className="hotel-label mb-1">ID Reserva</p>
                <p className="font-monospace small mb-0">#{selectedBooking.id?.slice(-6)}</p>
              </div>
              <div className="col-6">
                <p className="hotel-label mb-1">Estado</p>
                <Badge variant={selectedBooking.status.toLowerCase() as any}>
                  {selectedBooking.status === 'CONFIRMED' ? 'Confirmada'
                    : selectedBooking.status === 'PENDING' ? 'Pendiente'
                    : 'Cancelada'}
                </Badge>
              </div>
              <div className="col-6">
                <p className="hotel-label mb-1">Cliente</p>
                <p className="small mb-0">{selectedBooking.userName || '—'}</p>
              </div>
              <div className="col-6">
                <p className="hotel-label mb-1">Habitación</p>
                <p className="small mb-0">
                  {rooms.find((r) => r.id === selectedBooking.roomId)?.type || '—'}
                </p>
              </div>
              <div className="col-6">
                <p className="hotel-label mb-1">Check-In</p>
                <p className="small mb-0">
                  {new Date(selectedBooking.startDate).toLocaleDateString('es-ES')}
                </p>
              </div>
              <div className="col-6">
                <p className="hotel-label mb-1">Check-Out</p>
                <p className="small mb-0">
                  {new Date(selectedBooking.endDate).toLocaleDateString('es-ES')}
                </p>
              </div>
              {selectedBooking.createdAt && (
                <div className="col-12">
                  <p className="hotel-label mb-1">Fecha de Creación</p>
                  <p className="small mb-0">
                    {new Date(selectedBooking.createdAt).toLocaleString('es-ES')}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Room modal */}
      <Modal
        isOpen={isRoomModalOpen}
        onClose={() => setIsRoomModalOpen(false)}
        title={editingRoom ? 'Editar Habitación' : 'Nueva Habitación'}
        footer={
          <>
            <Button variant="tertiary" onClick={() => setIsRoomModalOpen(false)}>Cancelar</Button>
            <Button variant="primary" onClick={handleSaveRoom} loading={roomLoading}>
              {editingRoom ? 'Actualizar' : 'Crear'}
            </Button>
          </>
        }
      >
        {error && (
          <div className="alert alert-danger py-2 small mb-3" role="alert">{error}</div>
        )}

        <div className="mb-3">
          <label className="hotel-label form-label">Tipo de Habitación</label>
          <select
            className="form-select"
            value={roomForm.type}
            onChange={(e) => setRoomForm((prev) => ({ ...prev, type: e.target.value }))}
            required
          >
            <option value="">Selecciona un tipo...</option>
            <option value="SUITE">SUITE</option>
            <option value="SENCILLA">SENCILLA</option>
            <option value="DOBLE">DOBLE</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="hotel-label form-label">Descripción</label>
          <textarea
            className="form-control"
            rows={3}
            placeholder="Descripción detallada de la habitación..."
            value={roomForm.description}
            onChange={(e) => setRoomForm((prev) => ({ ...prev, description: e.target.value }))}
            required
          />
        </div>

        <Input
          label="Capacidad (Huéspedes)"
          type="number"
          min="1"
          value={roomForm.capacity}
          onChange={(e) => setRoomForm((prev) => ({ ...prev, capacity: parseInt(e.target.value) }))}
          required
        />

        <Input
          label="Precio por Noche ($)"
          type="number"
          min="0"
          step="0.01"
          value={roomForm.price}
          onChange={(e) => setRoomForm((prev) => ({ ...prev, price: parseFloat(e.target.value) }))}
          required
        />

        <div className="mb-3">
          <label className="hotel-label form-label">Estado</label>
          <select
            className="form-select"
            value={roomForm.status}
            onChange={(e) =>
              setRoomForm((prev) => ({ ...prev, status: e.target.value as Room['status'] }))
            }
          >
            <option value="AVAILABLE">Disponible</option>
            <option value="OCCUPIED">Ocupada</option>
            <option value="MAINTENANCE">Mantenimiento</option>
          </select>
        </div>
      </Modal>
    </DashboardLayout>
  );
};

export default AdminDashboard;
