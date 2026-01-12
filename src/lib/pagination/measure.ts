/**
 * DOM measurement utilities for pagination.
 * 
 * This module handles all DOM measurements needed to calculate page breaks.
 * We measure actual rendered heights, NOT estimated heights based on line counts
 * or character counts, to ensure accurate pagination.
 * 
 * Key principle: Pagination must match what would appear on a printed page,
 * so we measure the actual rendered content.
 */

import { MeasuredBlock } from './types';

/**
 * Block-level element selectors that we measure for pagination.
 * These are the elements that can cause page breaks.
 * 
 * Note: We target direct ProseMirror block elements. Inline elements
 * (bold, italic, etc.) are part of their parent blocks and don't affect
 * pagination directly.
 */
const BLOCK_SELECTORS = [
  'p',           // Paragraphs
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',  // Headings
  'ul', 'ol',    // Lists (measured as a whole)
  'blockquote',  // Blockquotes
  'pre',         // Code blocks
  'table',       // Tables
  'hr',          // Horizontal rules
].join(', ');

/**
 * Measures all block-level elements within the editor container.
 * 
 * This function performs a single layout read to minimize layout thrashing.
 * All measurements are batched together.
 * 
 * @param editorElement - The ProseMirror editor DOM element
 * @returns Array of measured blocks with their heights and positions
 */
export function measureBlocks(editorElement: HTMLElement): MeasuredBlock[] {
  const blocks: MeasuredBlock[] = [];
  
  // Get the editor's bounding rect once (minimizes layout reads)
  const editorRect = editorElement.getBoundingClientRect();
  
  // Query all block-level elements that are direct children of the editor
  // or within the prosemirror content area
  const blockElements = editorElement.querySelectorAll(BLOCK_SELECTORS);
  
  // Batch all measurements in a single frame
  blockElements.forEach((element, index) => {
    const htmlElement = element as HTMLElement;
    const rect = htmlElement.getBoundingClientRect();
    
    // Calculate offset relative to the editor container
    const offsetTop = rect.top - editorRect.top;
    
    blocks.push({
      element: htmlElement,
      height: rect.height,
      offsetTop: offsetTop,
      id: `block-${index}-${offsetTop.toFixed(0)}`,
    });
  });
  
  return blocks;
}

/**
 * Gets the total content height of the editor.
 * 
 * @param editorElement - The ProseMirror editor DOM element
 * @returns Total scrollable height of the content
 */
export function getTotalContentHeight(editorElement: HTMLElement): number {
  return editorElement.scrollHeight;
}

/**
 * Checks if an element is visible (not hidden by CSS).
 * Useful for filtering out collapsed or hidden blocks.
 * 
 * @param element - DOM element to check
 * @returns true if the element is visible
 */
export function isElementVisible(element: HTMLElement): boolean {
  const style = window.getComputedStyle(element);
  return style.display !== 'none' && style.visibility !== 'hidden';
}
