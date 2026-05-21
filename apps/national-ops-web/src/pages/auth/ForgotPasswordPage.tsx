import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { MaterialIcon } from "../../components/shared/MaterialIcon";
import { useForgotPassword } from "../../hooks/useApi";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const forgotPassword = useForgotPassword();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await forgotPassword.mutateAsync(email);
    setSent(true);
  };

  return (
    <div className="bg-m3-surface min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-m3-surface-container-lowest border border-m3-outline-variant rounded-xl shadow-sm p-8">
        <div className="text-center mb-6">
          <MaterialIcon icon="lock_reset" className="text-m3-primary text-[48px]" />
          <h1 className="text-headline-md text-m3-on-surface mt-3">Reset Password</h1>
          <p className="text-body-compact text-m3-on-surface-variant mt-1">Enter your email to receive a reset link.</p>
        </div>
        {sent ? (
          <div className="text-center space-y-4">
            <MaterialIcon icon="mark_email_read" className="text-green-600 text-[48px]" />
            <p className="text-body-main text-m3-on-surface">Check your email for reset instructions.</p>
            <Link to="/login" className="text-m3-primary hover:underline text-body-compact">Back to Login</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-label-caps text-m3-on-surface-variant mb-1">Email Address</label>
              <input value={email} onChange={(e) => setEmail(e.target.value)} required type="email" placeholder="name@donorlink.et" className="w-full px-3 py-3 bg-m3-surface-container-lowest border border-m3-outline-variant rounded focus:border-m3-primary focus:ring-1 focus:ring-m3-primary text-body-main" />
            </div>
            <button type="submit" disabled={forgotPassword.isPending} className="w-full bg-m3-primary text-m3-on-primary py-3 rounded text-title-sm hover:opacity-90 disabled:opacity-50">{forgotPassword.isPending ? "Sending..." : "Send Reset Link"}</button>
            <Link to="/login" className="block text-center text-body-compact text-m3-secondary hover:underline">Back to Login</Link>
          </form>
        )}
      </div>
    </div>
  );
}
