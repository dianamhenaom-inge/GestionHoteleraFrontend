import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Moon, LogOut, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-vh-100 bg-light">
      {/* Navbar */}
      <nav className="navbar navbar-light bg-white border-bottom shadow-sm px-4 flex-nowrap">
          <div className="d-flex align-items-center gap-2">
            <Moon className="text-success" size={26} />
            <span className="fw-bold fs-5 text-success navbar-brand-hotel">
              Gestión Hotelera
            </span>
          </div>

          <div className="d-flex align-items-center gap-3">
            <div className="d-flex align-items-center gap-1 px-2 rounded-pill border border-success-subtle" style={{ lineHeight: 1 }}>
              <User size={15} className="text-success" />
              <span className="fw-medium small text-success">{user?.name}</span>
            </div>
            <button
              onClick={handleLogout}
              className="btn btn-link text-success text-decoration-none d-flex align-items-center gap-2 fw-medium p-0"
            >
              <LogOut size={17} />
              <span>Salir</span>
            </button>
          </div>
      </nav>

      {/* Main content */}
      <main className="container-xl py-5">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
