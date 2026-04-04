/* ============================================================
   5C Network — HTML Tool Framework: Base JavaScript
   Version : 1.0
   
   Reusable utility functions for all standalone HTML tools.
   ============================================================ */

const ToolKit = (() => {
    'use strict';

    // -----------------------------------------------------------
    //  1. FILE UPLOAD HELPERS
    // -----------------------------------------------------------

    /**
     * Initialize drag-and-drop on an upload zone.
     * @param {string} zoneId   - ID of the drop zone element
     * @param {string} inputId  - ID of the hidden file <input>
     * @param {Function} onFile - Callback receiving the selected File object
     */
    function initFileUpload(zoneId, inputId, onFile) {
        const zone = document.getElementById(zoneId);
        const input = document.getElementById(inputId);
        if (!zone || !input) return;

        zone.addEventListener('click', () => input.click());

        zone.addEventListener('dragover', (e) => {
            e.preventDefault();
            zone.classList.add('dragover');
        });
        zone.addEventListener('dragleave', () => {
            zone.classList.remove('dragover');
        });
        zone.addEventListener('drop', (e) => {
            e.preventDefault();
            zone.classList.remove('dragover');
            if (e.dataTransfer.files.length) onFile(e.dataTransfer.files[0]);
        });

        input.addEventListener('change', (e) => {
            if (e.target.files.length) onFile(e.target.files[0]);
        });
    }

    /**
     * Read a file as ArrayBuffer (for XLSX / PDF).
     * Returns a Promise<Uint8Array>.
     */
    function readFileAsArrayBuffer(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(new Uint8Array(e.target.result));
            reader.onerror = () => reject(new Error('Failed to read file: ' + file.name));
            reader.readAsArrayBuffer(file);
        });
    }

    /**
     * Read a file as text (for CSV / TSV).
     * Returns a Promise<string>.
     */
    function readFileAsText(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = () => reject(new Error('Failed to read file: ' + file.name));
            reader.readAsText(file);
        });
    }

    // -----------------------------------------------------------
    //  2. EXCEL HELPERS (require SheetJS loaded)
    // -----------------------------------------------------------

    /**
     * Parse an Excel file (Uint8Array) to an array of row-objects.
     * @param {Uint8Array} data
     * @param {object} opts - { header: 1 } for array-of-arrays, omit for key-value
     * @returns {Array}
     */
    function parseExcel(data, opts = {}) {
        const workbook = XLSX.read(data, { type: 'array' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        return XLSX.utils.sheet_to_json(sheet, opts);
    }

    /**
     * Download data as an Excel file.
     * @param {Array} rows      - Array of objects (one object per row)
     * @param {string} fileName - Output file name
     * @param {string} sheetName
     */
    function downloadExcel(rows, fileName, sheetName = 'Sheet1') {
        const ws = XLSX.utils.json_to_sheet(rows);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, sheetName);
        XLSX.writeFile(wb, fileName);
    }

    /**
     * Download array-of-arrays as an Excel file.
     */
    function downloadExcelAOA(aoa, fileName, sheetName = 'Sheet1', colWidths) {
        const ws = XLSX.utils.aoa_to_sheet(aoa);
        if (colWidths) ws['!cols'] = colWidths.map(w => ({ wch: w }));
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, sheetName);
        XLSX.writeFile(wb, fileName);
    }

    // -----------------------------------------------------------
    //  3. VALIDATION HELPERS
    // -----------------------------------------------------------

    /** Check if a value is empty / null / undefined. */
    function isEmpty(val) {
        return val === undefined || val === null || val === '';
    }

    /** Parse a numeric string (removes commas, whitespace). */
    function parseNum(val) {
        if (isEmpty(val)) return 0;
        return parseFloat(String(val).replace(/[\s,]/g, '')) || 0;
    }

    /** Validate that a file has an allowed extension. */
    function validateFileExtension(file, allowedExtensions) {
        const ext = '.' + file.name.split('.').pop().toLowerCase();
        return allowedExtensions.includes(ext);
    }

    // -----------------------------------------------------------
    //  4. DATE HELPERS
    // -----------------------------------------------------------

    /**
     * Convert Excel serial date → JS Date.
     */
    function excelDateToJS(serial) {
        if (!serial) return null;
        if (typeof serial === 'string') return new Date(serial);
        if (typeof serial === 'number' && serial > 1000) {
            const epoch = new Date(1900, 0, 1);
            return new Date(epoch.getTime() + (serial - 2) * 86400000);
        }
        return null;
    }

    /**
     * Format a JS Date to DD-MM-YYYY string.
     */
    function formatDate(date, sep = '-') {
        if (!(date instanceof Date) || isNaN(date)) return '';
        const dd = String(date.getDate()).padStart(2, '0');
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const yyyy = date.getFullYear();
        return `${dd}${sep}${mm}${sep}${yyyy}`;
    }

    /**
     * Get today's date formatted as DD-MM-YYYY.
     */
    function today(sep = '-') {
        return formatDate(new Date(), sep);
    }

    // -----------------------------------------------------------
    //  5. UI HELPERS
    // -----------------------------------------------------------

    /** Show / hide an element by ID. */
    function show(id) { document.getElementById(id)?.classList.remove('hidden'); }
    function hide(id) { document.getElementById(id)?.classList.add('hidden'); }

    /** Update progress bar (0–100). */
    function updateProgress(percent, text) {
        const fill = document.getElementById('progressFill');
        const label = document.getElementById('progressText');
        if (fill) fill.style.width = percent + '%';
        if (label) label.textContent = text || (percent + '%');
    }

    /**
     * Show a toast message.
     * @param {'success'|'error'|'warning'|'info'} type
     * @param {string} message
     * @param {number} durationMs
     */
    function toast(type, message, durationMs = 5000) {
        const div = document.createElement('div');
        div.className = `toast-msg toast-${type}`;
        div.innerHTML = message;

        const container = document.querySelector('.main-content');
        if (container) container.prepend(div);

        setTimeout(() => div.remove(), durationMs);
    }

    /**
     * Render a simple HTML table from an array of objects.
     * @param {string} tableId  - ID of the <table> element
     * @param {Array} rows      - Array of row-objects
     * @param {Array} columns   - Array of { key, label, formatter? }
     * @param {number} maxRows  - Limit rows displayed (0 = all)
     */
    function renderTable(tableId, rows, columns, maxRows = 0) {
        const table = document.getElementById(tableId);
        if (!table) return;

        const data = maxRows > 0 ? rows.slice(0, maxRows) : rows;

        let html = '<thead><tr>';
        columns.forEach(col => { html += `<th>${col.label || col.key}</th>`; });
        html += '</tr></thead><tbody>';

        data.forEach(row => {
            html += '<tr>';
            columns.forEach(col => {
                let val = row[col.key] ?? '';
                if (col.formatter) val = col.formatter(val);
                html += `<td>${val}</td>`;
            });
            html += '</tr>';
        });

        html += '</tbody>';
        table.innerHTML = html;
    }

    /**
     * Render stat cards into a stats grid.
     * @param {string} gridId
     * @param {Array} stats - [{ label, value, color? }]
     */
    function renderStats(gridId, stats) {
        const grid = document.getElementById(gridId);
        if (!grid) return;
        grid.innerHTML = stats.map(s => `
            <div class="stat-card">
                <div class="stat-label">${s.label}</div>
                <div class="stat-value" ${s.color ? `style="color:${s.color}"` : ''}>${s.value}</div>
            </div>
        `).join('');
    }

    /**
     * Populate a <select> element with options.
     * @param {string} selectId
     * @param {Array} options - Array of { value, text } or strings
     * @param {string} placeholder - First disabled option text
     */
    function populateSelect(selectId, options, placeholder = '-- Select --') {
        const sel = document.getElementById(selectId);
        if (!sel) return;
        sel.innerHTML = `<option value="">${placeholder}</option>`;
        options.forEach(opt => {
            const o = document.createElement('option');
            if (typeof opt === 'string') {
                o.value = opt;
                o.textContent = opt;
            } else {
                o.value = opt.value;
                o.textContent = opt.text;
            }
            sel.appendChild(o);
        });
    }

    // -----------------------------------------------------------
    //  6. CURRENCY FORMATTER
    // -----------------------------------------------------------

    function formatINR(amount) {
        const num = parseFloat(amount) || 0;
        return '₹' + num.toLocaleString('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }

    // -----------------------------------------------------------
    //  PUBLIC API
    // -----------------------------------------------------------
    return {
        // File
        initFileUpload,
        readFileAsArrayBuffer,
        readFileAsText,
        validateFileExtension,

        // Excel
        parseExcel,
        downloadExcel,
        downloadExcelAOA,

        // Validation
        isEmpty,
        parseNum,

        // Date
        excelDateToJS,
        formatDate,
        today,

        // UI
        show,
        hide,
        updateProgress,
        toast,
        renderTable,
        renderStats,
        populateSelect,

        // Currency
        formatINR
    };
})();
