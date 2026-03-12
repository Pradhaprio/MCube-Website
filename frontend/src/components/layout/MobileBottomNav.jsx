import { NavLink } from 'react-router-dom';

const publicLinks = [
  { to: '/', label: 'Home', icon: 'H' },
  { to: '/mobiles', label: 'Mobiles', icon: 'M' },
  { to: '/accessories', label: 'Gear', icon: 'G' },
  { to: '/services', label: 'Service', icon: 'S' },
  { to: '/contact', label: 'Contact', icon: 'C' }
];

const ownerLinks = [
  { to: '/owner/dashboard', label: 'Dash', icon: 'D' },
  { to: '/owner/products', label: 'Items', icon: 'I' },
  { to: '/owner/leads', label: 'Leads', icon: 'L' },
  { to: '/owner/analytics', label: 'Stats', icon: 'A' },
  { to: '/owner/settings', label: 'Store', icon: 'T' }
];

export function MobileBottomNav({ owner = false }) {
  const links = owner ? ownerLinks : publicLinks;
  return (
    <nav className="fixed inset-x-3 bottom-3 z-40 rounded-3xl border border-slate-200 bg-white/95 px-3 py-2 shadow-lift backdrop-blur dark:border-slate-800 dark:bg-slate-900/95 lg:hidden">
      <div className="grid grid-cols-5 gap-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex flex-col items-center rounded-2xl px-2 py-2 text-[11px] font-medium ${
                isActive ? 'bg-brand-100 text-brand-800 dark:bg-brand-900/40 dark:text-brand-200' : 'text-slate-500 dark:text-slate-300'
              }`
            }
          >
            <span className="text-base">{link.icon}</span>
            <span>{link.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
