import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../app/store/authStore';
import { apiClient } from '../../api/client';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const login = useAuthStore(state => state.login);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await apiClient.post('/auth/login', { email, password });
      if (response.data?.success) {
         // Assuming response payload shape matches standard DTOs: { data: { accessToken, user } }
         const { accessToken, user } = response.data.data;
         login(accessToken, user || { id: 'mock', email, firstName: 'City', lastName: 'General', role: 'hospital' });
         navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to authenticate to central server. Check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-container flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 tibeb-overlay opacity-[0.03]"></div>
      
      <div className="bg-surface rounded-2xl card-shadow p-8 w-full max-w-md relative z-10 border border-outline-variant">
        <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-primary-container text-on-primary-container flex items-center justify-center mb-4">
               <span className="material-symbols-outlined text-[32px]">medical_services</span>
            </div>
            <h1 className="font-display-sm text-center text-primary mb-1">DonorLink Hospital</h1>
            <p className="font-body-md text-on-surface-variant text-center">Login to your clinical portal</p>
        </div>

        {error && (
            <div className="bg-error-container text-on-error-container p-3 rounded mb-4 font-body-sm text-center">
                {error}
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-label-md text-on-surface mb-1">Email</label>
            <input
              type="email"
              required
              className="w-full px-4 py-2 bg-surface-bright border border-outline-variant rounded focus:border-primary focus:ring-1 focus:ring-primary outline-none text-on-surface"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@hospital.com"
            />
          </div>
          <div>
            <label className="block font-label-md text-on-surface mb-1">Password</label>
            <input
              type="password"
              required
              className="w-full px-4 py-2 bg-surface-bright border border-outline-variant rounded focus:border-primary focus:ring-1 focus:ring-primary outline-none text-on-surface"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-on-primary py-3 rounded-lg font-label-md shadow-sm hover:opacity-90 disabled:opacity-50 transition-opacity mt-4"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
