import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Code } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../components/layout/AuthLayout';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const Login: React.FC = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string>('');

  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(user.role === 'ADMIN' ? '/admin' : '/home', { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};
    if (!formData.email) newErrors.email = 'El email es requerido';
    else if (!validateEmail(formData.email)) newErrors.email = 'Formato de email inválido';
    if (!formData.password) newErrors.password = 'La contraseña es requerida';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    setApiError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    setApiError('');
    try {
      await login(formData);
    } catch (error: any) {
      setApiError(error.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Breaze in the Moon"
      subtitle="Accede a tu cuenta para gestionar tu propiedad con el estándar Lunar."
    >
      <form onSubmit={handleSubmit}>
        {apiError && (
          <div className="alert alert-danger py-2 small" role="alert">
            {apiError}
          </div>
        )}

        <Input
          label="Email"
          id="email"
          name="email"
          type="email"
          placeholder="nombre@hotel.com"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          icon={Mail}
          required
        />

        <Input
          label="Contraseña"
          id="password"
          name="password"
          type="password"
          placeholder="••••••••"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          icon={Lock}
          required
        />

        <div className="d-flex justify-content-end mb-3">
          <Link to="#" className="small text-success fw-medium text-decoration-none">
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        <Button type="submit" variant="primary" className="w-100" loading={loading}>
          Iniciar sesión
        </Button>
      </form>

      {/* Footer */}
      <div className="mt-4 pt-3 border-top text-center">
        <Link to="/register" className="text-success fw-medium text-decoration-none small">
          ¿No tienes cuenta? Regístrate
        </Link>
      </div>
    </AuthLayout>
  );
};

export default Login;
