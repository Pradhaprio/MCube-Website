export function PrivacyPage() {
  return (
    <div className="container-shell py-8">
      <div className="glass-card max-w-4xl p-6">
        <h1 className="section-title">Privacy notice</h1>
        <div className="mt-6 space-y-5 text-sm leading-7 text-slate-600 dark:text-slate-300">
          <p>Visitors can browse this website without logging in and without sharing personal contact details.</p>
          <p>Anonymous analytics record only non-personal activity such as product views, page paths, referral source, device type, and CTA clicks.</p>
          <p>Your phone number is collected only when you fill in a visible callback or enquiry form and tick the consent checkbox.</p>
          <p>We use your submitted name and phone number only to respond to the exact item or service you asked about.</p>
          <p>The owner can export or delete lead records when requested. Consent timestamp is stored with every submitted lead.</p>
        </div>
      </div>
    </div>
  );
}
