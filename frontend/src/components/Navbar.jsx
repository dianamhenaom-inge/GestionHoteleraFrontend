export default function Navbar({ user, onLogout }) {
  const role = user.roles?.includes('ROLE_ADMIN') ? 'Admin' : 'Cliente'
  return (
    <nav className="navbar">
      <h1>🌙 Breaze in the Moon</h1>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <span style={{ fontSize: '0.875rem', color: '#aaa' }}>
          {user.email} · <strong style={{ color: '#7dd3fc' }}>{role}</strong>
        </span>
        <button onClick={onLogout}>Cerrar sesión</button>
      </div>
    </nav>
  )
}
