/**
 * Custom hook for pagination calculations.
 * 
 * This hook manages the pagination state and handles recalculation
 * when the editor content changes. It uses requestAnimationFrame
 * and debouncing to avoid layout thrashing.
 */

'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { Editor } from '@tiptap/react';
import {
  calculatePagination,
  PaginationResult,
  PAGINATION_DEBOUNCE_MS,
} from '@/lib/pagination';

interface UsePaginationOptions {
  /** Debounce delay in milliseconds */
  debounceMs?: number;
}

interface UsePaginationReturn {
  /** Current pagination result */
  pagination: PaginationResult;
  /** Manually trigger recalculation */
  recalculate: () => void;
}

/**
 * Hook to manage pagination for a Tiptap editor.
 * 
 * @param editor - The Tiptap editor instance
 * @param options - Configuration options
 * @returns Pagination state and recalculate function
 */
export function usePagination(
  editor: Editor | null,
  options: UsePaginationOptions = {}
): UsePaginationReturn {
  const { debounceMs = PAGINATION_DEBOUNCE_MS } = options;
  
  const [pagination, setPagination] = useState<PaginationResult>({
    pages: [{ pageNumber: 1, startOffset: 0, endOffset: 0, contentHeight: 0 }],
    totalPages: 1,
    totalContentHeight: 0,
  });
  
  // Refs for debouncing and RAF
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const rafIdRef = useRef<number | null>(null);
  
  /**
   * Performs the actual pagination calculation.
   * Uses requestAnimationFrame to ensure DOM is settled.
   */
  const performCalculation = useCallback(() => {
    if (!editor?.view?.dom) return;
    
    // Cancel any pending RAF
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
    }
    
    // Use RAF to ensure we're measuring after layout
    rafIdRef.current = requestAnimationFrame(() => {
      const editorElement = editor.view.dom as HTMLElement;
      const result = calculatePagination(editorElement);
      setPagination(result);
    });
  }, [editor]);
  
  /**
   * Debounced recalculation function.
   * Called on every editor update but batched for performance.
   */
  const recalculate = useCallback(() => {
    // Clear any pending debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    // Set new debounce timer
    debounceTimerRef.current = setTimeout(() => {
      performCalculation();
    }, debounceMs);
  }, [performCalculation, debounceMs]);
  
  // Subscribe to editor updates
  useEffect(() => {
    if (!editor) return;
    
    // Initial calculation
    performCalculation();
    
    // Listen for content changes
    const updateHandler = () => {
      recalculate();
    };
    
    editor.on('update', updateHandler);
    editor.on('create', updateHandler);
    
    // Also recalculate on window resize
    const resizeHandler = () => recalculate();
    window.addEventListener('resize', resizeHandler);
    
    return () => {
      editor.off('update', updateHandler);
      editor.off('create', updateHandler);
      window.removeEventListener('resize', resizeHandler);
      
      // Cleanup timers
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [editor, performCalculation, recalculate]);
  
  return {
    pagination,
    recalculate,
  };
}
