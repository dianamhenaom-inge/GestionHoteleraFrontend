export default function Navbar({ user, onLogout }) {
  const role = user.roles?.includes('ROLE_ADMIN') ? 'Admin' : 'Cliente'
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        🌙 Breaze in the Moon
      </div>
      <div className="navbar-actions">
        <div className="navbar-user">
          {user.email} · <strong>{role}</strong>
        </div>
        <button onClick={onLogout}>Cerrar sesión</button>
      </div>
    </nav>
  )
}
