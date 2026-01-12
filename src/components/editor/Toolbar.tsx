/**
 * Editor Toolbar component.
 * 
 * Provides formatting controls for the Tiptap editor.
 * Includes support for all required content types:
 * - Text formatting (bold, italic)
 * - Headings
 * - Lists (bullet and numbered)
 * - Tables
 */

'use client';

import React, { useCallback } from 'react';
import { Editor } from '@tiptap/react';

interface ToolbarProps {
    editor: Editor | null;
}

/**
 * Button component for toolbar actions.
 */
function ToolbarButton({
    onClick,
    isActive = false,
    disabled = false,
    title,
    children,
}: {
    onClick: () => void;
    isActive?: boolean;
    disabled?: boolean;
    title: string;
    children: React.ReactNode;
}) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            title={title}
            className={`
        px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-150
        ${isActive
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1
      `}
        >
            {children}
        </button>
    );
}

/**
 * Separator for grouping toolbar buttons.
 */
function ToolbarSeparator() {
    return <div className="w-px h-6 bg-gray-300 mx-1" />;
}

/**
 * Main toolbar component with all formatting options.
 */
export function Toolbar({ editor }: ToolbarProps) {
    if (!editor) {
        return null;
    }

    // Table insertion handler
    const insertTable = useCallback(() => {
        editor
            .chain()
            .focus()
            .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
            .run();
    }, [editor]);

    return (
        <div className="toolbar flex flex-wrap items-center gap-1 p-3 bg-gray-50 border-b border-gray-200 rounded-t-lg">
            {/* Text formatting */}
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleBold().run()}
                isActive={editor.isActive('bold')}
                title="Bold (Ctrl+B)"
            >
                <span className="font-bold">B</span>
            </ToolbarButton>

            <ToolbarButton
                onClick={() => editor.chain().focus().toggleItalic().run()}
                isActive={editor.isActive('italic')}
                title="Italic (Ctrl+I)"
            >
                <span className="italic">I</span>
            </ToolbarButton>

            <ToolbarSeparator />

            {/* Headings */}
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                isActive={editor.isActive('heading', { level: 1 })}
                title="Heading 1"
            >
                H1
            </ToolbarButton>

            <ToolbarButton
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                isActive={editor.isActive('heading', { level: 2 })}
                title="Heading 2"
            >
                H2
            </ToolbarButton>

            <ToolbarButton
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                isActive={editor.isActive('heading', { level: 3 })}
                title="Heading 3"
            >
                H3
            </ToolbarButton>

            <ToolbarSeparator />

            {/* Lists */}
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                isActive={editor.isActive('bulletList')}
                title="Bullet List"
            >
                • List
            </ToolbarButton>

            <ToolbarButton
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                isActive={editor.isActive('orderedList')}
                title="Numbered List"
            >
                1. List
            </ToolbarButton>

            <ToolbarSeparator />

            {/* Table */}
            <ToolbarButton
                onClick={insertTable}
                isActive={editor.isActive('table')}
                title="Insert Table (3x3)"
            >
                Table
            </ToolbarButton>

            {/* Table controls (only shown when in a table) */}
            {editor.isActive('table') && (
                <>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().addColumnAfter().run()}
                        title="Add Column"
                    >
                        + Col
                    </ToolbarButton>

                    <ToolbarButton
                        onClick={() => editor.chain().focus().addRowAfter().run()}
                        title="Add Row"
                    >
                        + Row
                    </ToolbarButton>

                    <ToolbarButton
                        onClick={() => editor.chain().focus().deleteTable().run()}
                        title="Delete Table"
                    >
                        ✕ Table
                    </ToolbarButton>
                </>
            )}

            <ToolbarSeparator />

            {/* Undo/Redo */}
            <ToolbarButton
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().undo()}
                title="Undo (Ctrl+Z)"
            >
                ↩
            </ToolbarButton>

            <ToolbarButton
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().redo()}
                title="Redo (Ctrl+Y)"
            >
                ↪
            </ToolbarButton>
        </div>
    );
}
