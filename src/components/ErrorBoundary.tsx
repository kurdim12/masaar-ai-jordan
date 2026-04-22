import { Component, ReactNode } from "react";

interface Props { children: ReactNode }
interface State { hasError: boolean; error?: Error }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: unknown) {
    console.error("[Masaar ErrorBoundary]", error, info);
  }

  reload = () => {
    this.setState({ hasError: false, error: undefined });
    window.location.href = "/";
  };

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-6">
        <div className="card-clean max-w-sm w-full text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-gradient-gold flex items-center justify-center font-display text-3xl text-primary">
            M
          </div>
          <div>
            <h1 className="font-display text-xl text-primary">Masaar مسار</h1>
            <p className="text-sm text-muted-foreground mt-2">
              Something went wrong / حدث خطأ
            </p>
            {this.state.error?.message && (
              <p className="text-[11px] text-muted-foreground/70 mt-1 font-mono break-all">
                {this.state.error.message.slice(0, 120)}
              </p>
            )}
          </div>
          <button
            onClick={this.reload}
            className="btn-primary w-full"
          >
            Reload App
          </button>
        </div>
      </div>
    );
  }
}
