import { Link, NavLink, useLocation } from 'react-router-dom';
import { ThemeToggle } from '../shared/ThemeToggle';

const links = [
  { label: 'Home', to: '/' },
  { label: 'Mobiles', to: '/mobiles' },
  { label: 'Accessories', to: '/accessories' },
  { label: 'Services', to: '/services' },
  { label: 'Contact', to: '/contact' }
];

export function Navbar({ profile }) {
  const location = useLocation();
  const onOwnerPage = location.pathname.startsWith('/owner');

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/60 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
      <div className="container-shell flex h-16 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-700 font-display text-lg font-bold text-white">
            M
          </div>
          <div>
            <div className="font-display text-base font-semibold">{profile?.shopName || 'M-Cube Mobile'}</div>
            <div className="text-xs text-slate-500 dark:text-slate-300">Sales, service and accessories</div>
          </div>
        </Link>
        <nav className="hidden items-center gap-2 lg:flex">
          {!onOwnerPage &&
            links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `rounded-full px-4 py-2 text-sm font-medium ${
                    isActive ? 'bg-brand-100 text-brand-800 dark:bg-brand-900/40 dark:text-brand-200' : 'text-slate-600 dark:text-slate-300'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          <Link to="/owner/login" className="btn-secondary">
            Owner
          </Link>
          <ThemeToggle />
        </nav>
        <div className="lg:hidden">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
