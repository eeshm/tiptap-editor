/**
 * Pagination calculator - Core logic for determining page breaks.
 * 
 * This module calculates where page breaks should occur based on
 * actual DOM measurements. The algorithm:
 * 
 * 1. Measure all block-level elements
 * 2. Accumulate heights until we exceed the page height
 * 3. Mark a page break and start a new page
 * 4. Repeat until all content is paginated
 * 
 * Important: This is a VIEW-LAYER concern only. We do NOT modify
 * the ProseMirror document or schema. The pagination is purely visual.
 */

import { CONTENT_HEIGHT_PX } from './constants';
import { measureBlocks, getTotalContentHeight } from './measure';
import { PageInfo, PaginationResult } from './types';

/**
 * Calculates page breaks based on actual DOM measurements.
 * 
 * @param editorElement - The ProseMirror editor DOM element
 * @param contentHeightPerPage - Maximum content height per page (default: CONTENT_HEIGHT_PX)
 * @returns PaginationResult with page information
 */
export function calculatePagination(
  editorElement: HTMLElement | null,
  contentHeightPerPage: number = CONTENT_HEIGHT_PX
): PaginationResult {
  // Handle null editor (not yet mounted)
  if (!editorElement) {
    return {
      pages: [createEmptyPage(1)],
      totalPages: 1,
      totalContentHeight: 0,
    };
  }

  const totalHeight = getTotalContentHeight(editorElement);
  
  // If no content or very little content, return single page
  if (totalHeight <= 0) {
    return {
      pages: [createEmptyPage(1)],
      totalPages: 1,
      totalContentHeight: 0,
    };
  }

  const blocks = measureBlocks(editorElement);
  const pages: PageInfo[] = [];
  
  let currentPageNumber = 1;
  let currentPageStartOffset = 0;
  let accumulatedHeight = 0;
  
  // Process each block
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    
    // Check if adding this block would exceed the page height
    if (accumulatedHeight + block.height > contentHeightPerPage && accumulatedHeight > 0) {
      // Finalize the current page
      pages.push({
        pageNumber: currentPageNumber,
        startOffset: currentPageStartOffset,
        endOffset: block.offsetTop,
        contentHeight: accumulatedHeight,
      });
      
      // Start a new page
      currentPageNumber++;
      currentPageStartOffset = block.offsetTop;
      accumulatedHeight = 0;
    }
    
    // Add block height to current page
    // Note: We use the block's actual height, which handles the case
    // where a single block is taller than the page (it will span pages)
    accumulatedHeight += block.height;
  }
  
  // Add the final page (there's always at least one page)
  pages.push({
    pageNumber: currentPageNumber,
    startOffset: currentPageStartOffset,
    endOffset: totalHeight,
    contentHeight: accumulatedHeight,
  });
  
  // Ensure we always have at least one page
  if (pages.length === 0) {
    pages.push(createEmptyPage(1));
  }
  
  return {
    pages,
    totalPages: pages.length,
    totalContentHeight: totalHeight,
  };
}

/**
 * Creates an empty page placeholder.
 * Used when there's no content or the editor isn't mounted.
 */
function createEmptyPage(pageNumber: number): PageInfo {
  return {
    pageNumber,
    startOffset: 0,
    endOffset: 0,
    contentHeight: 0,
  };
}

/**
 * Determines the page number for a given vertical offset.
 * Useful for showing "Page X of Y" in the UI.
 * 
 * @param offset - Vertical offset in pixels
 * @param pages - Array of page information
 * @returns Page number (1-indexed)
 */
export function getPageAtOffset(offset: number, pages: PageInfo[]): number {
  for (const page of pages) {
    if (offset >= page.startOffset && offset < page.endOffset) {
      return page.pageNumber;
    }
  }
  return pages.length > 0 ? pages[pages.length - 1].pageNumber : 1;
}
