export interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'CLIENT';
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    token: string;
    user: User;
  };
}

export interface Room {
  id?: string;
  type: string;
  description: string;
  capacity: number;
  price: number;
  status: 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE';
  imageUrl?: string;
}

export interface Book {
  id?: string;
  roomId: string;
  room?: Room;
  userId?: string;
  userName?: string;
  startDate: string;
  endDate: string;
  status: 'CONFIRMED' | 'PENDING' | 'CANCELLED';
  createdAt?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}
