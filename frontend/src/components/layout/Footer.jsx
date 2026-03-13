import { Link } from 'react-router-dom';
import { BrandLogo } from '../shared/BrandLogo';

export function Footer({ profile }) {
  return (
    <footer className="border-t border-brand-100 bg-brand-950 py-12 text-white dark:border-brand-900 dark:bg-brand-950">
      <div className="container-shell grid gap-10 md:grid-cols-3">
        <div>
          <BrandLogo profile={profile} size="lg" light />
          <p className="mt-4 max-w-sm text-sm text-white/72">
            Trusted local destination for mobile sales, accessories, and all kinds of mobile service.
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-accent-200">Contact</h4>
          <div className="mt-3 space-y-2 text-sm text-white/72">
            <p>{profile?.phone}</p>
            <p>{profile?.addressLine1}, {profile?.city}</p>
            <p>{profile?.openingHours?.monday}</p>
          </div>
        </div>
        <div>
          <h4 className="font-semibold text-accent-200">Legal</h4>
          <div className="mt-3 flex flex-col gap-2 text-sm text-white/72">
            <Link to="/privacy">Privacy Notice</Link>
            <Link to="/about">About Shop</Link>
            <Link to="/contact">Contact Shop</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
