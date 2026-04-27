import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const STAFF_NAV = [
  { path: '/', label: 'Inicio', icon: '🏠' },
  { path: '/appointments', label: 'Citas', icon: '📅' },
  { path: '/work-orders', label: 'OTs', icon: '📋' },
  { path: '/customers', label: 'Clientes', icon: '👥' },
  { path: '/estimates', label: 'Presup.', icon: '📄' },
  { path: '/invoices', label: 'Facturas', icon: '💶' },
];

const CLIENT_NAV = [
  { path: '/', label: 'Inicio', icon: '🏠' },
  { path: '/appointments', label: 'Citas', icon: '📅' },
  { path: '/work-orders', label: 'Mis OTs', icon: '📋' },
  { path: '/estimates', label: 'Presup.', icon: '📄' },
  { path: '/invoices', label: 'Facturas', icon: '💶' },
];

export function Layout({ children }) {
  const { user, logout, isClient } = useAuth();
  const location = useLocation();

  const navItems = isClient ? CLIENT_NAV : STAFF_NAV;

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {/* Top bar */}
      <header className="sticky top-0 z-10 border-b border-gray-200 bg-white px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold text-blue-900">
            {isClient ? 'Mi Taller' : 'TallerApp'}
          </h1>
          <div className="flex items-center gap-3">
            <Link to="/profile" className="text-xs text-gray-500">
              {user?.first_name || user?.username}
            </Link>
            <button
              onClick={logout}
              className="rounded-lg bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 active:bg-gray-200"
            >
              Salir
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 px-4 py-4 pb-24">{children}</main>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white px-4 pb-safe">
        <div className="flex justify-around">
          {navItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center py-2 text-xs ${
                  active ? 'font-semibold text-blue-600' : 'text-gray-500'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
