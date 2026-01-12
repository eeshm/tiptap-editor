/**
 * Page visual component.
 * 
 * This component renders a single page container with proper styling
 * to look like a physical document page (similar to Google Docs/Word).
 * 
 * The page is purely visual - it doesn't contain the actual content.
 * Content is positioned absolutely over the page containers.
 */

'use client';

import React from 'react';
import {
    PAGE_WIDTH_PX,
    PAGE_HEIGHT_PX,
    PAGE_MARGIN_PX,
    CONTENT_HEIGHT_PX,
} from '@/lib/pagination';

interface PageProps {
    /** Page number (1-indexed) */
    pageNumber: number;
    /** Total number of pages */
    totalPages: number;
    /** Whether this is the active/focused page */
    isActive?: boolean;
}

/**
 * Renders a visual page container styled like a printed document.
 */
export function Page({ pageNumber, totalPages, isActive = false }: PageProps) {
    return (
        <div
            className="page-container relative bg-white shadow-lg border border-gray-200 mx-auto"
            style={{
                width: `${PAGE_WIDTH_PX}px`,
                height: `${PAGE_HEIGHT_PX}px`,
                // Add subtle shadow for depth
                boxShadow: isActive
                    ? '0 4px 20px rgba(0, 0, 0, 0.15)'
                    : '0 2px 8px rgba(0, 0, 0, 0.1)',
            }}
            data-page-number={pageNumber}
        >
            {/* Page margins indicator (debug mode only - can be enabled via CSS) */}
            <div
                className="page-margin-indicator absolute border border-dashed border-blue-200 opacity-0 pointer-events-none"
                style={{
                    top: `${PAGE_MARGIN_PX}px`,
                    left: `${PAGE_MARGIN_PX}px`,
                    right: `${PAGE_MARGIN_PX}px`,
                    bottom: `${PAGE_MARGIN_PX}px`,
                }}
            />

            {/* Page number (shown at bottom) */}
            <div
                className="absolute bottom-4 left-0 right-0 text-center text-xs text-gray-400 select-none"
            >
                Page {pageNumber} of {totalPages}
            </div>
        </div>
    );
}

/**
 * Debug component to show content area boundaries.
 * Enable by adding 'show-margins' class to parent.
 */
export function PageMarginDebug() {
    return (
        <style jsx global>{`
      .show-margins .page-margin-indicator {
        opacity: 1 !important;
      }
    `}</style>
    );
}
