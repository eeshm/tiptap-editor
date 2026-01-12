/**
 * Main Document Editor component.
 * 
 * This is the primary component that combines:
 * - Tiptap editor with required extensions
 * - Pagination logic
 * - Toolbar
 * - Page visuals
 * 
 * The editor maintains a single continuous ProseMirror document.
 * Pagination is purely visual and does not modify the document schema.
 */

'use client';

import React from 'react';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';

import { Toolbar } from './Toolbar';
import { PaginatedEditor, EditorStyles } from './PaginatedEditor';
import { usePagination } from '@/hooks';

// Initial content demonstrating various content types
const INITIAL_CONTENT = `
<h1>Welcome to the Paginated Editor</h1>

<p>This is a <strong>Tiptap-based rich text editor</strong> with <em>real-time pagination</em>. The pages you see below represent A4-sized documents with 1-inch margins, exactly as they would appear when printed.</p>

<h2>How Pagination Works</h2>

<p>Unlike simple text editors, this editor calculates page breaks based on the actual rendered height of your content. This means:</p>

<ul>
  <li>Page breaks update dynamically as you type</li>
  <li>Formatting changes (like making text bold or adding headings) affect pagination</li>
  <li>Complex content like tables is measured accurately</li>
  <li>What you see matches what you'll get when printing</li>
</ul>

<h2>Supported Content Types</h2>

<p>The editor supports all common document elements:</p>

<ol>
  <li><strong>Paragraphs</strong> - Standard text blocks with proper line spacing</li>
  <li><strong>Headings</strong> - H1, H2, and H3 for document structure</li>
  <li><strong>Text Formatting</strong> - Bold, italic, and other inline styles</li>
  <li><strong>Lists</strong> - Both bullet points and numbered lists</li>
  <li><strong>Tables</strong> - Full table support with headers</li>
</ol>

<h2>Sample Table</h2>

<table>
  <tr>
    <th>Feature</th>
    <th>Status</th>
    <th>Notes</th>
  </tr>
  <tr>
    <td>Real-time pagination</td>
    <td>✓ Complete</td>
    <td>DOM-based measurement</td>
  </tr>
  <tr>
    <td>A4 page dimensions</td>
    <td>✓ Complete</td>
    <td>Print-ready sizing</td>
  </tr>
  <tr>
    <td>1-inch margins</td>
    <td>✓ Complete</td>
    <td>Standard document margins</td>
  </tr>
</table>

<h2>Try It Out</h2>

<p>Start typing below to see pagination in action. Add more content to see new pages appear automatically. Try pasting in large amounts of text or adding multiple headings and lists to see how the pagination adapts.</p>

<p>The editor maintains a single continuous document internally - page breaks are purely visual and don't affect the underlying content structure. This means copy/paste, find/replace, and other editing operations work exactly as expected.</p>

<h3>Technical Notes</h3>

<p>This implementation uses:</p>
<ul>
  <li>Tiptap (built on ProseMirror) for the rich text editing</li>
  <li>Custom DOM measurement for accurate pagination</li>
  <li>Debounced recalculation to maintain performance</li>
  <li>CSS-based page styling for print fidelity</li>
</ul>

<p>Keep adding content to see more pages appear...</p>
`;

/**
 * Main editor component with all features integrated.
 */
export function DocumentEditor() {
  // Initialize Tiptap editor with required extensions
  const editor = useEditor({
    // Disable immediate rendering to prevent SSR hydration mismatches
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        // Configure heading levels
        heading: {
          levels: [1, 2, 3],
        },
      }),
      // Table extensions for table support
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'editor-table',
        },
      }),
      TableRow,
      TableCell,
      TableHeader,
    ],
    content: INITIAL_CONTENT,
    // Enable editor immediately
    autofocus: 'end',
    editorProps: {
      attributes: {
        class: 'prose-editor focus:outline-none',
      },
    },
  });

  // Initialize pagination
  const { pagination } = usePagination(editor);

  return (
    <div className="document-editor flex flex-col h-full">
      {/* Editor styles (global CSS) */}
      <EditorStyles />

      {/* Toolbar */}
      <Toolbar editor={editor} />

      {/* Page count indicator */}
      <div className="page-indicator px-4 py-2 bg-gray-50 border-b border-gray-200 text-sm text-gray-600">
        <span className="font-medium">{pagination.totalPages}</span> page{pagination.totalPages !== 1 ? 's' : ''}
        <span className="mx-2">•</span>
        <span className="text-gray-500">A4 format with 1&quot; margins</span>
      </div>

      {/* Paginated editor area */}
      <div className="flex-1 overflow-hidden">
        <PaginatedEditor
          editor={editor}
          pagination={pagination}
        />
      </div>
    </div>
  );
}
