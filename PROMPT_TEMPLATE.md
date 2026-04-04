# PROMPT_TEMPLATE.md — AI Prompt for Generating New 5C Network HTML Tools

> Copy the prompt below, fill in the `{{ }}` placeholders, and give it to Claude/ChatGPT to generate a new tool that follows the framework.

---

## PROMPT

```
You are acting as a senior full-stack developer and UI architect.

I have an existing HTML Tool Framework for building standalone, single-file, browser-based finance/accounting tools for 5C Network (India) Private Limited.

### FRAMEWORK RULES (mandatory — follow exactly):

**Brand & Theme:**
- Dark theme. Background: #0a0f1a. Card bg: #1e1e1e / #262626.
- Brand gradient: linear-gradient(90deg, #cb0000 0%, #cb0000 70%, #0d5191 85%, #0070bf 100%).
- 5C Network logo in header (white bg pill container).
- Font: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif.

**Layout Structure (every tool must have):**
1. Header — logo + tool name + one-line description
2. Upload Section — drag-and-drop + browse button. Show file name after selection.
3. Config Section (if needed) — form inputs for settings.
4. Progress Section — progress bar shown during processing.
5. Stats Section — stat cards grid showing key metrics after processing.
6. Preview Section — HTML table showing first 5–10 rows of output.
7. Export Section — Download button + Reset button.

**CSS Classes to use:**
- `.container`, `.header`, `.header-inner`, `.logo-box`, `.header-title`, `.header-sub`
- `.main-content`, `.section`, `.section-title`
- `.file-upload-area`, `.file-input`, `.file-input-label`, `.file-name-display`
- `.btn .btn-primary`, `.btn .btn-success`, `.btn .btn-warning`
- `.progress-bar`, `.progress-fill`
- `.stats-grid`, `.stat-card`, `.stat-label`, `.stat-value`
- `.preview-table-wrapper`, `.preview-table`
- `.toast-msg .toast-success / .toast-error / .toast-warning`
- `.info-box`, `.form-group`, `.form-row`
- `.hidden` for show/hide toggling
- `.action-buttons` for button groups

**JavaScript Architecture:**
- Use an IIFE module pattern for tool logic.
- Reuse ToolKit functions: `ToolKit.initFileUpload()`, `ToolKit.readFileAsArrayBuffer()`, `ToolKit.parseExcel()`, `ToolKit.downloadExcel()`, `ToolKit.toast()`, `ToolKit.show()`, `ToolKit.hide()`, `ToolKit.updateProgress()`, `ToolKit.renderTable()`, `ToolKit.renderStats()`, `ToolKit.formatINR()`, `ToolKit.formatDate()`, `ToolKit.excelDateToJS()`, `ToolKit.parseNum()`, `ToolKit.isEmpty()`, `ToolKit.validateFileExtension()`.

**Export Rules:**
- File name format: `{ToolName}_{DD-MM-YYYY}.xlsx`
- Show success toast after download.
- Always have a Reset button.

**Approved CDN Libraries (include only what's needed):**
- SheetJS: https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js
- PapaParse: https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.4.1/papaparse.min.js
- PDF-lib: https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js
- PDF.js: https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js
- ExcelJS: https://cdnjs.cloudflare.com/ajax/libs/exceljs/4.4.0/exceljs.min.js

### DELIVERABLE:
Build a **single self-contained HTML file** (inline all CSS + JS) for the following tool:

---

**Tool Name:** {{ TOOL_NAME }}

**Tool Description (one line):** {{ TOOL_DESCRIPTION }}

**Input File Type:** {{ .xlsx / .xls / .csv / .pdf / multiple }}

**Input File Structure:**
{{ Describe columns/fields in the input file. Be specific about column names, data types, and any header row positions. }}

**Processing Logic:**
{{ Step-by-step description of what the tool should do:
  - Step 1: ...
  - Step 2: ...
  - Step 3: ...
  Be extremely specific. Include formulas, mappings, edge cases, and validation rules. }}

**Output File Structure:**
{{ Describe the exact columns/fields expected in the output Excel file. Include column names, data types, and any formatting requirements. }}

**Configuration Inputs (if any):**
{{ List any user-configurable settings, e.g.:
  - Default ledger name (text input, default: "Suspense A/c")
  - Date format (dropdown: DD-MM-YYYY / MM-DD-YYYY)
}}

**Validation Rules:**
{{ List input validation and output verification rules:
  - Input total must match output total
  - All dates must be valid
  - No empty mandatory fields
}}

**Stats to Display After Processing:**
{{ List the stat cards to show, e.g.:
  - Total Rows Processed
  - Total Debit Amount
  - Total Credit Amount
  - Validation Status (Matched / Mismatch)
}}

**Preview Table Columns:**
{{ List which columns to show in the preview table, e.g.:
  - Date, Description, Debit, Credit, Ledger Name
}}

**Edge Cases:**
{{ List known edge cases, e.g.:
  - Rows with zero amounts should be skipped
  - Duplicate reference numbers should be merged
  - Foreign currency entries need special handling
}}

**Additional Notes:**
{{ Any other requirements, e.g.:
  - Hard-coded mappings (provide the mapping table)
  - Keyword-based auto-matching logic
  - Special column naming conventions for Tally compatibility
}}

---

Generate the complete single-file HTML tool following all the framework rules above.
```

---

## USAGE TIPS

1. **Be extremely specific** in the Processing Logic section. The more detail you give, the fewer iterations you'll need.
2. **Include sample data** if possible — paste 3–5 rows of real input data (anonymized) so the AI understands the structure.
3. **Specify hard-coded mappings** verbatim — don't leave the AI to guess lookup tables.
4. **Test edge cases** immediately after generation — empty files, wrong file types, zero-amount rows.
5. **Iterate fast** — if the first output has bugs, paste the error message back and ask for a fix. Don't rewrite manually.
