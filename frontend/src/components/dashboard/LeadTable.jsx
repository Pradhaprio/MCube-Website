import { useState } from 'react';

export function LeadTable({ leads = [], onUpdate, onDelete }) {
  const [notes, setNotes] = useState({});

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800">
      <div className="hidden grid-cols-[1.4fr_1.4fr_1fr_1fr_1fr] gap-4 bg-slate-100 px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:bg-slate-900 md:grid">
        <span>Lead</span>
        <span>Item</span>
        <span>Method</span>
        <span>Status</span>
        <span>Action</span>
      </div>
      <div className="divide-y divide-slate-200 dark:divide-slate-800">
        {leads.map((lead) => (
          <div key={lead.id} className="grid gap-4 px-4 py-4 md:grid-cols-[1.4fr_1.4fr_1fr_1fr_1fr] md:items-center">
            <div>
              <p className="font-semibold">{lead.visitorName}</p>
              <p className="text-sm text-slate-500 dark:text-slate-300">{lead.phoneNumber}</p>
              <p className="mt-1 text-xs text-slate-400">{new Date(lead.createdAt).toLocaleString()}</p>
            </div>
            <div>
              <p className="font-medium">{lead.selectedItemTitleSnapshot}</p>
              <p className="text-sm capitalize text-slate-500 dark:text-slate-300">{lead.selectedItemTypeSnapshot}</p>
            </div>
            <p className="capitalize">{lead.contactMethodPreference}</p>
            <select
              value={lead.status}
              onChange={(event) => onUpdate(lead.id, { status: event.target.value })}
              className="field h-10"
            >
              {['new', 'contacted', 'converted', 'closed'].map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            <div className="space-y-2">
              <input
                value={notes[lead.id] ?? lead.ownerNotes ?? ''}
                onChange={(event) => setNotes((current) => ({ ...current, [lead.id]: event.target.value }))}
                className="field h-10"
                placeholder="Owner note"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => onUpdate(lead.id, { ownerNotes: notes[lead.id] ?? lead.ownerNotes ?? '' })}
                  className="btn-secondary flex-1 py-2 text-center"
                >
                  Save note
                </button>
                <a className="btn-secondary flex-1 py-2 text-center" href={`tel:${lead.phoneNumber}`}>
                  Call
                </a>
              </div>
              <button type="button" onClick={() => onDelete?.(lead.id)} className="btn-secondary w-full py-2 text-center">
                Delete lead
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
