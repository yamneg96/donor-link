import { useState } from "react";
import { Link, useSearch } from "@tanstack/react-router";
import { MaterialIcon } from "../../components/shared/MaterialIcon";
import { useResetPassword } from "../../hooks/useApi";

export default function ResetPasswordPage() {
  const search: any = useSearch({ strict: false });
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const resetPassword = useResetPassword();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirm) { setError("Passwords do not match."); return; }
    try {
      await resetPassword.mutateAsync({ token: search.token || "", password });
      setDone(true);
    } catch { setError("Reset failed. Token may be expired."); }
  };

  return (
    <div className="bg-m3-surface min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-m3-surface-container-lowest border border-m3-outline-variant rounded-xl shadow-sm p-8">
        <div className="text-center mb-6">
          <MaterialIcon icon="key" className="text-m3-primary text-[48px]" />
          <h1 className="text-headline-md text-m3-on-surface mt-3">New Password</h1>
        </div>
        {done ? (
          <div className="text-center space-y-4">
            <MaterialIcon icon="check_circle" className="text-green-600 text-[48px]" />
            <p className="text-body-main text-m3-on-surface">Password reset successful!</p>
            <Link to="/login" className="text-m3-primary hover:underline text-body-compact">Go to Login</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <p className="text-body-compact text-m3-error bg-m3-error-container/20 p-3 rounded">{error}</p>}
            <div>
              <label className="block text-label-caps text-m3-on-surface-variant mb-1">New Password</label>
              <input value={password} onChange={(e) => setPassword(e.target.value)} required type="password" className="w-full px-3 py-3 border border-m3-outline-variant rounded focus:border-m3-primary focus:ring-1 focus:ring-m3-primary text-body-main" />
            </div>
            <div>
              <label className="block text-label-caps text-m3-on-surface-variant mb-1">Confirm Password</label>
              <input value={confirm} onChange={(e) => setConfirm(e.target.value)} required type="password" className="w-full px-3 py-3 border border-m3-outline-variant rounded focus:border-m3-primary focus:ring-1 focus:ring-m3-primary text-body-main" />
            </div>
            <button type="submit" disabled={resetPassword.isPending} className="w-full bg-m3-primary text-m3-on-primary py-3 rounded text-title-sm hover:opacity-90 disabled:opacity-50">{resetPassword.isPending ? "Resetting..." : "Reset Password"}</button>
          </form>
        )}
      </div>
    </div>
  );
}
