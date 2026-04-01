import React from 'react';
import { Moon } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className="container-fluid p-0" style={{ minHeight: '100vh' }}>
      <div className="row g-0" style={{ minHeight: '100vh' }}>

        {/* Hero visual section */}
        <div className="col-md-7 d-none d-md-block auth-hero">
          <img
            alt="Luxury hotel room view"
            className="hero-image"
            src="https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=1200&auto=format&fit=crop"
          />
          <div className="hero-content">
            <div>
              <h1
                className="display-4 fw-bold mb-4"
                style={{ fontFamily: 'Manrope, sans-serif', letterSpacing: '-0.03em', lineHeight: 1 }}
              >
                Lunar Forest Resort
              </h1>
              <p
                className="fs-5 fw-medium"
                style={{ maxWidth: '28rem', opacity: 0.9 }}
              >
                Gestión hotelera diseñada para la calma y la eficiencia absoluta.
              </p>
            </div>
            <div className="d-flex align-items-center gap-3">
              <div
                style={{ width: '3rem', height: '1px', backgroundColor: 'rgba(144,214,137,0.3)' }}
              />
              <span
                className="text-uppercase"
                style={{ fontSize: '0.7rem', letterSpacing: '0.12em' }}
              >
                Editorial Hospitality Systems
              </span>
            </div>
          </div>
        </div>

        {/* Form section */}
        <div className="col-md-5 auth-form-section">
          <div style={{ width: '100%', maxWidth: '28rem' }}>

            {/* Logo */}
            <div className="d-flex align-items-center gap-2 mb-4">
              <Moon className="text-success" size={32} />
              <span
                className="fw-bold fs-5 text-success navbar-brand-hotel"
              >
                Gestión Hotelera
              </span>
            </div>

            <h2 className="fw-bold mb-1" style={{ fontFamily: 'Manrope, sans-serif' }}>
              {title}
            </h2>
            <p className="text-muted mb-4">{subtitle}</p>

            {children}

            {/* System status bar */}
            <div className="system-status-bar">
              <div className="status-indicator">
                <span className="status-dot" />
                <span>Systems Active</span>
              </div>
              <div className="status-indicator">
                <span>v2.4.0 Moon-Phase</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AuthLayout;
