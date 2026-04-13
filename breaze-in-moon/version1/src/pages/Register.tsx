import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User as UserIcon, Code } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../components/layout/AuthLayout';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string>('');

  const { register, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(user.role === 'ADMIN' ? '/admin' : '/home', { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password: string) => password.length >= 8;

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};
    if (!formData.name.trim()) newErrors.name = 'El nombre es requerido';
    if (!formData.email) newErrors.email = 'El email es requerido';
    else if (!validateEmail(formData.email)) newErrors.email = 'Formato de email inválido';
    if (!formData.password) newErrors.password = 'La contraseña es requerida';
    else if (!validatePassword(formData.password)) newErrors.password = 'Mínimo 8 caracteres';
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
      await register(formData);
    } catch (error: any) {
      setApiError(error.message || 'Error al registrarse');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Crear una cuenta"
      subtitle="Comienza a gestionar tu propiedad con el estándar Lunar."
    >
      <form onSubmit={handleSubmit}>
        {apiError && (
          <div className="alert alert-danger py-2 small" role="alert">
            {apiError}
          </div>
        )}

        <Input
          label="Nombre Completo"
          id="name"
          name="name"
          type="text"
          placeholder="Ej. Alejandro Martínez"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          icon={UserIcon}
          required
        />

        <Input
          label="Correo Electrónico"
          id="email"
          name="email"
          type="email"
          placeholder="admin@lunarforest.com"
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
          helperText="Mínimo 8 caracteres con símbolos."
          icon={Lock}
          required
        />

        <Button type="submit" variant="primary" className="w-100 mt-2" loading={loading}>
          Registrarse
        </Button>
      </form>

      {/* Footer */}
      <div className="mt-4 pt-3 border-top text-center">
        <Link to="/login" className="text-success fw-medium text-decoration-none small">
          ¿Ya tienes cuenta? Inicia sesión
        </Link>
        <div className="mt-3 d-flex justify-content-center">
          <span className="api-badge">
            <Code size={12} />
            POST /api/auth/register
          </span>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Register;
