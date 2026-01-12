/**
 * Main page for the Paginated Document Editor.
 * 
 * Clean, minimal landing with focus on the editor experience.
 */

import { DocumentEditor } from '@/components';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-slate-50">
      {/* Minimal Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-slate-200/60 sticky top-0 z-30">
        <div className="px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Logo/Icon */}
              <div className="w-8 h-8 rounded-lg bg-linear-to-br from-slate-800 to-slate-600 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-sm font-semibold text-slate-900 tracking-tight">
                  Document Editor
                </h1>
                <p className="text-xs text-slate-500">
                  Real-time paginated editing
                </p>
              </div>
            </div>

            {/* Keyboard shortcuts hint */}
            <div className="hidden sm:flex items-center gap-2 text-[11px] text-slate-400">
              <kbd className="px-1.5 py-0.5 bg-slate-100 rounded font-mono">⌘B</kbd>
              <span>Bold</span>
              <span className="text-slate-300">·</span>
              <kbd className="px-1.5 py-0.5 bg-slate-100 rounded font-mono">⌘I</kbd>
              <span>Italic</span>
              <span className="text-slate-300">·</span>
              <kbd className="px-1.5 py-0.5 bg-slate-100 rounded font-mono">⌘Z</kbd>
              <span>Undo</span>
            </div>
          </div>
        </div>
      </header>

      {/* Editor container */}
      <div className="flex-1 overflow-hidden">
        <DocumentEditor />
      </div>
    </main>
  );
}
