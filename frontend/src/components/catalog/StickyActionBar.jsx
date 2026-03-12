export function StickyActionBar({ onCallback, onEnquiry, onWhatsapp, onCall }) {
  return (
    <div className="fixed inset-x-0 bottom-20 z-30 border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95 lg:bottom-0">
      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-3 sm:grid-cols-4">
        <button type="button" onClick={onCallback} className="btn-primary py-3">
          Request Callback
        </button>
        <button type="button" onClick={onWhatsapp} className="btn-secondary py-3">
          WhatsApp
        </button>
        <button type="button" onClick={onCall} className="btn-secondary py-3">
          Call Now
        </button>
        <button type="button" onClick={onEnquiry} className="btn-secondary py-3">
          Send Enquiry
        </button>
      </div>
    </div>
  );
}
