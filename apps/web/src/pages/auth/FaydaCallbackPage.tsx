import { useEffect, useState } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { Droplets, AlertTriangle, RefreshCw } from "lucide-react";
import { useFaydaCallback } from "../../hooks/useApi";
import { authStore } from "../../store/authStore";
import { Button } from "../../components/ui";

export function FaydaCallbackPage() {
  const navigate = useNavigate();
  const faydaCallback = useFaydaCallback();
  const [error, setError] = useState("");
  const [processed, setProcessed] = useState(false);

  // Extract code and state from URL search params
  const searchParams = new URLSearchParams(window.location.search);
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  useEffect(() => {
    if (processed) return;
    if (!code || !state) {
      setError("Missing authorization code or state. Please try logging in again.");
      return;
    }

    setProcessed(true);

    faydaCallback.mutate(
      { code, state },
      {
        onSuccess: (res) => {
          const { needsOnboarding } = res.data.data;
          if (needsOnboarding) {
            navigate({ to: "/onboarding" });
          } else {
            navigate({ to: "/dashboard" });
          }
        },
        onError: (err: any) => {
          const msg = err?.response?.data?.message || err?.message || "Authentication failed";
          setError(msg);
        },
      }
    );
  }, [code, state, processed]);

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#f8f9ff" }}>
      <div className="text-center max-w-sm px-6">
        {error ? (
          <div className="space-y-6 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto">
              <AlertTriangle className="size-8 text-pulse" />
            </div>
            <div>
              <h1 className="font-headline text-xl font-bold text-midnight mb-2">
                Authentication Failed
              </h1>
              <p className="text-sm text-on-surface-variant font-body leading-relaxed">
                {error}
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <Button
                onClick={() => navigate({ to: "/login" })}
                className="w-full"
              >
                <RefreshCw className="size-4" />
                Try Again
              </Button>
              <Button
                variant="secondary"
                onClick={() => navigate({ to: "/" })}
                className="w-full"
              >
                Go Home
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="w-16 h-16 rounded-full primary-gradient flex items-center justify-center mx-auto animate-pulse-slow">
              <Droplets className="size-8 text-white" />
            </div>
            <div>
              <h1 className="font-headline text-xl font-bold text-midnight mb-2">
                Verifying Identity
              </h1>
              <p className="text-sm text-on-surface-variant font-body">
                Securely exchanging credentials with Fayda eSignet...
              </p>
            </div>
            <div className="flex justify-center gap-1.5">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full bg-pulse animate-pulse"
                  style={{ animationDelay: `${i * 0.3}s` }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
