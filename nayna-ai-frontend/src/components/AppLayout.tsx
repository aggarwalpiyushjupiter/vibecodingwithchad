import { Link, NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../lib/auth/AuthContext';

export function AppLayout() {
  const { user, signOut, isAuthenticated } = useAuth();
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-white">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/instances" className="font-semibold">Nayna AI</Link>
          <nav className="flex items-center gap-4 text-sm">
            <NavLink to="/instances" className={({ isActive }) => isActive ? 'text-blue-600' : 'text-gray-600'}>
              Instances
            </NavLink>
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <span className="text-gray-600">{user?.email}</span>
                <button onClick={signOut} className="border rounded-md px-2 py-1">Sign out</button>
              </div>
            ) : (
              <NavLink to="/auth" className={({ isActive }) => isActive ? 'text-blue-600' : 'text-gray-600'}>
                Sign in
              </NavLink>
            )}
          </nav>
        </div>
      </header>
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}

