import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../app/store/authStore';
import {authApi} from '@/api/auth'

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const login = useAuthStore(state => state.login);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // const response = await apiClient.post('/auth/login', { email, password });
      const response = await authApi.login({email, password})
      console.log(response)
      if (response.data?.success) {
        const { tokens, user } = response.data.data;
        login(tokens.accessToken, user || { id: 'mock', email, firstName: 'City', lastName: 'General', role: 'hospital' });
        navigate('/app/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to authenticate to central server. Check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {error && (
        <div className="bg-error-container text-on-error-container p-3.5 rounded-lg mb-6 font-body-sm text-sm text-center border border-error/10">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email / Staff ID */}
        <div className="space-y-2">
          <label className="block font-label-md text-sm font-semibold text-on-surface-variant" htmlFor="email">
            Email / Staff ID
          </label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">badge</span>
            <input 
              className="w-full pl-12 pr-4 py-3 bg-surface-container-low border-b-2 border-outline-variant focus:border-primary focus:ring-0 outline-none transition-all font-body-md rounded-t-lg text-on-surface"
              id="email"
              type="email" 
              required
              disabled={loading}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@hospital.com"
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="block font-label-md text-sm font-semibold text-on-surface-variant" htmlFor="password">
              Password
            </label>
            <a className="text-xs font-bold text-primary hover:underline transition-all" href="#forgot">Forgot Password?</a>
          </div>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">lock</span>
            <input 
              className="w-full pl-12 pr-12 py-3 bg-surface-container-low border-b-2 border-outline-variant focus:border-primary focus:ring-0 outline-none transition-all font-body-md rounded-t-lg text-on-surface"
              id="password"
              type={showPassword ? 'text' : 'password'}
              required
              disabled={loading}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
            <button 
              className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-primary transition-colors"
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              <span className="material-symbols-outlined">
                {showPassword ? 'visibility_off' : 'visibility'}
              </span>
            </button>
          </div>
        </div>

        {/* Primary Secure CTA */}
        <button 
          className="w-full py-4 bg-tertiary text-on-tertiary font-label-md text-sm font-semibold rounded-xl shadow-md hover:bg-tertiary-container hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          type="submit"
          disabled={loading}
        >
          <span className="material-symbols-outlined">
            {loading ? 'progress_activity' : 'verified_user'}
          </span>
          {loading ? 'Authenticating...' : 'Secure Login'}
        </button>

        {/* Access Divider Component */}
        <div className="relative py-2 flex items-center">
          <div className="flex-grow border-t border-outline-variant/50"></div>
          <span className="flex-shrink mx-4 text-[10px] tracking-wider text-outline font-bold">OR ACCESS VIA</span>
          <div className="flex-grow border-t border-outline-variant/50"></div>
        </div>

        {/* SSO Option Button */}
        <button 
          className="w-full py-3 bg-surface-container border border-outline-variant text-on-surface-variant font-label-md text-sm font-medium rounded-xl hover:bg-surface-variant transition-all duration-300 flex items-center justify-center gap-2 group"
          type="button"
        >
          <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors">account_balance</span>
          Sign in with Hospital ID
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-outline-variant/30 text-center">
        <p className="text-xs text-on-surface-variant">
          Don't have hospital credentials? <a className="text-primary font-bold hover:underline" href="#help">Need Help?</a>
        </p>
      </div>
    </>
  );
}