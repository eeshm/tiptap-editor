/**
 * Pagination module exports.
 * 
 * This module provides all the utilities needed for document pagination:
 * - Constants: Page dimensions, margins, gaps
 * - Types: TypeScript interfaces
 * - Calculator: Core pagination logic
 * - Measure: DOM measurement utilities
 */

// Constants
export {
  CSS_PIXELS_PER_INCH,
  PAGE_WIDTH_INCHES,
  PAGE_HEIGHT_INCHES,
  PAGE_MARGIN_INCHES,
  PAGE_WIDTH_PX,
  PAGE_HEIGHT_PX,
  PAGE_MARGIN_PX,
  CONTENT_WIDTH_PX,
  CONTENT_HEIGHT_PX,
  PAGE_GAP_PX,
  PAGINATION_DEBOUNCE_MS,
} from './constants';

// Types
export type {
  MeasuredBlock,
  PageInfo,
  PaginationResult,
  PaginationOptions,
} from './types';

// Calculator functions
export {
  calculatePagination,
  getPageAtOffset,
} from './calculator';

// Measurement functions
export {
  measureBlocks,
  getTotalContentHeight,
  isElementVisible,
} from './measure';
