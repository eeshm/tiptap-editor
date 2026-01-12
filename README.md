# Paginated Document Editor

A **Tiptap-based rich text editor** with real-time pagination using `tiptap-pagination-plus`. Displays content as A4 pages with 1-inch margins — exactly as they would appear when printed.

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
- ✅ **A4 page dimensions** — 794px × 1123px (at 96 DPI)
- ✅ **1-inch margins** — Standard document margins on all sides
- ✅ **Visual page breaks** — Clear separation between pages
- ✅ **Page numbering** — Automatic page number display
- ✅ **Rich text support** — Paragraphs, headings, bold, italic, lists, tables

---

## How It Works

This editor uses the [`tiptap-pagination-plus`](https://github.com/RomikMakavana/tiptap-pagination-plus) extension for automatic pagination.

### Key Features of the Extension:

1. **Automatic page breaks** — Content automatically splits across pages when it exceeds the page height
2. **Configurable dimensions** — Set page width, height, and margins
3. **Header/Footer support** — Add custom content to page headers and footers
4. **Table pagination** — Tables can split across pages correctly

### Configuration

The pagination is configured in `DocumentEditor.tsx`:

```typescript
const PAGINATION_CONFIG = {
  pageHeight: 1123,  // A4 height (11.69" at 96 DPI)
  pageWidth: 794,    // A4 width (8.27" at 96 DPI)
  pageGap: 40,       // Space between pages
  marginTop: 96,     // 1 inch
  marginBottom: 96,  // 1 inch
  marginLeft: 96,    // 1 inch
  marginRight: 96,   // 1 inch
  headerRight: 'Page {page}',
};
```

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx          # Main page
│   ├── layout.tsx        # Root layout
│   └── globals.css       # Global styles
└── components/
    └── editor/
        ├── DocumentEditor.tsx  # Main editor with pagination
        └── Toolbar.tsx         # Formatting toolbar
```

### Key Files

| File | Description |
|------|-------------|
| `DocumentEditor.tsx` | Main editor component with tiptap-pagination-plus integration |
| `Toolbar.tsx` | Formatting toolbar with all editor actions |
| `page.tsx` | Main page wrapper with header |

---

## Supported Content

| Content | Support |
|---------|---------|
| Paragraphs | ✅ |
| Headings (H1-H3) | ✅ |
| Bold / Italic | ✅ |
| Bullet lists | ✅ |
| Numbered lists | ✅ |
| Tables | ✅ |

---

## Page Dimensions

Based on A4 paper at 96 DPI:

| Dimension | Inches | Pixels |
|-----------|--------|--------|
| Page width | 8.27" | 794px |
| Page height | 11.69" | 1123px |
| Margins | 1" | 96px |
| Content width | 6.27" | 602px |
| Content height | 9.69" | 931px |

---

## Tech Stack

- **Next.js 15** — React framework with App Router
- **React 18** — UI library
- **Tailwind CSS 4** — Utility-first CSS
- **Tiptap** — Headless rich text editor
- **tiptap-pagination-plus** — Pagination extension
- **TypeScript** — Type safety

---

## Development

### Available Scripts

```bash
npm run dev     # Start development server
npm run build   # Build for production
npm run start   # Start production server
npm run lint    # Run ESLint
```

---

## Credits

- [Tiptap](https://tiptap.dev/) — Headless editor framework
- [tiptap-pagination-plus](https://github.com/RomikMakavana/tiptap-pagination-plus) — Pagination extension by Romik Makavana
- [ProseMirror](https://prosemirror.net/) — Editor foundation

---

## License

MIT
