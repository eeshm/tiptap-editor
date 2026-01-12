/**
 * Main Document Editor component.
 * 
 * Uses tiptap-pagination-plus for automatic pagination with A4 page sizing.
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { PaginationPlus, PAGE_SIZES } from 'tiptap-pagination-plus';

import { Toolbar } from './Toolbar';

// A4 dimensions at 96 DPI
const PAGE_WIDTH = PAGE_SIZES.A4.pageWidth;   // 794px
const PAGE_HEIGHT = PAGE_SIZES.A4.pageHeight; // 1123px
const MARGIN = 96; // 1 inch

// Pagination configuration
const PAGINATION_CONFIG = {
  pageHeight: PAGE_HEIGHT,
  pageWidth: PAGE_WIDTH,
  pageGap: 40,
  pageGapBorderSize: 1,
  pageGapBorderColor: '#d1d5db',
  pageBreakBackground: '#f3f4f6',
  marginTop: MARGIN,
  marginBottom: MARGIN,
  marginLeft: MARGIN,
  marginRight: MARGIN,
  contentMarginTop: 0,
  contentMarginBottom: 0,
  headerLeft: '',
  headerRight: 'Page {page}',
  footerLeft: '',
  footerRight: '',
};

// Initial content demonstrating various content types
const INITIAL_CONTENT = `
<h1>Welcome to the Paginated Editor</h1>

<p>This is a <strong>Tiptap-based rich text editor</strong> with <em>real-time pagination</em>. The pages you see below represent A4-sized documents with 1-inch margins, exactly as they would appear when printed.</p>

<h2>How Pagination Works</h2>

<p>This editor uses the <code>tiptap-pagination-plus</code> extension for automatic pagination. As you type, content automatically flows across pages with proper page breaks.</p>

<ul>
  <li>Page breaks update dynamically as you type</li>
  <li>Formatting changes affect pagination</li>
  <li>Complex content like tables is handled correctly</li>
  <li>What you see matches what you'll get when printing</li>
</ul>

<h2>Supported Content Types</h2>

<p>The editor supports all common document elements:</p>

<ol>
  <li><strong>Paragraphs</strong> — Standard text blocks with proper line spacing</li>
  <li><strong>Headings</strong> — H1, H2, and H3 for document structure</li>
  <li><strong>Text Formatting</strong> — Bold, italic, and other inline styles</li>
  <li><strong>Lists</strong> — Both bullet points and numbered lists</li>
  <li><strong>Tables</strong> — Full table support with headers</li>
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
    <td>Using tiptap-pagination-plus</td>
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

<p>Start typing to see pagination in action. Add more content to see new pages appear automatically. Try pasting large amounts of text or adding multiple headings and lists to see how the pagination adapts.</p>

<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>

<h3>Technical Notes</h3>

<p>This implementation uses:</p>
<ul>
  <li>Tiptap (built on ProseMirror) for rich text editing</li>
  <li>tiptap-pagination-plus for automatic pagination</li>
  <li>A4 page dimensions (794px × 1123px at 96 DPI)</li>
  <li>1-inch margins on all sides</li>
</ul>

<p>Keep adding content to see more pages appear...</p>

<p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.</p>

<p>At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.</p>

<p>Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus.</p>
`;

/**
 * Main editor component with pagination.
 */
