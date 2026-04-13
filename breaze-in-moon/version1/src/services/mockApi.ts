// Mock API — respuestas simuladas para desarrollo/pruebas
// Activar con VITE_USE_MOCK=true en .env


import type { Room, Book } from '../types';

// ─── Generador de JWT falso ───────────────────────────────────────────────────
// Genera un token que el decoder de jwt.ts puede leer correctamente

function fakeJWT(payload: object): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = btoa(JSON.stringify(payload));
  return `${header}.${body}.mock_firma_no_verificada`;
}

function makeToken(
  id: string,
  name: string,
  email: string,
  role: 'ADMIN' | 'CLIENT',
): string {
  return fakeJWT({
    userId: id,
    name,
    email,
    role,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 86400 * 7, // 7 días
  });
}

// ─── Usuarios mock ────────────────────────────────────────────────────────────

const MOCK_USERS = [
  {
    id: 'admin-001',
    name: 'Admin Diana',
    email: 'admin@hotel.com',
    password: 'admin123',
    role: 'ADMIN' as const,
  },
  {
    id: 'client-001',
    name: 'Ernesto Guevara',
    email: 'cliente@hotel.com',
    password: 'echecliente123',
    role: 'CLIENT' as const,
  },
  {
    id: 'client-002',
    name: 'Harold Morales',
    email: 'cliente2@hotel.com',
    password: 'chefcitocliente123',
    role: 'CLIENT' as const,
  }
];

// ─── Datos mock ───────────────────────────────────────────────────────────────

const SEED_ROOMS: Room[] = [
  {
    id: 'room-001',
    type: 'SUITE',
    description:
      'Nuestra suite insignia con vista panorámica al bosque. Decoración minimalista con tonos verdes y madera natural.',
    capacity: 2,
    price: 350000,
    status: 'AVAILABLE',
    imageUrl:
      'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=400&h=300&fit=crop&q=80',
  },
  {
    id: 'room-002',
    type: 'DOBLE',
    description:
      'Habitación deluxe con balcón privado y jacuzzi. Perfecta para parejas en busca de tranquilidad.',
    capacity: 2,
    price: 220000,
    status: 'AVAILABLE',
    imageUrl:
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=400&h=300&fit=crop&q=80',
  },
  {
    id: 'room-003',
    type: 'SUITE',
    description:
      'Amplia habitación familiar con dos camas Queen y zona de estar. Vistas al jardín zen.',
    capacity: 4,
    price: 180000,
    status: 'AVAILABLE',
    imageUrl:
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&h=300&fit=crop&q=80',
  },
  {
    id: 'room-004',
    type: 'DOBLE',
    description:
      'Habitación cómoda con cama doble. Perfecta para viajes de negocios o escapadas cortas.',
    capacity: 1,
    price: 120000,
    status: 'OCCUPIED',
    imageUrl:
      'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=400&h=300&fit=crop&q=80',
  },
  {
    id: 'room-005',
    type: 'SENCILLA',
    description:
      'Bungalow independiente rodeado de vegetación. Incluye cocina equipada y terraza privada.',
    capacity: 3,
    price: 290000,
    status: 'MAINTENANCE',
    imageUrl:
      'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=400&h=300&fit=crop&q=80',
  },
];

const SEED_BOOKINGS: Book[] = [
  {
    id: 'book-001abc',
    roomId: 'room-001',
    room: SEED_ROOMS[0],
    userId: 'client-001',
    userName: 'Ernesto Guevara',
    startDate: '2026-04-05',
    endDate: '2026-04-09',
    status: 'CONFIRMED',
    createdAt: '2026-03-20T10:00:00Z',
  },
  {
    id: 'book-002def',
    roomId: 'room-002',
    room: SEED_ROOMS[1],
    userId: 'client-001',
    userName: 'Ernesto Guevara',
    startDate: '2026-05-01',
    endDate: '2026-05-03',
    status: 'CONFIRMED',
    createdAt: '2026-03-25T14:30:00Z',
  },
  {
    id: 'book-003ghi',
    roomId: 'room-004',
    room: SEED_ROOMS[3],
    userId: 'client-002',
    userName: 'Harold Morales',
    startDate: '2026-03-28',
    endDate: '2026-04-01',
    status: 'CONFIRMED',
    createdAt: '2026-03-10T09:15:00Z',
  },
];

