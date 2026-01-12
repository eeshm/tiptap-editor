/**
 * Main page for the Paginated Document Editor.
 * 
 * This page renders the full-featured Tiptap editor with real-time
 * pagination that displays content as it would appear on printed A4 pages.
 */

import { DocumentEditor } from '@/components';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Paginated Document Editor
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">
                Tiptap-based editor with real-time A4 pagination
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                Ctrl+B: Bold • Ctrl+I: Italic • Ctrl+Z: Undo
              </span>
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
