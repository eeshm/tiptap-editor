/**
 * Editor Toolbar component.
 * 
 * Modern, minimalistic toolbar with clear labels and blue active states.
 */

'use client';

import React, { useCallback } from 'react';
import { Editor } from '@tiptap/react';

interface ToolbarProps {
    editor: Editor | null;
}

/**
 * Icon components for toolbar buttons
 */
const Icons = {
    Bold: () => (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 4h8a4 4 0 014 4 4 4 0 01-4 4H6zm0 8h9a4 4 0 014 4 4 4 0 01-4 4H6z" />
        </svg>
    ),
    Italic: () => (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 4h4m-2 0l-4 16m0 0h4" />
        </svg>
    ),
    BulletList: () => (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
        </svg>
    ),
    OrderedList: () => (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h10M7 16h10M3 8V6l2-1M3 16v2l2 1M3 11l2 1" />
        </svg>
    ),
    Table: () => (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18M10 3v18M14 3v18M3 6a3 3 0 013-3h12a3 3 0 013 3v12a3 3 0 01-3 3H6a3 3 0 01-3-3V6z" />
        </svg>
    ),
    AddColumn: () => (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
    ),
    AddRow: () => (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
    ),
    Delete: () => (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
    ),
};

/**
 * Button component for toolbar actions with icon and label.
 */
function ToolbarButton({
    onClick,
    isActive = false,
    disabled = false,
    title,
    icon,
    label,
    variant = 'default',
}: {
    onClick: () => void;
    isActive?: boolean;
    disabled?: boolean;
    title: string;
    icon?: React.ReactNode;
    label?: string;
    variant?: 'default' | 'danger';
}) {
    const baseClasses = `
    inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg
    text-sm font-medium
    transition-all duration-150 ease-out
    focus:outline-none focus:ring-2 focus:ring-offset-1
  `;

    const getVariantClasses = () => {
        if (variant === 'danger') {
            return 'text-red-600 hover:bg-red-50 border border-red-200 focus:ring-red-400';
        }
        if (isActive) {
            return 'bg-blue-600 text-white shadow-sm border border-blue-600 focus:ring-blue-400';
        }
        return 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200 focus:ring-slate-400';
    };

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            title={title}
            className={`
        ${baseClasses}
        ${getVariantClasses()}
        ${disabled ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}
      `}
        >
            {icon}
            {label && <span>{label}</span>}
        </button>
    );
}

/**
 * Separator for grouping toolbar buttons.
 */
function ToolbarSeparator() {
    return <div className="w-px h-6 bg-slate-200 mx-2" />;
}

/**
 * Main toolbar component with all formatting options.
 */
export function Toolbar({ editor }: ToolbarProps) {
    // Table insertion handler
    const insertTable = useCallback(() => {
        if (!editor) return;
        editor
            .chain()
            .focus()
            .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
            .run();
    }, [editor]);

    if (!editor) {
        return null;
    }

    return (
        <div className="toolbar sticky top-0 z-20 flex flex-wrap items-center gap-1.5 px-4 py-2.5 bg-white/90 backdrop-blur-lg border-b border-slate-200/80">
            {/* Text formatting */}
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleBold().run()}
                isActive={editor.isActive('bold')}
                title="Bold (Ctrl+B)"
                icon={<Icons.Bold />}
                label="Bold"
            />

            <ToolbarButton
                onClick={() => editor.chain().focus().toggleItalic().run()}
                isActive={editor.isActive('italic')}
                title="Italic (Ctrl+I)"
                icon={<Icons.Italic />}
                label="Italic"
            />

            <ToolbarSeparator />

            {/* Headings */}
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                isActive={editor.isActive('heading', { level: 1 })}
                title="Heading 1"
                label="H1"
            />

            <ToolbarButton
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                isActive={editor.isActive('heading', { level: 2 })}
                title="Heading 2"
                label="H2"
            />

            <ToolbarButton
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                isActive={editor.isActive('heading', { level: 3 })}
                title="Heading 3"
                label="H3"
            />

            <ToolbarSeparator />

            {/* Lists */}
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                isActive={editor.isActive('bulletList')}
                title="Bullet List"
                icon={<Icons.BulletList />}
                label="Bullet List"
            />

            <ToolbarButton
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                isActive={editor.isActive('orderedList')}
                title="Ordered List"
                icon={<Icons.OrderedList />}
                label="Ordered List"
            />

            <ToolbarSeparator />

            {/* Table */}
            <ToolbarButton
                onClick={insertTable}
                isActive={editor.isActive('table')}
                title="Insert Table (3x3)"
                icon={<Icons.Table />}
                label="Insert Table"
            />

            {/* Table controls (only shown when in a table) */}
            {editor.isActive('table') && (
                <>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().addColumnAfter().run()}
                        title="Add Column After"
                        icon={<Icons.AddColumn />}
                        label="Add Column"
                    />

                    <ToolbarButton
                        onClick={() => editor.chain().focus().addRowAfter().run()}
                        title="Add Row After"
                        icon={<Icons.AddRow />}
                        label="Add Row"
                    />

                    <ToolbarButton
                        onClick={() => editor.chain().focus().deleteTable().run()}
                        title="Delete Table"
                        icon={<Icons.Delete />}
                        label="Delete Table"
                        variant="danger"
                    />
                </>
            )}

        </div>
    );
}
