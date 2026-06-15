import { useRouteError, useNavigate, isRouteErrorResponse } from 'react-router-dom';

export default function ErrorPage() {
  const error = useRouteError();
  const navigate = useNavigate();

  let errorMessage: string;
  let errorStatus: number | string = 'Err';

  if (isRouteErrorResponse(error)) {
    errorMessage = error.statusText || error.data?.message || 'Something went wrong on our end.';
    errorStatus = error.status;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === 'string') {
    errorMessage = error;
  } else {
    console.error(error);
    errorMessage = 'An unexpected error occurred.';
  }

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full">
        <div className="relative">
          {/* Decorative background elements */}
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-secondary/5 rounded-full blur-3xl" />
          
          <div className="relative bg-white/80 backdrop-blur-xl border border-outline-variant shadow-2xl rounded-3xl p-8 text-center overflow-hidden">
            <div className="mb-6 inline-flex items-center justify-center w-20 h-20 rounded-full bg-error-container/20 text-error animate-pulse">
              <span className="material-symbols-outlined text-5xl">warning</span>
            </div>
            
            <h1 className="text-display-lg text-error mb-2">{errorStatus}</h1>
            <h2 className="text-headline-md text-on-surface mb-4">Application Error</h2>
            
            <div className="bg-surface-container-low rounded-xl p-4 mb-8 text-left border border-outline-variant/50">
              <p className="text-xs font-bold text-outline uppercase tracking-widest mb-1">Details</p>
              <p className="text-sm text-on-surface-variant font-mono break-words leading-relaxed">
                {errorMessage}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button 
                onClick={() => navigate(-1)}
                className="flex-1 px-6 py-3 border border-outline text-on-surface hover:bg-surface-container rounded-xl transition-all font-label-md flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-lg">arrow_back</span>
                Go Back
              </button>
              <button 
                onClick={() => window.location.reload()}
                className="flex-1 px-6 py-3 bg-primary text-on-primary hover:bg-surface-tint shadow-lg shadow-primary/20 rounded-xl transition-all font-label-md flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-lg">refresh</span>
                Reload App
              </button>
            </div>
          </div>
          
          <div className="mt-8 text-center text-outline text-xs font-medium">
            Project DonorLink • Hospital Operations Portal
          </div>
        </div>
      </div>
    </div>
  );
}
