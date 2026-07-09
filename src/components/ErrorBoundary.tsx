import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * @class ErrorBoundary
 * @description Catches rendering errors in the component tree and displays a styled fallback UI.
 */
export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  private handleGoHome = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-radial from-slate-900 via-slate-950 to-black text-slate-100 p-6 font-sans">
          <div className="max-w-md w-full bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 shadow-2xl text-center space-y-6 transform hover:scale-[1.01] transition-all duration-300">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 text-red-500 animate-pulse">
              <AlertTriangle className="w-8 h-8" />
            </div>
            
            <div className="space-y-2">
              <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-red-400 via-orange-400 to-amber-400 bg-clip-text text-transparent">
                Une erreur est survenue
              </h1>
              <p className="text-sm text-slate-400 leading-relaxed">
                L'application a rencontré un problème inattendu lors de l'affichage de cette page.
              </p>
            </div>

            {this.state.error && (
              <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-4 text-left">
                <p className="text-xs font-mono text-red-400/90 break-all overflow-y-auto max-h-32">
                  {this.state.error.toString()}
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={this.handleReset}
                className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-medium shadow-lg shadow-red-950/30 hover:shadow-red-950/55 transition-all duration-200 cursor-pointer active:scale-95 text-sm"
              >
                <RefreshCw className="w-4 h-4" />
                Réessayer
              </button>
              <button
                onClick={this.handleGoHome}
                className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium border border-slate-700 hover:border-slate-650 transition-all duration-200 cursor-pointer active:scale-95 text-sm"
              >
                <Home className="w-4 h-4" />
                Accueil
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
