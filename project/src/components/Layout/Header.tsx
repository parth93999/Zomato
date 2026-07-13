import { Link } from 'react-router-dom';
import { Search, ShoppingBag, Heart, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useApp } from '../../context/AppContext';

const getInitials = (name?: string) => {
  if (!name) return 'U';
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
};

interface HeaderProps {
  user: any | null;
  onLogout: () => void;
}

export default function Header({ user, onLogout }: HeaderProps) {
  const { getCartItemCount } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const cartCount = getCartItemCount();

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between rounded-full border border-white/40 bg-white/20 px-3 py-2 shadow-[0_10px_35px_rgba(15,23,42,0.12)] backdrop-blur-xl transition-all duration-300">
          <Link to="/" className="flex items-center">
            <span
              className="select-none text-3xl font-black italic tracking-tighter text-red-500 sm:text-4xl"
              style={{ letterSpacing: '-0.05em' }}
            >
              zomato
            </span>
          </Link>

          <nav className="hidden items-center space-x-1 md:flex">
            <Link
              to="/"
              className="rounded-full px-3 py-2 font-semibold text-red-600 transition-all duration-200 hover:bg-white/40 hover:text-red-500"
            >
              Home
            </Link>
            <Link
              to="/search"
              className="flex items-center space-x-1 rounded-full px-3 py-2 font-semibold text-red-600 transition-all duration-200 hover:bg-white/40 hover:text-red-500"
            >
              <Search className="h-4 w-4" />
              <span>Search</span>
            </Link>
            <Link
              to="/favorites"
              className="flex items-center space-x-1 rounded-full px-3 py-2 font-semibold text-red-600 transition-all duration-200 hover:bg-white/40 hover:text-red-500"
            >
              <Heart className="h-4 w-4" />
              <span>Favorites</span>
            </Link>
            <Link
              to="/orders"
              className="rounded-full px-3 py-2 font-semibold text-red-600 transition-all duration-200 hover:bg-white/40 hover:text-red-500"
            >
              Orders
            </Link>
          </nav>

          <div className="flex items-center space-x-2 sm:space-x-3">
            <Link
              to="/cart"
              className="relative rounded-full border border-white/50 bg-white/30 p-2.5 text-slate-700 transition-all duration-200 hover:border-red-200 hover:bg-white/50 hover:text-red-500"
            >
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm">
                  {cartCount}
                </span>
              )}
            </Link>

            <div className="hidden md:block">
              {user ? (
                <div className="flex items-center space-x-3">
                  <Link
                    to="/profile"
                    className="flex items-center space-x-2 rounded-full border border-white/50 bg-white/30 px-2.5 py-1.5 transition-all duration-200 hover:border-red-200 hover:bg-white/50"
                  >
                    <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-red-400 bg-red-500 text-sm font-bold text-white shadow-sm">
                      {user.image ? (
                        <img
                          src={`http://localhost:8001${user.image}`}
                          alt="Profile"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span>{getInitials(user.name)}</span>
                      )}
                    </div>
                    <span className="max-w-[120px] truncate text-sm font-semibold text-slate-700">
                      {user.name || 'User'}
                    </span>
                  </Link>
                  <button
                    onClick={onLogout}
                    className="rounded-full border border-red-200/70 bg-red-50/80 px-4 py-1.5 text-sm font-semibold text-red-600 transition-all duration-200 hover:bg-red-500 hover:text-white"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link
                    to="/login"
                    className="rounded-full bg-gradient-to-r from-red-500 to-orange-500 px-4 py-1.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:shadow-md"
                  >
                    Log in
                  </Link>
                  <Link
                    to="/signup"
                    className="rounded-full bg-gradient-to-r from-red-500 to-orange-500 px-4 py-1.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:shadow-md"
                  >
                    Sign up
                  </Link>
                </div>
              )}
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-full border border-white/50 bg-white/30 p-2.5 text-slate-700 transition-colors hover:bg-white/50 md:hidden"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="mx-4 rounded-[1.5rem] border border-white/40 bg-white/30 px-3 py-3 shadow-[0_16px_50px_rgba(15,23,42,0.12)] backdrop-blur-xl md:hidden">
          <nav className="space-y-2">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block rounded-xl px-4 py-2.5 font-semibold text-red-600 transition-colors hover:bg-white/40"
            >
              Home
            </Link>
            <Link
              to="/search"
              onClick={() => setMobileMenuOpen(false)}
              className="block rounded-xl px-4 py-2.5 font-semibold text-red-600 transition-colors hover:bg-white/40"
            >
              Search
            </Link>
            <Link
              to="/favorites"
              onClick={() => setMobileMenuOpen(false)}
              className="block rounded-xl px-4 py-2.5 font-semibold text-red-600 transition-colors hover:bg-white/40"
            >
              Favorites
            </Link>
            <Link
              to="/orders"
              onClick={() => setMobileMenuOpen(false)}
              className="block rounded-xl px-4 py-2.5 font-semibold text-red-600 transition-colors hover:bg-white/40"
            >
              Orders
            </Link>

            {user ? (
              <div className="space-y-2 border-t border-slate-100 pt-2">
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-4 py-2.5 font-medium text-slate-700 transition-colors hover:bg-red-50 hover:text-red-500"
                >
                  <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-red-500 text-sm font-bold text-white shadow-sm">
                    {user.image ? (
                      <img
                        src={`http://localhost:8001${user.image}`}
                        alt="Profile"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span>{getInitials(user.name)}</span>
                    )}
                  </div>
                  <span className="font-semibold text-slate-800">My Profile ({user.name})</span>
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onLogout();
                  }}
                  className="block w-full rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-center font-bold text-red-600 transition-colors hover:bg-red-100"
                >
                  Log out
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2 border-t border-slate-100 pt-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block rounded-xl bg-gradient-to-r from-red-500 to-orange-500 px-4 py-2.5 text-center font-bold text-white shadow-sm transition-colors"
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block rounded-xl bg-gradient-to-r from-red-500 to-orange-500 px-4 py-2.5 text-center font-bold text-white shadow-sm"
                >
                  Sign up
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
