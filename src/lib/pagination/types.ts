/**
 * Type definitions for the pagination system.
 */

/**
 * Represents a measured block element in the document.
 * Used to track each block's position and height for pagination calculations.
 */
export interface MeasuredBlock {
  /** The DOM element reference */
  element: HTMLElement;
  /** Height of the element in pixels (from getBoundingClientRect) */
  height: number;
  /** Top position relative to the editor container */
  offsetTop: number;
  /** Unique identifier for React keys (based on DOM position) */
  id: string;
}

/**
 * Represents a calculated page with its contained blocks.
 */
export interface PageInfo {
  /** Page number (1-indexed for display) */
  pageNumber: number;
  /** Starting offset in pixels from the top of the document */
  startOffset: number;
  /** Ending offset in pixels from the top of the document */
  endOffset: number;
  /** Height of content on this page */
  contentHeight: number;
}

/**
 * Result of the pagination calculation.
 */
export interface PaginationResult {
  /** Array of page information */
  pages: PageInfo[];
  /** Total number of pages */
  totalPages: number;
  /** Total content height in pixels */
  totalContentHeight: number;
}

/**
 * Options for the pagination calculator.
 */
export interface PaginationOptions {
  /** Maximum height for content per page (in pixels) */
  contentHeightPerPage: number;
  /** Debounce delay in milliseconds */
  debounceMs?: number;
}
