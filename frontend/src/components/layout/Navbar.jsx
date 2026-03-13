import { Link, NavLink, useLocation } from 'react-router-dom';
import { BrandLogo } from '../shared/BrandLogo';
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
    <header className="sticky top-0 z-40 border-b border-brand-100/80 bg-white/95 backdrop-blur dark:border-brand-900/70 dark:bg-brand-950/92">
      <div className="container-shell flex h-16 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-3">
          <BrandLogo profile={profile} size="md" />
          <div className="hidden text-xs text-slate-500 dark:text-slate-300 sm:block">Sales, service and accessories</div>
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
        <div className="flex items-center gap-2 lg:hidden">
          {!onOwnerPage && (
            <Link to="/owner/login" className="btn-secondary px-3 py-2 text-sm">
              Owner
            </Link>
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
