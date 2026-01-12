/**
 * Page visual component.
 * 
 * Modern, clean page container with subtle depth and refined shadows.
 */

'use client';

import React from 'react';
import {
    PAGE_WIDTH_PX,
    PAGE_HEIGHT_PX,
    PAGE_MARGIN_PX,
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
            className={`
        page-container relative bg-white rounded-sm
        transition-shadow duration-300 ease-out
        ${isActive ? 'ring-2 ring-slate-300/50' : ''}
      `}
            style={{
                width: `${PAGE_WIDTH_PX}px`,
                height: `${PAGE_HEIGHT_PX}px`,
                boxShadow: isActive
                    ? '0 8px 40px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)'
                    : '0 4px 20px rgba(0, 0, 0, 0.06), 0 1px 4px rgba(0, 0, 0, 0.04)',
            }}
            data-page-number={pageNumber}
        >
            {/* Page margins indicator (debug mode only) */}
            <div
                className="page-margin-indicator absolute border border-dashed border-blue-200/50 opacity-0 pointer-events-none transition-opacity"
                style={{
                    top: `${PAGE_MARGIN_PX}px`,
                    left: `${PAGE_MARGIN_PX}px`,
                    right: `${PAGE_MARGIN_PX}px`,
                    bottom: `${PAGE_MARGIN_PX}px`,
                }}
            />

            {/* Page number footer */}
            <div className="absolute bottom-6 left-0 right-0 flex justify-center">
                <span className="text-[11px] font-medium text-slate-400 tracking-wide">
                    {pageNumber} / {totalPages}
                </span>
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
