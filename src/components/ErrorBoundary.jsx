import React from "react";

export default class ErrorBoundary extends React.Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50 p-6 text-center">
          <h1 className="font-[Poppins] text-xl font-semibold text-slate-800">
            Santillan POS could not start
          </h1>
          <p className="max-w-md text-sm text-slate-600">
            {this.state.error?.message || "An unexpected error occurred."}
          </p>
          <button
            type="button"
            onClick={() => {
              try {
                localStorage.removeItem("santillan-pos-data-v1");
              } catch {
                /* ignore */
              }
              window.location.reload();
            }}
            className="rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white"
          >
            Reset saved data and reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
