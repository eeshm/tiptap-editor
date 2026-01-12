# Paginated Document Editor

A **Tiptap-based rich text editor** with real-time pagination that visually displays content as A4 pages with proper margins — exactly as they would appear when printed.

![Editor Preview](./docs/preview.png)

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open in browser
open http://localhost:3000
```

## Features

- ✅ **Real-time pagination** — Page breaks update dynamically as you type
- ✅ **A4 page dimensions** — Accurate 8.27" × 11.69" pages at 96 DPI
- ✅ **1-inch margins** — Standard document margins on all sides
- ✅ **Google Docs-like appearance** — White pages with shadows, clear separation
- ✅ **DOM-based measurement** — Pagination based on actual rendered content height
- ✅ **Rich text support** — Paragraphs, headings, bold, italic, lists, tables

---

## How Pagination Works

### Overview

The pagination system operates as a **view-layer concern only**. The underlying ProseMirror document remains continuous and unmodified. Page breaks are calculated and rendered visually without altering the editor schema.

### Step-by-Step Process

1. **Editor Renders Content**
   - Tiptap (ProseMirror) renders the document as a continuous flow of HTML
   - All content exists in a single editor instance

2. **DOM Measurement Phase**
   - After each content update, we query all block-level elements (`p`, `h1-h6`, `ul`, `ol`, `table`, etc.)
   - Using `getBoundingClientRect()`, we measure each element's height relative to the editor container
   - All measurements are batched in a single read operation to minimize layout thrashing

3. **Page Break Calculation**
   - Starting from the first block, we accumulate heights
   - When accumulated height exceeds the content area height (~930px for A4 with 1" margins), we mark a page break
   - Continue until all blocks are assigned to pages

4. **Visual Rendering**
   - Page containers (white backgrounds with shadows) are rendered behind the editor content
   - Editor content is positioned over the page containers with proper margins
   - Page numbers are displayed at the bottom of each page

5. **Recalculation Strategy**
   - Content changes trigger a debounced recalculation (100ms default)
   - `requestAnimationFrame` ensures we measure after layout is complete
   - Window resize also triggers recalculation

### Code Flow

```
User Types → Editor Update Event
                    ↓
         Debounce Timer (100ms)
                    ↓
         requestAnimationFrame
                    ↓
         measureBlocks() — Query all block elements
                    ↓
         calculatePagination() — Accumulate heights, find breaks
                    ↓
         setState(paginationResult) — Update React state
                    ↓
         Re-render pages with new breaks
```

---

## Why DOM Measurement?

### The Problem with Other Approaches

| Approach | Why It Fails |
|----------|--------------|
| **Character count** | Font size, bold text, and different fonts affect character width |
| **Line count** | Headings, margins, and inline formatting break assumptions |
| **Node count** | A paragraph with 100 words vs 10 words has vastly different heights |
| **CSS `page-break`** | Only works for print, not screen display |

### Why DOM Measurement Works

- **Accurate**: Measures what's actually rendered, including all CSS effects
- **Reliable**: Handles mixed content (headings, lists, tables) correctly
- **Future-proof**: Works with any content type without modification
- **Print fidelity**: Screen matches print output because both use the same rendering

### Performance Considerations

Measuring the DOM can cause layout thrashing if done incorrectly. Our approach:

1. **Batch reads**: All `getBoundingClientRect()` calls happen in one frame
2. **Debounce updates**: Rapid typing doesn't trigger excessive recalculations
3. **RAF timing**: Measurements occur after layout is complete
4. **Minimal writes**: Pagination state updates are batched

---

## Architecture

### File Structure

```
src/
├── app/
│   ├── page.tsx          # Main page with editor
│   ├── layout.tsx        # Root layout with metadata
│   └── globals.css       # Global styles + print styles
├── components/
│   └── editor/
│       ├── DocumentEditor.tsx   # Main editor component
│       ├── PaginatedEditor.tsx  # Pagination wrapper + styles
│       ├── Toolbar.tsx          # Formatting toolbar
│       └── Page.tsx             # Visual page container
├── hooks/
│   └── usePagination.ts  # Pagination state + recalculation
└── lib/
    └── pagination/
        ├── constants.ts  # Page dimensions (A4, margins)
        ├── types.ts      # TypeScript interfaces
        ├── measure.ts    # DOM measurement utilities
        ├── calculator.ts # Page break algorithm
        └── index.ts      # Module exports
