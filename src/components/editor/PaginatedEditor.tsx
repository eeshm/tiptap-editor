/**
 * Paginated Editor Wrapper component.
 * 
 * Modern, minimal design with clean visual hierarchy.
 */

'use client';

import React, { useRef, useEffect, useState } from 'react';
import { EditorContent, Editor } from '@tiptap/react';
import { Page } from './Page';
import {
  PAGE_WIDTH_PX,
  PAGE_HEIGHT_PX,
  PAGE_MARGIN_PX,
  PAGE_GAP_PX,
  CONTENT_HEIGHT_PX,
  PaginationResult,
} from '@/lib/pagination';

interface PaginatedEditorProps {
  editor: Editor | null;
  pagination: PaginationResult;
}

/**
 * Renders the paginated editor with visual page boundaries.
 */
export function PaginatedEditor({ editor, pagination }: PaginatedEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activePageIndex, setActivePageIndex] = useState(0);

  // Track cursor position to highlight active page
  useEffect(() => {
    if (!editor) return;

    const handleSelectionUpdate = () => {
      const { from } = editor.state.selection;
      const coords = editor.view.coordsAtPos(from);

      if (containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const relativeY = coords.top - containerRect.top + containerRef.current.scrollTop;

        const pageIndex = Math.floor(relativeY / (PAGE_HEIGHT_PX + PAGE_GAP_PX));
        setActivePageIndex(Math.max(0, Math.min(pageIndex, pagination.totalPages - 1)));
      }
    };

    editor.on('selectionUpdate', handleSelectionUpdate);
    return () => {
      editor.off('selectionUpdate', handleSelectionUpdate);
    };
  }, [editor, pagination.totalPages]);

  // Calculate total height needed for all pages
  const totalHeight = pagination.totalPages * PAGE_HEIGHT_PX +
    (pagination.totalPages - 1) * PAGE_GAP_PX;

  return (
    <div
      ref={containerRef}
      className="paginated-editor-container relative overflow-auto"
      style={{
        background: 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)',
        padding: `${PAGE_GAP_PX + 8}px`,
      }}
    >
      {/* Pages container */}
      <div
        className="pages-wrapper relative mx-auto"
        style={{
          width: `${PAGE_WIDTH_PX}px`,
          minHeight: `${totalHeight}px`,
        }}
      >
        {/* Render visual page backgrounds */}
        {pagination.pages.map((page, index) => (
          <div
            key={`page-${page.pageNumber}`}
            className="page-wrapper absolute left-0 right-0"
            style={{
              top: `${index * (PAGE_HEIGHT_PX + PAGE_GAP_PX)}px`,
            }}
          >
            <Page
              pageNumber={page.pageNumber}
              totalPages={pagination.totalPages}
              isActive={index === activePageIndex}
            />
          </div>
        ))}

        {/* Editor content layer */}
        <div
          className="editor-content-layer absolute"
          style={{
            top: `${PAGE_MARGIN_PX}px`,
            left: `${PAGE_MARGIN_PX}px`,
            width: `${PAGE_WIDTH_PX - PAGE_MARGIN_PX * 2}px`,
          }}
        >
          <EditorContent
            editor={editor}
            className="editor-content prose prose-slate max-w-none focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
}

/**
 * Style overrides for the editor content.
 * Modern typography with refined spacing.
 */
export function EditorStyles() {
  return (
    <style jsx global>{`
      /* Base editor styles */
      .ProseMirror {
        outline: none;
        min-height: ${CONTENT_HEIGHT_PX}px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', sans-serif;
        font-size: 15px;
        line-height: 1.7;
        color: #1e293b;
      }

      .ProseMirror p {
        margin: 0 0 1em 0;
      }

      .ProseMirror h1 {
        font-size: 2em;
        font-weight: 700;
        margin: 0 0 0.6em 0;
        line-height: 1.2;
        color: #0f172a;
        letter-spacing: -0.02em;
      }

      .ProseMirror h2 {
        font-size: 1.5em;
        font-weight: 600;
        margin: 1.5em 0 0.6em 0;
        line-height: 1.3;
        color: #0f172a;
        letter-spacing: -0.01em;
      }

      .ProseMirror h3 {
        font-size: 1.2em;
        font-weight: 600;
        margin: 1.25em 0 0.5em 0;
        line-height: 1.4;
        color: #0f172a;
      }

      .ProseMirror strong {
        font-weight: 600;
      }

      .ProseMirror ul,
      .ProseMirror ol {
        padding-left: 1.5em;
        margin: 0 0 1em 0;
      }

      .ProseMirror li {
        margin: 0.3em 0;
      }

      .ProseMirror li::marker {
        color: #94a3b8;
      }

      .ProseMirror table {
        border-collapse: collapse;
        width: 100%;
        margin: 1.5em 0;
        font-size: 14px;
      }

      .ProseMirror th,
      .ProseMirror td {
        border: 1px solid #e2e8f0;
        padding: 0.75em 1em;
        text-align: left;
        vertical-align: top;
      }

      .ProseMirror th {
        background-color: #f8fafc;
        font-weight: 600;
        color: #475569;
        font-size: 13px;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }

      .ProseMirror tr:hover td {
        background-color: #fafbfc;
      }

      .ProseMirror blockquote {
        border-left: 3px solid #e2e8f0;
        padding-left: 1em;
        margin: 1.5em 0;
        color: #64748b;
        font-style: italic;
      }

      .ProseMirror pre {
        background-color: #1e293b;
        color: #e2e8f0;
        padding: 1em 1.25em;
        border-radius: 8px;
        overflow-x: auto;
        margin: 1.5em 0;
        font-size: 13px;
      }

      .ProseMirror code {
        background-color: #f1f5f9;
        color: #e11d48;
        padding: 0.2em 0.4em;
        border-radius: 4px;
        font-size: 0.9em;
        font-family: 'SF Mono', 'Fira Code', 'Consolas', monospace;
      }

      .ProseMirror pre code {
        background: none;
        color: inherit;
        padding: 0;
      }

      /* Selection styles */
      .ProseMirror ::selection {
        background-color: #bfdbfe;
      }

      /* Placeholder for empty editor */
      .ProseMirror p.is-editor-empty:first-child::before {
        color: #94a3b8;
        content: attr(data-placeholder);
        float: left;
        height: 0;
        pointer-events: none;
      }

      /* Table cell selection */
      .ProseMirror .selectedCell {
        background-color: #dbeafe;
      }
    `}</style>
  );
}
