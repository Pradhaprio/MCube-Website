import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export function ProductsPage() {
  const { token } = useAuth();
  const { pushToast } = useToast();
  const [items, setItems] = useState([]);

  const loadItems = () => api.get('/catalog', token).then((data) => setItems(data.items));

  useEffect(() => {
    loadItems();
  }, []);

  const removeItem = async (id) => {
    await api.delete(`/catalog/${id}`, token);
    pushToast({ message: 'Item deleted.', tone: 'success' });
    loadItems();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="section-title">Manage catalog</h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-300">Add, edit, pin, and remove mobiles, accessories, and service listings.</p>
        </div>
        <Link to="/owner/products/new" className="btn-primary w-full sm:w-auto">Add product</Link>
      </div>
      <div className="grid gap-4">
        {items.map((item) => (
          <div key={item.id} className="glass-card flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{item.itemType}</p>
              <h2 className="font-display text-xl font-semibold">{item.title}</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">{item.shortDescription}</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link to={`/owner/products/${item.id}/edit`} className="btn-secondary w-full sm:w-auto">Edit</Link>
              <button type="button" onClick={() => removeItem(item.id)} className="btn-secondary w-full sm:w-auto">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
