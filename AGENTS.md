# AGENTS.md — 5C Network HTML Tool Framework

> **Version:** 1.0  
> **Owner:** S Shreekara Upadhyaya — Senior Accountant, Finance & Accounts, 5C Network  
> **Purpose:** This file defines the architecture, naming conventions, coding standards, and rules for all standalone HTML tools built under the 5C Network HTML Tool Framework.

---

## 1. STRUCTURE RULES

### Folder Layout

```
framework/
├── index.html            ← Base template (copy & rename per tool)
├── css/
│   ├── base.css          ← Shared styles — DO NOT EDIT per tool
│   └── {tool-slug}.css   ← Tool-specific overrides (optional)
├── js/
│   ├── base.js           ← Reusable ToolKit module — DO NOT EDIT per tool
│   └── {tool-slug}.js    ← Tool-specific logic (REQUIRED)
├── docs/
│   ├── AGENTS.md          ← This file
│   └── PROMPT_TEMPLATE.md ← AI prompt template for new tools
└── tools/
    └── {tool-slug}/       ← Production-ready single-file HTML per tool
```

### Single-File Build Rule

- During **development**, use the modular structure above.
- For **deployment**, each tool MUST be compiled into a **single self-contained HTML file** (inline all CSS + JS + base64 logos).
- No external file dependencies allowed in production builds.

---

## 2. NAMING CONVENTIONS

| Item | Convention | Example |
|---|---|---|
| Tool slug | `kebab-case` | `credit-card-tally-converter` |
| HTML file | `Tool_-_{Name}.html` | `Tool_-_PDF_Merge_Split_Convert.html` |
| JS functions | `camelCase` | `processData()`, `downloadTallyPush()` |
| JS constants | `UPPER_SNAKE_CASE` | `CREDIT_CARD_MAPPING` |
| CSS classes | `kebab-case` | `.section-title`, `.btn-primary` |
| CSS variables | `--kebab-case` | `--brand-red`, `--card-bg` |
| IDs | `camelCase` | `#processBtn`, `#statsGrid` |
| Section IDs | `camelCase` + `Section` suffix | `#uploadSection`, `#exportSection` |

---

## 3. UI CONSISTENCY RULES

### Brand Identity

- **Primary gradient:** `linear-gradient(90deg, #cb0000 0%, #cb0000 70%, #0d5191 85%, #0070bf 100%)`
- **Dark theme** is the default for all tools.
- The **5C Network logo** must appear in the header of every tool.
- All tools must use `base.css` as the foundation. Tool-specific CSS goes in a separate file.

### Layout Structure

Every tool MUST follow this section flow:

1. **Header** — Logo + Tool Name + Description
2. **Upload Section** — Drag-and-drop file upload area
3. **Configuration Section** (optional) — Tool-specific settings/inputs
4. **Processing Progress** — Progress bar during computation
5. **Stats/Summary Section** — Key metrics after processing
6. **Preview Section** (optional) — Table preview of output data
7. **Export Section** — Download button(s) + Reset button

### Component Library

Reuse these classes from `base.css`:

| Component | Class(es) |
|---|---|
| Section card | `.section`, `.section-title` |
| File upload | `.file-upload-area`, `.file-input`, `.file-input-label` |
| Button | `.btn .btn-primary`, `.btn .btn-success`, `.btn .btn-warning` |
| Progress | `.progress-bar`, `.progress-fill` |
| Stats grid | `.stats-grid`, `.stat-card`, `.stat-label`, `.stat-value` |
| Table | `.preview-table-wrapper`, `.preview-table` |
| Toast | `.toast-msg .toast-success`, `.toast-error`, `.toast-warning` |
| Info box | `.info-box`, `.info-box-title`, `.info-box-text` |
| Badge | `.badge .badge-success`, `.badge-error` |
| Form | `.form-group`, `.form-row` |
| Hidden | `.hidden` |

---

## 4. JAVASCRIPT ARCHITECTURE RULES

### Base Module (`js/base.js`)

- Provides `ToolKit` — a frozen utility module.
- Contains reusable functions for file I/O, Excel, dates, validation, and UI rendering.
- **NEVER modify `base.js` for a specific tool.**

