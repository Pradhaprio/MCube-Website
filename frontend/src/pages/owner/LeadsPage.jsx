import { useEffect, useState } from 'react';
import { api } from '../../api/client';
import { LeadTable } from '../../components/dashboard/LeadTable';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export function LeadsPage() {
  const { token } = useAuth();
  const { pushToast } = useToast();
  const [leads, setLeads] = useState([]);

  const load = () => api.get('/leads', token).then((data) => setLeads(data.leads));

  useEffect(() => {
    load();
  }, [token]);

  const updateLead = async (id, payload) => {
    await api.patch(`/leads/${id}`, payload, token);
    pushToast({ message: 'Lead updated.', tone: 'success' });
    load();
  };

  const deleteLead = async (id) => {
    await api.delete(`/leads/${id}`, token);
    pushToast({ message: 'Lead deleted.', tone: 'success' });
    load();
  };

  const exportCsv = async () => {
    const base = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
    const response = await fetch(`${base}/leads/export.csv`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'leads-export.csv';
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="section-title">Lead inbox</h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-300">Manage callback requests and enquiries with consent timestamps.</p>
        </div>
        <button type="button" onClick={exportCsv} className="btn-secondary">
          Export CSV
        </button>
      </div>
      <LeadTable leads={leads} onUpdate={updateLead} onDelete={deleteLead} />
    </div>
  );
}
