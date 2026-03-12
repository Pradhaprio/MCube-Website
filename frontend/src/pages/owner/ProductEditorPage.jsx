import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../../api/client';
import { ItemForm } from '../../components/dashboard/ItemForm';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export function ProductEditorPage() {
  const { token } = useAuth();
  const { pushToast } = useToast();
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [categories, setCategories] = useState([]);
  const [initialValue, setInitialValue] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/catalog').then((data) => {
      setCategories(data.categories);
      if (isEdit) {
        const found = data.items.find((item) => item.id === id);
        setInitialValue(found || null);
      }
    });
  }, [id, isEdit]);

  const submit = async (payload) => {
    setLoading(true);
    try {
      if (isEdit) {
        await api.put(`/catalog/${id}`, payload, token);
      } else {
        await api.post('/catalog', payload, token);
      }
      pushToast({ message: `Item ${isEdit ? 'updated' : 'created'}.`, tone: 'success' });
      navigate('/owner/products');
    } catch (error) {
      pushToast({ message: error.message, tone: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const uploadImages = async (files) => {
    const formData = new FormData();
    files.forEach((file) => formData.append('images', file));
    const data = await api.upload('/uploads/images', formData, token);
    return data.files.map((file) => file.url);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="section-title">{isEdit ? 'Edit product' : 'Add product'}</h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-300">The form adapts to mobile, accessory, and service catalog types.</p>
      </div>
      <ItemForm
        categories={categories}
        initialValue={initialValue}
        onSubmit={submit}
        onUploadImages={uploadImages}
        loading={loading}
      />
    </div>
  );
}
