/**
 * Paginated Editor Wrapper component.
 * 
 * This component renders the visual page containers behind the editor
 * and manages the pagination overlay. The editor content floats over
 * the page visuals.
 * 
 * Architecture:
 * - Single continuous Tiptap editor (no schema modifications)
 * - Page containers are rendered below the editor content
 * - CSS clips content to page boundaries visually
 * - Pagination is purely a view-layer concern
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
            // Get cursor position in the viewport
            const { from } = editor.state.selection;
            const coords = editor.view.coordsAtPos(from);

            if (containerRef.current) {
                const containerRect = containerRef.current.getBoundingClientRect();
                const relativeY = coords.top - containerRect.top + containerRef.current.scrollTop;

                // Determine which page the cursor is on
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
            className="paginated-editor-container relative overflow-auto bg-gray-100"
            style={{
                // Add padding around the pages
                padding: `${PAGE_GAP_PX}px`,
            }}
        >
            {/* Pages container - rendered behind editor content */}
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

                {/* Editor content layer - positioned over pages */}
                <div
                    className="editor-content-layer absolute"
                    style={{
                        top: `${PAGE_MARGIN_PX}px`,
                        left: `${PAGE_MARGIN_PX}px`,
                        width: `${PAGE_WIDTH_PX - PAGE_MARGIN_PX * 2}px`,
                        // We don't set a fixed height - let content flow naturally
                    }}
                >
                    <EditorContent
                        editor={editor}
                        className="editor-content prose prose-sm max-w-none focus:outline-none"
                    />
                </div>
            </div>
        </div>
    );
}

/**
 * Style overrides for the editor content.
 * These ensure proper typography and spacing for print fidelity.
 */
export function EditorStyles() {
    return (
        <style jsx global>{`
      /* Editor content styles */
      .ProseMirror {
        outline: none;
        min-height: ${CONTENT_HEIGHT_PX}px;
      }

      .ProseMirror p {
        margin: 0 0 1em 0;
        line-height: 1.6;
      }

      .ProseMirror h1 {
        font-size: 2em;
        font-weight: 700;
        margin: 0 0 0.5em 0;
        line-height: 1.2;
      }

      .ProseMirror h2 {
        font-size: 1.5em;
        font-weight: 600;
        margin: 1em 0 0.5em 0;
        line-height: 1.3;
      }

      .ProseMirror h3 {
        font-size: 1.25em;
        font-weight: 600;
        margin: 1em 0 0.5em 0;
        line-height: 1.4;
      }

      .ProseMirror ul,
      .ProseMirror ol {
        padding-left: 1.5em;
        margin: 0 0 1em 0;
      }

      .ProseMirror li {
        margin: 0.25em 0;
      }

      .ProseMirror table {
        border-collapse: collapse;
        width: 100%;
        margin: 1em 0;
      }

      .ProseMirror th,
      .ProseMirror td {
        border: 1px solid #d1d5db;
        padding: 0.5em 0.75em;
        text-align: left;
      }

      .ProseMirror th {
        background-color: #f3f4f6;
        font-weight: 600;
      }

      .ProseMirror blockquote {
        border-left: 3px solid #d1d5db;
        padding-left: 1em;
        margin: 1em 0;
        color: #6b7280;
      }

      .ProseMirror pre {
        background-color: #1f2937;
        color: #f9fafb;
        padding: 1em;
        border-radius: 0.5em;
        overflow-x: auto;
        margin: 1em 0;
      }

      .ProseMirror code {
        background-color: #f3f4f6;
        padding: 0.125em 0.25em;
        border-radius: 0.25em;
        font-size: 0.9em;
      }

      .ProseMirror pre code {
        background: none;
        padding: 0;
      }

      /* Selection styles */
      .ProseMirror ::selection {
        background-color: #93c5fd;
      }

      /* Placeholder for empty editor */
      .ProseMirror p.is-editor-empty:first-child::before {
        color: #9ca3af;
        content: attr(data-placeholder);
        float: left;
        height: 0;
        pointer-events: none;
      }
    `}</style>
    );
}