```

### Key Design Decisions

#### 1. Single Continuous Editor
The ProseMirror document is never modified for pagination. This ensures:
- Normal undo/redo behavior
- Correct copy/paste
- Consistent cursor movement
- Easy export to other formats

#### 2. View-Layer Pagination
Page breaks are purely visual. The pagination code:
- Never inserts nodes into the document
- Never modifies the schema
- Only renders visual overlays

#### 3. Separation of Concerns
```
Document Model (ProseMirror) → Pagination Logic → Visual Layer (React)
         ↓                            ↓                    ↓
   Content changes           Calculate breaks        Render pages
```

---

## Page Dimensions

Based on standard A4 paper size with CSS pixel density (96 DPI):

| Dimension | Value (inches) | Value (pixels) |
|-----------|----------------|----------------|
| Page width | 8.27" | 794px |
| Page height | 11.69" | 1122px |
| Margins | 1" | 96px |
| Content width | 6.27" | 602px |
| Content height | 9.69" | 930px |

These values are defined in `src/lib/pagination/constants.ts` and can be easily modified for different paper sizes.

---

## Supported Content Types

| Content | Support Level | Notes |
|---------|---------------|-------|
| Paragraphs | ✅ Full | Standard text blocks |
| Headings (H1-H3) | ✅ Full | With appropriate sizing |
| Bold / Italic | ✅ Full | Inline formatting |
| Bullet lists | ✅ Full | With proper indentation |
| Numbered lists | ✅ Full | With automatic numbering |
| Tables | ✅ Full | With headers, resizable |
| Blockquotes | ✅ Full | With styling |
| Code blocks | ✅ Full | With syntax styling |

---

## Known Trade-offs & Limitations

### Current Limitations

1. **Block-level pagination only**
   - Page breaks occur between blocks, not within paragraphs
   - A very long paragraph won't split mid-sentence
   - *Improvement*: Could implement word-level splitting with CSS clipping

2. **No widow/orphan control**
   - A heading might appear at the bottom of a page without following content
   - *Improvement*: Add lookahead logic to keep headings with content

3. **Table spanning**
   - Large tables that exceed page height aren't split
   - *Improvement*: Implement table row-level measurement and splitting

4. **Performance with very large documents**
   - Measuring 100+ blocks on every keystroke could lag
   - *Improvement*: Implement incremental measurement (only measure changed sections)

5. **Image support**
   - Images aren't currently supported
   - *Improvement*: Add image extension and measure image heights

### Design Trade-offs

| Trade-off | Chosen Approach | Alternative |
|-----------|-----------------|-------------|
| Accuracy vs. Performance | DOM measurement (accurate) | Estimation (faster but wrong) |
| Debounce delay | 100ms (balanced) | 0ms (instant but heavy) |
| Block granularity | Block-level breaks | Character-level (more complex) |

---

## Edge Cases

### Long Paragraphs

A paragraph that exceeds the page height will overflow onto the next page visually. The calculation marks the page break before the block, so content naturally flows.

**Current behavior**: The long paragraph appears on a page and extends beyond the page boundary.

**Ideal behavior**: Split at word level with proper hyphenation.

### Tables

Tables are measured as single blocks. If a table exceeds page height, it will span pages visually but the page break won't occur mid-row.

**Workaround**: Use shorter tables or split content into multiple tables.

### Rapid Editing

Fast typing triggers many editor updates. The debounce mechanism batches these into ~10 recalculations per second maximum (100ms debounce).

### Empty Document

An empty document still shows one page (correct behavior for a document editor).

---

## Future Improvements

With more time, I would add:

### High Priority
1. **Widow/orphan protection** — Never leave a heading alone at page bottom
2. **Table row splitting** — Split large tables across pages at row boundaries
3. **Image support** — Full image extension with measurement

### Medium Priority
4. **Incremental pagination** — Only re-measure changed sections
5. **Page navigation** — Click to jump to specific pages
6. **Scroll sync** — Highlight current page in a sidebar

### Nice to Have
7. **PDF export** — Generate PDF from paginated content
8. **DOCX export** — Export to Word format
9. **Headers/footers** — Repeating content on each page
10. **Multi-column layouts** — Support for newspaper-style columns

---

## Development

### Running Tests

```bash
npm test
```

### Building for Production

```bash
npm run build
npm start
```

### Code Quality

```bash
npm run lint
```

---

## Tech Stack

- **Next.js 15** — React framework with App Router
- **React 18** — UI library
- **Tailwind CSS 4** — Utility-first CSS
- **Tiptap** — Headless rich text editor (built on ProseMirror)
- **TypeScript** — Type safety

---

## License

MIT

---

## Acknowledgments

- [Tiptap](https://tiptap.dev/) — Excellent headless editor framework
- [ProseMirror](https://prosemirror.net/) — Powerful editing foundation
- [Google Docs](https://docs.google.com/) — Pagination UX inspiration
