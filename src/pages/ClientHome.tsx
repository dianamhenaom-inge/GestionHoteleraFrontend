import React, { useState, useEffect } from 'react';
import { Plus, Users, Bed, DollarSign, Calendar, Code } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import Table from '../components/ui/Table';
import api from '../services/api';
import type { Room, Book } from '../types';

const ClientHome: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [bookings, setBookings] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [bookingForm, setBookingForm] = useState({ startDate: '', endDate: '' });
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [roomsResponse, bookingsResponse] = await Promise.all([
        api.get('/api/rooms/available'),
        api.get('/api/books/my'),
      ]);
      if (roomsResponse.data.success) setRooms(roomsResponse.data.data || []);
      if (bookingsResponse.data.success) setBookings(bookingsResponse.data.data || []);
    } catch (error: any) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (room: Room) => {
    setSelectedRoom(room);
    setIsModalOpen(true);
    setBookingForm({ startDate: '', endDate: '' });
    setError('');
  };

  const handleCreateBooking = async () => {
    if (!selectedRoom || !bookingForm.startDate || !bookingForm.endDate) {
      setError('Por favor completa todos los campos');
      return;
    }
    if (new Date(bookingForm.endDate) <= new Date(bookingForm.startDate)) {
      setError('La fecha de salida debe ser posterior a la fecha de entrada');
      return;
    }
    try {
      setBookingLoading(true);
      setError('');
      const response = await api.post('/api/books', {
        roomId: selectedRoom.id,
        startDate: bookingForm.startDate,
        endDate: bookingForm.endDate,
      });
      if (response.data.success) {
        setIsModalOpen(false);
        fetchData();
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Error al crear la reserva');
    } finally {
      setBookingLoading(false);
    }
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

  const bookingsColumns = [
    {
      key: 'id',
      label: 'ID Reserva',
      render: (value: string) => (
        <span className="font-monospace text-muted small">#{value?.slice(-6)}</span>
      ),
    },
    {
      key: 'room',
      label: 'Habitación',
      render: (value: Room) => value?.type || 'N/A',
    },
    {
      key: 'startDate',
      label: 'Check-In',
      render: (value: string) => new Date(value).toLocaleDateString('es-ES'),
    },
    {
      key: 'endDate',
      label: 'Check-Out',
      render: (value: string) => new Date(value).toLocaleDateString('es-ES'),
    },
    {
      key: 'status',
      label: 'Estado',
      render: (value: string) => (
        <Badge variant={value.toLowerCase() as any}>
          {value === 'CONFIRMED' ? 'Confirmada' : value === 'PENDING' ? 'Pendiente' : 'Cancelada'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      label: 'Acciones',
      render: (_: any, row: Book) => (
        <Button
          variant="tertiary"
          size="sm"
          onClick={() => handleCancelBooking(row.id!)}
          disabled={row.status === 'CANCELLED'}
        >
          Cancelar
        </Button>
      ),
    },
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
      {/* Welcome header */}
      <div className="mb-5">
        <h1 className="fw-bold mb-1" style={{ fontFamily: 'Manrope, sans-serif' }}>
          Bienvenido de nuevo, Juan.
        </h1>
        <p className="text-muted fst-italic fs-6">
          "Sumergiéndose en la serenidad de la Luna Forestal."
        </p>
      </div>

      {/* Available rooms */}
      <section className="mb-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold mb-0 fs-4" style={{ fontFamily: 'Manrope, sans-serif' }}>
            Habitaciones Disponibles
          </h2>
          <span className="api-badge">
            <Code size={12} />
            GET /api/rooms/available
          </span>
        </div>

        <div className="row g-4">
          {rooms.map((room) => (
            <div key={room.id} className="col-12 col-md-6 col-lg-4">
              <Card hover>
                <img
                  src={
                    room.imageUrl ||
                    'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=400&h=300&fit=crop&q=80'
                  }
                  alt={room.type}
                  className="room-card-img mb-3"
                />
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <h3
                    className="fw-semibold fs-6 mb-0"
                    style={{ fontFamily: 'Manrope, sans-serif' }}
                  >
                    {room.type}
                  </h3>
                  <Badge variant="available">Disponible</Badge>
                </div>
                <p className="text-muted small mb-3" style={{ overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                  {room.description}
                </p>
                <div className="d-flex gap-3 text-muted small mb-3">
                  <div className="d-flex align-items-center gap-1">
                    <Users size={15} />
                    <span>{room.capacity} Adultos</span>
                  </div>
                  <div className="d-flex align-items-center gap-1">
                    <Bed size={15} />
                    <span>King Size</span>
                  </div>
                </div>
                <div className="d-flex justify-content-between align-items-center pt-3 border-top">
                  <div className="d-flex align-items-baseline gap-1">
                    <DollarSign size={16} className="text-success" />
                    <span
                      className="fs-4 fw-bold text-success"
                      style={{ fontFamily: 'Manrope, sans-serif' }}
                    >
                      {room.price}
                    </span>
                    <span className="text-muted small">/ noche</span>
                  </div>
                  <Button variant="secondary" size="sm" onClick={() => handleOpenModal(room)}>
                    Reservar
                  </Button>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </section>

      {/* My bookings */}
      <section className="mb-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold mb-0 fs-4" style={{ fontFamily: 'Manrope, sans-serif' }}>
            Mis Reservas
          </h2>
          <span className="api-badge">
            <Code size={12} />
            GET /api/books/my
          </span>
        </div>
        <Card>
          <Table columns={bookingsColumns} data={bookings} emptyMessage="No tienes reservas" />
        </Card>
      </section>

      {/* Create booking modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Reservar ${selectedRoom?.type}`}
        footer={
          <>
            <Button variant="tertiary" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleCreateBooking} loading={bookingLoading}>
              Crear Reserva
            </Button>
          </>
        }
      >
        {error && (
          <div className="alert alert-danger py-2 small mb-3" role="alert">
            {error}
          </div>
        )}
        <div className="p-3 bg-light rounded mb-3">
          <div className="d-flex justify-content-between align-items-center mb-1">
            <span className="fw-semibold">{selectedRoom?.type}</span>
            <span className="text-success fw-bold">${selectedRoom?.price} / noche</span>
          </div>
          <p className="text-muted small mb-0">{selectedRoom?.description}</p>
        </div>
        <Input
          label="Fecha de Entrada"
          type="date"
          icon={Calendar}
          value={bookingForm.startDate}
          onChange={(e) => setBookingForm((prev) => ({ ...prev, startDate: e.target.value }))}
          required
        />
        <Input
          label="Fecha de Salida"
          type="date"
          icon={Calendar}
          value={bookingForm.endDate}
          onChange={(e) => setBookingForm((prev) => ({ ...prev, endDate: e.target.value }))}
          required
        />
      </Modal>

      {/* FAB */}
      <button
        className="fab-btn"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Volver arriba"
      >
        <Plus size={26} />
      </button>
    </DashboardLayout>
  );
};

export default ClientHome;