### Tool Module (`js/{tool-slug}.js`)

- Contains ALL tool-specific logic.
- Must follow this structure:

```javascript
(function () {
    'use strict';

    // --- STATE ---
    let rawData = null;
    let processedData = [];

    // --- INIT ---
    function init() {
        ToolKit.initFileUpload('dropZone', 'fileInput', handleFile);
        document.getElementById('processBtn').addEventListener('click', process);
        document.getElementById('downloadBtn')?.addEventListener('click', download);
        document.getElementById('resetBtn')?.addEventListener('click', reset);
    }

    // --- FILE HANDLER ---
    async function handleFile(file) {
        // Validate extension
        // Read file
        // Parse data
        // Enable process button
    }

    // --- PROCESSING ---
    async function process() {
        ToolKit.show('progressSection');
        ToolKit.updateProgress(0, 'Starting...');
        try {
            // Step 1: ...
            // Step 2: ...
            // Show results
        } catch (err) {
            ToolKit.toast('error', '❌ ' + err.message);
        }
    }

    // --- OUTPUT ---
    function download() {
        ToolKit.downloadExcel(processedData, 'Output_' + ToolKit.today() + '.xlsx');
        ToolKit.toast('success', '✅ File downloaded!');
    }

    // --- RESET ---
    function reset() {
        if (confirm('Reset and process another file?')) location.reload();
    }

    // --- BOOT ---
    document.addEventListener('DOMContentLoaded', init);
})();
```

### Error Handling

- Wrap all async operations in `try/catch`.
- Use `ToolKit.toast('error', message)` for user-facing errors.
- Log detailed errors to `console.error()`.

---

## 5. VALIDATION STANDARDS

| Rule | Implementation |
|---|---|
| File type check | `ToolKit.validateFileExtension(file, ['.xlsx', '.xls'])` |
| Empty value check | `ToolKit.isEmpty(val)` |
| Numeric parsing | `ToolKit.parseNum(val)` — handles commas, whitespace |
| Date parsing | `ToolKit.excelDateToJS(serial)` |
| Required fields | Check before enabling Process button |
| Output verification | Compare input totals vs output totals where applicable |

---

## 6. EXPORT / DOWNLOAD STANDARDS

- Use `ToolKit.downloadExcel()` for key-value row exports.
- Use `ToolKit.downloadExcelAOA()` for array-of-arrays exports (with column widths).
- File names must follow: `{ToolName}_{DD-MM-YYYY}.xlsx`
- Always show a success toast after download.
- Always provide a **Reset / Process Another** button alongside the download button.

---

## 7. EXTERNAL LIBRARY POLICY

Only these CDN libraries are approved:

| Library | CDN | Use Case |
|---|---|---|
| SheetJS (xlsx) | `cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js` | Excel read/write |
| PapaParse | `cdnjs.cloudflare.com/ajax/libs/PapaParse/5.4.1/papaparse.min.js` | CSV parsing |
| PDF-lib | `cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js` | PDF manipulation |
| PDF.js | `cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js` | PDF text extraction |
| ExcelJS | `cdnjs.cloudflare.com/ajax/libs/exceljs/4.4.0/exceljs.min.js` | Styled Excel output |

Only include the libraries your tool actually needs.

---

## 8. PERFORMANCE GUIDELINES

- Prefer streaming / chunked processing for files > 5 MB.
- Use `setTimeout(..., 0)` or `requestAnimationFrame` to yield back to the UI between heavy processing steps.
- Avoid loading the full file into memory when streaming is possible.
- Keep DOM updates batched — build HTML strings, then assign `.innerHTML` once.

---

## 9. TESTING CHECKLIST

Before shipping any tool:

- [ ] File upload works (click + drag-and-drop)
- [ ] Invalid file type shows error toast
- [ ] Empty file shows error toast
- [ ] Progress bar animates during processing
- [ ] Stats/summary section shows correct totals
- [ ] Preview table renders correctly (first 5–10 rows)
- [ ] Download produces a valid, openable file
- [ ] Reset button reloads cleanly
- [ ] Works on Chrome, Edge, Firefox
- [ ] Mobile-responsive layout (test at 375px width)

---
