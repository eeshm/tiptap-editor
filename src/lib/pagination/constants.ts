/**
 * Page dimension constants for A4 Letter size documents.
 * 
 * These values are based on standard A4 dimensions and CSS inch units
 * to ensure print fidelity. The calculated values assume 96 DPI (standard CSS).
 * 
 * A4 dimensions: 8.27" x 11.69" (210mm x 297mm)
 * US Letter: 8.5" x 11" (for comparison)
 * 
 * We use A4 as specified, with 1-inch margins on all sides.
 */

// Standard CSS pixels per inch (CSS spec defines 1in = 96px)
export const CSS_PIXELS_PER_INCH = 96;

// A4 page dimensions in inches
export const PAGE_WIDTH_INCHES = 8.27;
export const PAGE_HEIGHT_INCHES = 11.69;

// Margin in inches (1 inch on all sides)
export const PAGE_MARGIN_INCHES = 1;

// Calculated pixel values (at 96 DPI)
export const PAGE_WIDTH_PX = PAGE_WIDTH_INCHES * CSS_PIXELS_PER_INCH; // ~794px
export const PAGE_HEIGHT_PX = PAGE_HEIGHT_INCHES * CSS_PIXELS_PER_INCH; // ~1122px
export const PAGE_MARGIN_PX = PAGE_MARGIN_INCHES * CSS_PIXELS_PER_INCH; // 96px

// Content area dimensions (page minus margins)
export const CONTENT_WIDTH_PX = PAGE_WIDTH_PX - (PAGE_MARGIN_PX * 2); // ~602px
export const CONTENT_HEIGHT_PX = PAGE_HEIGHT_PX - (PAGE_MARGIN_PX * 2); // ~930px

// Gap between pages (visual separator)
export const PAGE_GAP_PX = 24;

// Debounce delay for pagination recalculation (in milliseconds)
// This prevents excessive recalculations during rapid typing
export const PAGINATION_DEBOUNCE_MS = 100;