// Estado mutable en memoria (se reinicia al recargar la página)
let rooms: Room[] = structuredClone(SEED_ROOMS);
let bookings: Book[] = structuredClone(SEED_BOOKINGS);

// ─── Manejador de peticiones ─────────────────────────────────────────────────

type MockResult = { data: unknown; status: number };

function ok(data: unknown): MockResult {
  return { data, status: 200 };
}

function fail(message: string, status = 400): MockResult {
  return { data: { success: false, message }, status };
}

export function handleMock(
  method: string,
  url: string,
  body?: unknown,
): MockResult | null {
  const m = method.toUpperCase();
  const d = body as Record<string, any>;

  // ── Auth ───────────────────────────────────────────────────────────────────

  if (m === 'POST' && url.includes('/api/auth/login')) {
    const user = MOCK_USERS.find(
      (u) => u.email === d?.email && u.password === d?.password,
    );
    if (!user) return fail('Credenciales incorrectas. Usa las credenciales de prueba.', 401);
    const { password: _pw, ...safeUser } = user;
    return ok({
      success: true,
      message: 'Login exitoso',
      data: { token: makeToken(user.id, user.name, user.email, user.role), user: safeUser },
    });
  }

  if (m === 'POST' && url.includes('/api/auth/register')) {
    const newUser = {
      id: `client-${Date.now()}`,
      name: d?.name ?? 'Nuevo Usuario',
      email: d?.email ?? 'nuevo@hotel.com',
      role: 'CLIENT' as const,
    };
    return ok({
      success: true,
      message: 'Registro exitoso',
      data: {
        token: makeToken(newUser.id, newUser.name, newUser.email, newUser.role),
        user: newUser,
      },
    });
  }

  // ── Rooms ──────────────────────────────────────────────────────────────────

  if (m === 'GET' && url.includes('/api/rooms/available')) {
    return ok({ success: true, data: rooms.filter((r) => r.status === 'AVAILABLE') });
  }

  if (m === 'GET' && (url === '/api/rooms' || url.endsWith('/api/rooms'))) {
    return ok({ success: true, data: rooms });
  }

  if (m === 'POST' && (url === '/api/rooms' || url.endsWith('/api/rooms'))) {
    const room = { ...d, id: `room-${Date.now()}`, status: d?.status ?? 'AVAILABLE' } as Room;
    rooms.push(room);
    return ok({ success: true, data: room });
  }

  if (m === 'PUT' && url.match(/\/api\/rooms\/.+/)) {
    const id = url.split('/').filter(Boolean).pop();
    rooms = rooms.map((r) => (r.id === id ? { ...r, ...d } : r));
    return ok({ success: true, data: rooms.find((r) => r.id === id) });
  }

  if (m === 'PATCH' && url.match(/\/api\/rooms\/.+\/status/)) {
    const parts = url.split('/').filter(Boolean);
    const id = parts[parts.indexOf('rooms') + 1];
    rooms = rooms.map((r) => (r.id === id ? { ...r, status: d?.status } : r));
    return ok({ success: true, data: rooms.find((r) => r.id === id) });
  }

  // ── Bookings ───────────────────────────────────────────────────────────────

  if (m === 'GET' && url.includes('/api/books/my')) {
    return ok({
      success: true,
      data: bookings.filter((b) => b.userId === 'client-001'),
    });
  }

  if (m === 'GET' && (url === '/api/books' || url.endsWith('/api/books'))) {
    return ok({ success: true, data: bookings });
  }

  if (m === 'POST' && (url === '/api/books' || url.endsWith('/api/books'))) {
    const room = rooms.find((r) => r.id === d?.roomId);
    const booking: Book = {
      id: `book-${Date.now()}`,
      roomId: d?.roomId,
      room,
      userId: 'client-001',
      userName: 'Ernesto Guevara',
      startDate: d?.startDate,
      endDate: d?.endDate,
      status: 'CONFIRMED',
      createdAt: new Date().toISOString(),
    };
    bookings.push(booking);
    return ok({ success: true, data: booking });
  }

  if (m === 'PATCH' && url.match(/\/api\/books\/.+/)) {
    const id = url.split('/').filter(Boolean).pop();
    bookings = bookings.map((b) => (b.id === id ? { ...b, ...d } : b));
    return ok({ success: true, data: bookings.find((b) => b.id === id) });
  }

  return null; // petición no interceptada
}
