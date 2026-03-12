import { getStoreMapLink } from '../lib/location';

export function ContactPage({ profile }) {
  const whatsappMessage = encodeURIComponent('Hi, I would like to know more about your mobiles, services, and accessories.');
  return (
    <div className="container-shell py-8">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="glass-card p-6">
          <h1 className="section-title">Contact shop</h1>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-300">
            Browse freely. Use visible messaging or call actions only if you want to talk with the shop.
          </p>
          <div className="mt-6 grid gap-4">
            <a href={`tel:${profile?.phone || ''}`} className="btn-primary">Call now</a>
            <a href={`https://wa.me/${profile?.whatsappNumber || ''}?text=${whatsappMessage}`} target="_blank" rel="noreferrer" className="btn-secondary">Chat on WhatsApp</a>
            <a
              href={getStoreMapLink(profile)}
              target="_blank"
              rel="noreferrer"
              className="btn-secondary"
            >
              Open address
            </a>
          </div>
        </div>
        <div className="glass-card p-6">
          <h2 className="section-title">Opening hours</h2>
          <div className="mt-5 space-y-3 text-sm text-slate-500 dark:text-slate-300">
            {Object.entries(profile?.openingHours || {}).map(([day, hours]) => (
              <div key={day} className="flex justify-between rounded-2xl bg-slate-100 px-4 py-3 capitalize dark:bg-slate-900">
                <span>{day}</span>
                <span>{hours}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
