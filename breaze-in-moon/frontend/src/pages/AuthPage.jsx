import { useState } from 'react'
import { login, register } from '../api'

export default function AuthPage({ onLogin }) {
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = mode === 'login'
        ? await login({ email: form.email, password: form.password })
        : await register({ name: form.name, email: form.email, password: form.password })

      if (!res.success) { setError(res.message); return }
      onLogin(res.data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-layout">

      {/* ── Hero section ── */}
      <div className="auth-hero">
        <img
          src="https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=1200&auto=format&fit=crop"
          alt="Luxury hotel room view"
          className="hero-image"
        />
        <div className="hero-content">
          <div>
            <h1>Breaze in the Moon - Semana Santa</h1>
            <p>Gestión hotelera diseñada para la calma y la eficiencia absoluta.</p>
          </div>
        </div>
      </div>

      {/* ── Form section ── */}
      <div className="auth-form-section">
        <div className="auth-form-inner">

          <div className="auth-logo">
            <span>Gestión Hotelera - Breaze in the Moon</span>
          </div>

          <h2 className="auth-title">
            {mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
          </h2>
          <p className="auth-subtitle">
            {mode === 'login'
              ? 'Accede a tu cuenta para gestionar tu propiedad con el estándar Lunar.'
              : 'Crea tu cuenta para comenzar a gestionar reservas.'}
          </p>

          <form onSubmit={handleSubmit}>
            {mode === 'register' && (
              <div className="form-group">
                <label>Nombre</label>
                <input value={form.name} onChange={set('name')} required placeholder="Tu nombre" />
              </div>
            )}
            <div className="form-group">
              <label>Email</label>
              <input type="email" value={form.email} onChange={set('email')} required placeholder="correo@ejemplo.com" />
            </div>
            <div className="form-group">
              <label>Contraseña</label>
              <input type="password" value={form.password} onChange={set('password')} required placeholder="••••••••" />
            </div>
            {error && <p className="error">{error}</p>}
            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? 'Cargando...' : mode === 'login' ? 'Entrar' : 'Registrarse'}
            </button>
          </form>

          <p className="form-link">
            {mode === 'login'
              ? <>¿No tienes cuenta? <span onClick={() => { setMode('register'); setError('') }}>Regístrate</span></>
              : <>¿Ya tienes cuenta? <span onClick={() => { setMode('login'); setError('') }}>Inicia sesión</span></>
            }
          </p>


        </div>
      </div>

    </div>
  )
}
