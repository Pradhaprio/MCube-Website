import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export function LoginPage() {
  const [email, setEmail] = useState('owner@mcubemobile.local');
  const [password, setPassword] = useState('Owner@123');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { pushToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      pushToast({ message: 'Logged in successfully.', tone: 'success' });
      navigate('/owner/dashboard');
    } catch (error) {
      pushToast({ message: error.message, tone: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-10">
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-[2rem] bg-white p-8 shadow-lift">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-700">Owner access</p>
        <h1 className="mt-3 font-display text-3xl font-semibold text-slate-900">Sign in to the dashboard</h1>
        <p className="mt-2 text-sm text-slate-500">Use the seeded owner credentials below for local development.</p>
        <div className="mt-6 space-y-4">
          <input value={email} onChange={(e) => setEmail(e.target.value)} className="field" placeholder="Email" />
          <input value={password} onChange={(e) => setPassword(e.target.value)} className="field" placeholder="Password" type="password" />
          <button className="btn-primary w-full" disabled={loading}>
            {loading ? 'Signing in...' : 'Login'}
          </button>
        </div>
      </form>
    </div>
  );
}
