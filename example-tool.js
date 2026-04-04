/* ============================================================
   Tool-specific JS: example-tool
   Demonstrates the standard module pattern for a new tool.
   ============================================================ */

(function () {
    'use strict';

    // -------------------------------------------------------
    //  STATE
    // -------------------------------------------------------
    let rawData = null;        // Parsed input data
    let processedData = [];    // Transformed output data

    // -------------------------------------------------------
    //  CONSTANTS (hard-coded mappings, config defaults, etc.)
    // -------------------------------------------------------
    const ALLOWED_EXTENSIONS = ['.xlsx', '.xls'];

    const DEFAULT_CONFIG = {
        defaultLedger: 'Suspense A/c',
        voucherType: 'Journal'
    };

    // -------------------------------------------------------
    //  INIT
    // -------------------------------------------------------
    function init() {
        // Wire up file upload (drag-and-drop + click)
        ToolKit.initFileUpload('dropZone', 'fileInput', handleFile);

        // Wire up buttons
        document.getElementById('processBtn')
            .addEventListener('click', process);

        document.getElementById('downloadBtn')
            ?.addEventListener('click', download);

        document.getElementById('resetBtn')
            ?.addEventListener('click', reset);
    }

    // -------------------------------------------------------
    //  FILE HANDLER
    // -------------------------------------------------------
    async function handleFile(file) {
        // 1. Validate file type
        if (!ToolKit.validateFileExtension(file, ALLOWED_EXTENSIONS)) {
            ToolKit.toast('error', '❌ Invalid file type. Please upload .xlsx or .xls');
            return;
        }

        // 2. Show file name
        document.getElementById('fileName').textContent = '📊 ' + file.name;

        try {
            // 3. Read & parse
            const buffer = await ToolKit.readFileAsArrayBuffer(file);
            rawData = ToolKit.parseExcel(buffer);

            if (!rawData || rawData.length === 0) {
                throw new Error('No data found in the file.');
            }

            // 4. Enable process button
            document.getElementById('processBtn').disabled = false;
            ToolKit.toast('success', `✔ ${rawData.length} rows loaded. Ready to process.`);

        } catch (err) {
            ToolKit.toast('error', '❌ ' + err.message);
        }
    }

    // -------------------------------------------------------
    //  PROCESSING
    // -------------------------------------------------------
    async function process() {
        document.getElementById('processBtn').disabled = true;
        ToolKit.show('progressSection');
        ToolKit.updateProgress(0, 'Starting...');

        try {
            // Step 1: Transform data
            ToolKit.updateProgress(30, 'Transforming data...');
            processedData = transformData(rawData);

            // Step 2: Validate output
            ToolKit.updateProgress(60, 'Validating...');
            const stats = validate(processedData);

            // Step 3: Render results
            ToolKit.updateProgress(100, 'Done!');
            showResults(stats);

        } catch (err) {
            ToolKit.toast('error', '❌ Processing error: ' + err.message);
            document.getElementById('processBtn').disabled = false;
        }
    }

    // -------------------------------------------------------
    //  DATA TRANSFORMATION (tool-specific logic goes here)
    // -------------------------------------------------------
    function transformData(data) {
        return data.map(row => {
            // Example: map input columns to output columns
            return {
                'DATE':        ToolKit.formatDate(ToolKit.excelDateToJS(row['Date'])),
                'DESCRIPTION': row['Description'] || '',
                'AMOUNT':      ToolKit.parseNum(row['Amount']),
                'LEDGER':      DEFAULT_CONFIG.defaultLedger
            };
        }).filter(row => row.AMOUNT !== 0); // Skip zero-amount rows
    }

    // -------------------------------------------------------
    //  VALIDATION
    // -------------------------------------------------------
    function validate(data) {
        const total = data.reduce((sum, r) => sum + Math.abs(r.AMOUNT), 0);
        return {
            rowCount: data.length,
            totalAmount: total,
            status: data.length > 0 ? 'Valid' : 'Empty'
        };
    }

    // -------------------------------------------------------
    //  RENDER RESULTS
    // -------------------------------------------------------
    function showResults(stats) {
        // Stats cards
        ToolKit.renderStats('statsGrid', [
            { label: 'Rows Processed', value: stats.rowCount },
            { label: 'Total Amount',   value: ToolKit.formatINR(stats.totalAmount) },
            { label: 'Status',         value: stats.status, color: stats.status === 'Valid' ? '#38ef7d' : '#f5576c' }
        ]);
        ToolKit.show('statsSection');

        // Preview table (first 10 rows)
        ToolKit.renderTable('previewTable', processedData, [
            { key: 'DATE',        label: 'Date' },
            { key: 'DESCRIPTION', label: 'Description' },
            { key: 'AMOUNT',      label: 'Amount', formatter: ToolKit.formatINR },
            { key: 'LEDGER',      label: 'Ledger' }
        ], 10);
        ToolKit.show('previewSection');

        // Export section
        ToolKit.show('exportSection');
    }

    // -------------------------------------------------------
    //  DOWNLOAD
    // -------------------------------------------------------
    function download() {
        if (!processedData.length) {
            ToolKit.toast('error', '❌ No data to export.');
            return;
        }
        const fileName = `Example_Tool_${ToolKit.today()}.xlsx`;
        ToolKit.downloadExcel(processedData, fileName, 'Output');
        ToolKit.toast('success', '✅ File downloaded!');
    }

    // -------------------------------------------------------
    //  RESET
    // -------------------------------------------------------
    function reset() {
        if (confirm('Reset and process another file?')) {
            location.reload();
        }
    }

    // -------------------------------------------------------
    //  BOOT
    // -------------------------------------------------------
    document.addEventListener('DOMContentLoaded', init);

})();
