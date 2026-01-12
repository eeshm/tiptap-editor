# Paginated Document Editor

A Tiptap-based rich text editor with real-time pagination. Think Google Docs-style page breaks, but built with modern React.

---

## Getting Started

```bash
# Clone and install
git clone https://github.com/eeshm/tiptap-editor.git
cd tiptap-editor
npm install

# Run it
npm run dev

# Open http://localhost:3000
```

Done!

---

## What's Included

- **Real-time pagination** — Pages break automatically as you type
- **A4 page size** — Standard paper dimensions with 1-inch margins
- **Rich text** — Bold, italic, headings (H1-H3), bullet & numbered lists
- **Tables** — Add rows, columns, delete tables
- **Print** — Clean print output via the Print button

---

## How Page Breaks Work

I'm using the [`tiptap-pagination-plus`](https://github.com/RomikMakavana/tiptap-pagination-plus) extension for pagination. Here's the gist:

1. The extension watches the content height as you type
2. When content exceeds the page height (1123px for A4), it inserts a page-break node
3. These breaks are visible in the editor and trigger actual page breaks when printing

**Page dimensions used:**
- Width: 794px (8.27 inches × 96 DPI)
- Height: 1123px (11.69 inches × 96 DPI)  
- Margins: 96px all around (1 inch)

---

## Trade-offs & Limitations

**What I chose:**
- Used `tiptap-pagination-plus` instead of building custom pagination from scratch. It inserts nodes into the document (not purely view-layer), but it works reliably and saved a lot of time.

**Current limitations:**
- Insert node into the document for page break (not purely view-layer)
- Very large tables might not split cleanly across pages
- No image support yet
- No widow/orphan control (headings can end up alone at page bottom)

---

## What I'd Improve

With more time:

1. **Image support** — Add the Tiptap Image extension with proper sizing
2. **PDF export** — Generate downloadable PDFs instead of relying on browser print
3. **Better table handling** — Split large tables across pages with repeated headers
4. **Page navigation** — Jump to specific pages, maybe a thumbnail sidebar
5. **Custom page sizes** — Letter, Legal, etc.

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx        # Main page
│   ├── layout.tsx      # Root layout
│   └── globals.css     # Styles + print styles
└── components/
    └── editor/
        ├── DocumentEditor.tsx   # Editor with pagination
        └── Toolbar.tsx          # Formatting toolbar
```

---

## Tech Stack

- Next.js 15
- React 19
- Tailwind CSS 4
- Tiptap
- tiptap-pagination-plus
- TypeScript

---

## License

MIT
