import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../app/store/authStore';
import { apiClient } from '../../api/client';

export default function LoginPage() {
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
         const { accessToken, user } = response.data.data;
         login(accessToken, user || { id: 'mock', email, firstName: 'Donor', lastName: 'Hero', role: 'donor' });
         navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to authenticate. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row relative overflow-hidden">
      {/* Left side graphics (hidden on mobile) */}
      <div className="hidden md:flex md:w-1/2 bg-surface-container-low flex-col items-center justify-center p-12 border-r border-outline-variant/30">
          <div className="text-center">
             <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
                <span className="material-symbols-outlined text-[40px]" style={{ fontVariationSettings: "'FILL' 1" }}>diversity_1</span>
             </div>
             <h2 className="font-display-md text-on-surface mb-4">Welcome back to the Lifeline</h2>
             <p className="font-body-lg text-on-surface-variant">Log in to track your donations, find nearby drives, and monitor your local impact.</p>
          </div>
      </div>

      {/* Right side form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full">
          <button onClick={() => navigate('/')} className="mb-8 font-label-caps text-outline hover:text-primary transition-colors flex items-center gap-1">
             <span className="material-symbols-outlined text-[16px]">arrow_back</span> Back to home
          </button>
          
          <h1 className="font-headline-lg text-on-surface font-bold mb-2">Sign in</h1>
          <p className="font-body-md text-on-surface-variant mb-8">Enter your details to access your donor account.</p>

          {error && (
              <div className="bg-error-container text-on-error-container p-3 rounded mb-4 font-body-sm">
                  {error}
              </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block font-label-md text-on-surface mb-1">Email</label>
              <input
                type="email"
                required
                className="w-full px-4 py-3 bg-surface border border-outline-variant rounded focus:border-primary focus:ring-1 focus:ring-primary outline-none text-on-surface transition-shadow shadow-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
              />
            </div>
            <div>
              <label className="block font-label-md text-on-surface mb-1">Password</label>
              <input
                type="password"
                required
                className="w-full px-4 py-3 bg-surface border border-outline-variant rounded focus:border-primary focus:ring-1 focus:ring-primary outline-none text-on-surface transition-shadow shadow-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            
            <div className="flex justify-between items-center text-sm pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-on-surface-variant">
                    <input type="checkbox" className="w-4 h-4 rounded text-primary focus:ring-primary" />
                    Remember me
                </label>
                <a href="#" className="font-label-md text-primary hover:underline">Forgot password?</a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-on-primary py-3.5 rounded font-label-caps uppercase tracking-wider shadow-sm hover:-translate-y-0.5 hover:shadow-md disabled:opacity-50 disabled:hover:translate-y-0 transition-all mt-4"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          <p className="font-body-sm text-center text-on-surface-variant mt-8">
            Don't have an account? <span onClick={() => navigate('/register')} className="text-primary font-semibold hover:underline cursor-pointer">Register now</span>
          </p>
        </div>
      </div>
    </div>
  );
}