export function DocumentEditor() {
  const [pageCount, setPageCount] = useState(1);

  // Initialize Tiptap editor with pagination extension
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableCell,
      TableHeader,
      // Pagination Plus extension
      PaginationPlus.configure(PAGINATION_CONFIG),
    ],
    content: INITIAL_CONTENT,
    autofocus: 'end',
  });

  // Track page count by observing DOM changes
  useEffect(() => {
    if (!editor) return;

    const updatePageCount = () => {
      // tiptap-pagination-plus creates page elements
      const editorDom = editor.view?.dom;
      if (!editorDom) return;

      // The extension wraps content in pages
      const pages = editorDom.querySelectorAll('[data-page-number]');
      if (pages.length > 0) {
        setPageCount(pages.length);
      } else {
        // Fallback: count by height
        const contentHeight = editorDom.scrollHeight;
        const pageContentHeight = PAGE_HEIGHT - (MARGIN * 2);
        const calculatedPages = Math.max(1, Math.ceil(contentHeight / pageContentHeight));
        setPageCount(calculatedPages);
      }
    };

    // Initial update with delay
    const timeout = setTimeout(updatePageCount, 500);

    // Update on content changes
    editor.on('update', updatePageCount);
    editor.on('create', updatePageCount);

    // Observe DOM mutations
    const observer = new MutationObserver(updatePageCount);
    if (editor.view?.dom) {
      observer.observe(editor.view.dom, { childList: true, subtree: true });
    }

    return () => {
      clearTimeout(timeout);
      editor.off('update', updatePageCount);
      editor.off('create', updatePageCount);
      observer.disconnect();
    };
  }, [editor]);

  return (
    <div className="document-editor flex flex-col h-full">
      {/* Editor styles */}
      <EditorStyles pageWidth={PAGE_WIDTH} />

      {/* Toolbar */}
      <Toolbar editor={editor} />

      {/* Page count indicator */}
      <div className="page-indicator shrink-0 flex items-center justify-between px-4 py-2 bg-white border-b border-slate-200/60">
        <div className="flex items-center gap-2 text-xs">
          <span className="font-medium text-slate-700">{pageCount}</span>
          <span className="text-slate-400">
            {pageCount === 1 ? 'page' : 'pages'}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>A4 • 1&quot; margins</span>
        </div>
      </div>

      {/* Editor container - gray background, centered content */}
      <div className="editor-scroll-container flex-1 overflow-auto bg-slate-100">
        <div className="flex justify-center py-8 px-4">
          <div
            className="editor-wrapper"
            style={{ width: `${PAGE_WIDTH}px` }}
          >
            <EditorContent
              editor={editor}
              className="tiptap-editor"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Styles for the editor and pagination.
 */
function EditorStyles({ pageWidth }: { pageWidth: number }) {
  return (
    <style jsx global>{`
      /* Main editor container */
      .tiptap-editor {
        width: ${pageWidth}px;
        margin: 0 auto;
      }

      .tiptap-editor .ProseMirror {
        outline: none;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', sans-serif;
        font-size: 15px;
        line-height: 1.7;
        color: #1e293b;
        background: white;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08), 0 2px 6px rgba(0, 0, 0, 0.04);
        border-radius: 2px;
      }

      /* Typography */
      .tiptap-editor .ProseMirror p {
        margin: 0 0 1em 0;
      }

      .tiptap-editor .ProseMirror h1 {
        font-size: 2em;
        font-weight: 700;
        margin: 0 0 0.6em 0;
        line-height: 1.2;
        color: #0f172a;
        letter-spacing: -0.02em;
      }

      .tiptap-editor .ProseMirror h2 {
        font-size: 1.5em;
        font-weight: 600;
        margin: 1.5em 0 0.6em 0;
        line-height: 1.3;
        color: #0f172a;
        letter-spacing: -0.01em;
      }

      .tiptap-editor .ProseMirror h3 {
        font-size: 1.2em;
        font-weight: 600;
        margin: 1.25em 0 0.5em 0;
        line-height: 1.4;
        color: #0f172a;
      }

      .tiptap-editor .ProseMirror strong {
        font-weight: 600;
      }

      .tiptap-editor .ProseMirror em {
        font-style: italic;
      }

      .tiptap-editor .ProseMirror ul,
      .tiptap-editor .ProseMirror ol {
        padding-left: 1.5em;
        margin: 0 0 1em 0;
      }

      .tiptap-editor .ProseMirror li {
        margin: 0.3em 0;
      }

      .tiptap-editor .ProseMirror li::marker {
        color: #94a3b8;
      }

      .tiptap-editor .ProseMirror table {
        border-collapse: collapse;
        width: 100%;
        margin: 1.5em 0;
        font-size: 14px;
      }

      .tiptap-editor .ProseMirror th,
      .tiptap-editor .ProseMirror td {
        border: 1px solid #e2e8f0;
        padding: 0.75em 1em;
        text-align: left;
        vertical-align: top;
      }

      .tiptap-editor .ProseMirror th {
        background-color: #f8fafc;
        font-weight: 600;
        color: #475569;
        font-size: 13px;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }

      .tiptap-editor .ProseMirror code {
        background-color: #f1f5f9;
        color: #e11d48;
        padding: 0.2em 0.4em;
        border-radius: 4px;
        font-size: 0.9em;
        font-family: 'SF Mono', 'Fira Code', 'Consolas', monospace;
      }

      /* Selection styles */
      .tiptap-editor .ProseMirror ::selection {
        background-color: #bfdbfe;
      }

      /* Table cell selection */
      .tiptap-editor .ProseMirror .selectedCell {
        background-color: #dbeafe;
      }

      /* ======================================
         Pagination Plus extension styles
         ====================================== */
      
      /* Page container styles from tiptap-pagination-plus */
      .tiptap-page,
      [data-page-number] {
        background: white;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08), 0 2px 6px rgba(0, 0, 0, 0.04);
        border-radius: 2px;
        margin-bottom: 40px;
      }

      .tiptap-page:last-child,
      [data-page-number]:last-child {
        margin-bottom: 0;
      }

      /* Page break styling */
      .page-break,
      .tiptap-page-break {
        height: 40px;
        background: #f3f4f6;
        margin: 0;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .page-break::before,
      .tiptap-page-break::before {
        content: '';
        position: absolute;
        left: 0;
        right: 0;
        top: 50%;
        height: 1px;
        background: #d1d5db;
      }

      /* Header/Footer styling */
      .tiptap-page-header,
      .tiptap-page-footer {
        font-size: 11px;
        color: #64748b;
        padding: 8px 0;
      }
    `}</style>
  );
}
