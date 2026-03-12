import { NavLink } from 'react-router-dom';

const links = [
  { to: '/owner/dashboard', label: 'Dashboard' },
  { to: '/owner/products', label: 'Products' },
  { to: '/owner/products/new', label: 'Add Product' },
  { to: '/owner/leads', label: 'Leads' },
  { to: '/owner/analytics', label: 'Analytics' },
  { to: '/owner/reviews', label: 'Reviews' },
  { to: '/owner/settings', label: 'Settings' }
];

export function OwnerSubnav() {
  return (
    <div className="mb-6 overflow-x-auto rounded-3xl border border-slate-200 bg-white p-2 shadow-lift dark:border-slate-800 dark:bg-slate-900">
      <div className="flex gap-2">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `rounded-2xl px-4 py-2 text-sm font-medium whitespace-nowrap ${
                isActive
                  ? 'bg-brand-100 text-brand-800 dark:bg-brand-900/40 dark:text-brand-200'
                  : 'text-slate-600 dark:text-slate-300'
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </div>
    </div>
  );
}
