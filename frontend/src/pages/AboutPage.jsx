import { getStoreMapLink } from '../lib/location';

export function AboutPage({ profile }) {
  return (
    <div className="container-shell py-8">
      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="glass-card p-6">
          <h1 className="section-title">About {profile?.shopName || 'M-Cube Mobile'}</h1>
          <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
            M-Cube Mobile is a local shop focused on mobile sales, original accessories, and all kinds of mobile
            service support. The website is designed for easy one-hand browsing on phones, with privacy-safe lead
            capture only when customers explicitly request contact.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl bg-slate-100 p-5 dark:bg-slate-900">
              <h2 className="font-display text-xl font-semibold">What we sell</h2>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-300">Smartphones, feature phones, cases, chargers, audio devices, and daily-use accessories.</p>
            </div>
            <div className="rounded-3xl bg-slate-100 p-5 dark:bg-slate-900">
              <h2 className="font-display text-xl font-semibold">What we service</h2>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-300">Screen replacement, battery support, software tuning, charging issues, and diagnostics.</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-6">
          <h2 className="section-title">Store details</h2>
          <div className="mt-5 space-y-4 text-sm text-slate-500 dark:text-slate-300">
            <p>{profile?.addressLine1}, {profile?.addressLine2}</p>
            <p>{profile?.city}, {profile?.state} - {profile?.postalCode}</p>
            <p>{profile?.phone}</p>
            <p>WhatsApp: {profile?.whatsappNumber}</p>
          </div>
          <a
            href={getStoreMapLink(profile)}
            target="_blank"
            rel="noreferrer"
            className="btn-primary mt-6"
          >
            Navigate to shop
          </a>
        </div>
      </div>
    </div>
  );
}
