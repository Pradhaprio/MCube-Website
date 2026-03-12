import { useEffect, useState } from 'react';

const initialState = {
  visitorName: '',
  phoneNumber: '',
  message: '',
  preferredCallbackTime: '',
  consentAccepted: false
};

export function InterestSheet({ open, mode, item, onClose, onSubmit, loading }) {
  const [form, setForm] = useState(initialState);

  useEffect(() => {
    if (open) {
      setForm(initialState);
    }
  }, [open, mode]);

  if (!open || !item) {
    return null;
  }

  const title = mode === 'callback' ? 'Request a callback' : 'Send an enquiry';

  return (
    <div className="fixed inset-0 z-[60] bg-slate-950/40" onClick={onClose}>
      <div
        className="absolute inset-x-0 bottom-0 max-h-[88vh] rounded-t-[2rem] bg-white p-5 shadow-lift dark:bg-slate-950"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mx-auto mb-4 h-1.5 w-16 rounded-full bg-slate-200 dark:bg-slate-700" />
        <div className="space-y-4 overflow-y-auto pb-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-700">{item.itemType}</p>
            <h3 className="font-display text-2xl font-semibold">{title}</h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">Interested in {item.title}</p>
          </div>
          <div className="grid gap-3">
            <input
              value={form.visitorName}
              onChange={(event) => setForm((current) => ({ ...current, visitorName: event.target.value }))}
              className="field"
              placeholder="Your name"
            />
            <input
              value={form.phoneNumber}
              onChange={(event) => setForm((current) => ({ ...current, phoneNumber: event.target.value }))}
              className="field"
              placeholder="Phone number"
              inputMode="tel"
            />
            <textarea
              value={form.message}
              onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))}
              className="textarea"
              placeholder={
                item.itemType === 'service' ? 'Describe the issue with your mobile' : 'Any questions or requirements'
              }
            />
            <input
              value={form.preferredCallbackTime}
              onChange={(event) => setForm((current) => ({ ...current, preferredCallbackTime: event.target.value }))}
              className="field"
              placeholder="Preferred callback time"
            />
            <div className="rounded-2xl bg-slate-100 p-4 text-sm text-slate-600 dark:bg-slate-900 dark:text-slate-300">
              We use your phone number only to respond to this request about {item.title}. We do not collect contact
              details silently.
            </div>
            <label className="flex items-start gap-3 rounded-2xl border border-slate-200 p-4 text-sm dark:border-slate-800">
              <input
                type="checkbox"
                checked={form.consentAccepted}
                onChange={(event) => setForm((current) => ({ ...current, consentAccepted: event.target.checked }))}
                className="mt-1 h-4 w-4"
              />
              <span>I consent to M-Cube Mobile contacting me about this item using the details I entered.</span>
            </label>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button
              type="button"
              onClick={() =>
                onSubmit({
                  ...form,
                  selectedCatalogItemId: item.id,
                  contactMethodPreference: mode,
                  sourcePage: `/item/${item.slug}`
                })
              }
              className="btn-primary"
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
