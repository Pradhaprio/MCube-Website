import { Link } from 'react-router-dom';

export function Footer({ profile }) {
  return (
    <footer className="border-t border-slate-200 bg-white py-12 dark:border-slate-800 dark:bg-slate-950">
      <div className="container-shell grid gap-10 md:grid-cols-3">
        <div>
          <h3 className="font-display text-lg font-semibold">{profile?.shopName || 'M-Cube Mobile'}</h3>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-300">
            Trusted local destination for mobile sales, accessories, and all kinds of mobile service.
          </p>
        </div>
        <div>
          <h4 className="font-semibold">Contact</h4>
          <div className="mt-3 space-y-2 text-sm text-slate-500 dark:text-slate-300">
            <p>{profile?.phone}</p>
            <p>{profile?.addressLine1}, {profile?.city}</p>
            <p>{profile?.openingHours?.monday}</p>
          </div>
        </div>
        <div>
          <h4 className="font-semibold">Legal</h4>
          <div className="mt-3 flex flex-col gap-2 text-sm text-slate-500 dark:text-slate-300">
            <Link to="/privacy">Privacy Notice</Link>
            <Link to="/about">About Shop</Link>
            <Link to="/contact">Contact Shop</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
