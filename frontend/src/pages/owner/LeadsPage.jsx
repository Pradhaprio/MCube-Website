import { useEffect, useState } from 'react';
import { API_URL, api } from '../../api/client';
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
    try {
      const response = await fetch(`${API_URL}/leads/export.csv`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to export leads.');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = 'leads-export.csv';
      anchor.click();
      URL.revokeObjectURL(url);
      pushToast({ message: 'Lead export downloaded.', tone: 'success' });
    } catch (error) {
      pushToast({ message: error.message || 'Failed to export leads.', tone: 'error' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="section-title">Lead inbox</h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-300">Manage callback requests and enquiries with consent timestamps.</p>
        </div>
        <button type="button" onClick={exportCsv} className="btn-secondary w-full sm:w-auto">
          Export CSV
        </button>
      </div>
      <LeadTable leads={leads} onUpdate={updateLead} onDelete={deleteLead} />
    </div>
  );
}
