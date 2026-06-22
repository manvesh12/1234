/* ANNEXURE II - MINING LEASES */
const ANNEXURE_2_TABLES = {
  LEASES: {
    tableId: 'anx2-leases',
    containerId: 'anx2-leases-container',
    filename: 'Annexure_II_Leases_Template.csv',
    headers: ['Sl. No.', 'River Details', 'Sand Bar Code', 'Lease Details', 'Area (Ha)', 'Latitude', 'Longitude', 'Distance from PA/WC (KM)', 'Within 500m? (Cluster Area)', 'Bulk Density (gm/cc)', 'Depth of Deposit (m)', 'Total Excavation (MT/YR)', 'Total Excavation (Net 60%)', 'Mineral', 'Existing/Proposed', 'Remarks'],
    emptyRow: ['', '', '', '', '0', '', '', '', '', '1.54', '1.74', '0.00', '0.00', 'Sand', '<select><option>Existing</option><option>Proposed</option></select>', '', null],
    addLabel: 'Add Lease',
    uploadLabel: 'Upload Excel (Leases)',
    minWidth: '1400px',
    pdfTitle: '> a) Potential Mining Leases (Existing & Proposed) Rivers:',
    fontSize: 7.5
  },
  PATTA_SECTION_B: {
    tableId: 'anx2-patta',
    containerId: 'anx2-patta-container',
    filename: 'Annexure_II_Patta_Lands_Template.csv',
    headers: ['Sl.no', 'Owner', 'Sy.No (Khasra No)', 'Area (Ha)', 'Latitude', 'Longitude', 'District', 'Tehsil', 'Village', 'Total Reserve (MT)', 'Total Mineral (60% MT)', 'Existing/Proposed', 'Remarks'],
    emptyRow: ['', '', '', '0', '', '', 'Jalandhar', '', '', '0', '0', '<select><option>Existing</option><option>Proposed</option></select>', '', null],
    addLabel: 'Add Patta Land',
    uploadLabel: 'Upload Excel (Patta Lands)',
    minWidth: '1200px',
    pdfTitle: '> b) Patta lands/Khatedari land (Existing & Proposed):',
    fontSize: 7.5
  },
  DESILT_SECTION_C: {
    tableId: 'anx2-desilt',
    containerId: 'anx2-desilt-container',
    filename: 'Annexure_II_DeSiltation_Template.csv',
    headers: ['Name of Reservoir/Dams', 'Maintain/Controlled by State Govt./PSU etc.', 'Latitude', 'Longitude', 'District', 'Tehsil', 'Village', 'Size (Ha)', 'Quantity MT/Year', 'Existing/Proposed'],
    emptyRow: ['', '', '', '', 'Jalandhar', '', '', '0.00', '-', '<select><option>Existing</option><option>Proposed</option></select>', null],
    addLabel: 'Add Location',
    uploadLabel: 'Upload Excel (De-Siltation)',
    minWidth: '1000px',
    pdfTitle: '> c) De-Siltation Location (Lakes/Ponds/Dams etc.) (Existing & Proposed):',
    fontSize: 7.5
  },
  MSAND_SECTION_D: {
    tableId: 'anx2-msand',
    containerId: 'anx2-msand-container',
    filename: 'Annexure_II_MSand_Template.csv',
    headers: ['Plant Name', 'Owner', 'District', 'Tehsil', 'Village', 'Geo-location', 'Quantity Tonnes/Annum', 'Existing/Proposed'],
    emptyRow: ['', '', 'Jalandhar', '', '', '', '', '<select><option>Existing</option><option>Proposed</option></select>', null],
    addLabel: 'Add M-Sand Plant',
    uploadLabel: 'Upload Excel (M-Sand)',
    minWidth: '1000px',
    pdfTitle: '> d) M-Sand Plants (Existing & Proposed):',
    fontSize: 8
  }
};
function anx2DeleteButtonHTML() {
  const isReadOnly = typeof isUserReadOnly === 'function' ? isUserReadOnly() : !(window.S && (S.role === 'user' || S.role === 'admin'));
  return `<button class='btn btn-xs btn-danger' onclick='delRowAnx2(this)' style='display:${isReadOnly ? 'none' : 'inline-flex'};align-items:center;justify-content:center;padding:4px;'><i data-lucide='trash-2' style='width:12px;height:12px;'></i></button>`;
}
function anx2CellValue(td) {
  return annexurePrintableValue(td);
}
function anx2ToCSVValue(value) {
  const text = String(value === undefined || value === null ? '' : value);
  return `"${text.replace(/"/g, '""')}"`;
}
function downloadSectionTemplateAnx2(sectionType) {
  const cfg = ANNEXURE_2_TABLES[sectionType];
  if (!cfg) return;
  const csvContent = cfg.headers.map(anx2ToCSVValue).join(',') + '\n';
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', cfg.filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
function resolveAnx2Table(target, sectionType) {
  if (target && typeof target === 'string') return document.getElementById(target);
  if (target && target.nodeType === 1) {
    if (target.matches('table')) return target;
    const blockTable = target.closest('.anx2-table-block')?.querySelector('table');
    if (blockTable) return blockTable;
  }
  const cfg = ANNEXURE_2_TABLES[sectionType];
  return cfg ? document.getElementById(cfg.tableId) : null;
}
function getAnx2Tables(sectionType) {
  const cfg = ANNEXURE_2_TABLES[sectionType];
  if (!cfg) return [];
  // Each clone is assigned a unique ID with this base ID as its prefix.
  // Query the view so the original and every clone reach preview/PDF output.
  const tables = typeof annexureTablesByPrefix === 'function'
    ? annexureTablesByPrefix('anx2', cfg.tableId)
    : Array.from(document.querySelectorAll(`#view-anx2 table[id^="${cfg.tableId}"]`));
  return tables.length ? tables : (document.getElementById(cfg.tableId) ? [document.getElementById(cfg.tableId)] : []);
}
function getAnx2EmptyRow(sectionType) {
  const cfg = ANNEXURE_2_TABLES[sectionType];
  if (!cfg) return [];
  const row = cfg.emptyRow.slice();
  row[row.length - 1] = anx2DeleteButtonHTML();
  return row;
}
function handleSectionUploadAnx2(event, sectionType) {
  const file = event.target.files[0];
  if (!file) return;
  const table = resolveAnx2Table(event.target, sectionType);
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });
      if (!rows.length) {
        toast('The uploaded file is empty.', 'warn');
        return;
      }
      processExcelDataAnx2(rows, sectionType, table);
    } catch (error) {
      toast('Error parsing file. Please ensure it is a valid Excel or CSV file.', 'error');
      console.error(error);
    }
    event.target.value = '';
  };
  reader.readAsArrayBuffer(file);
}
function processExcelDataAnx2(rows, sectionType, targetTable) {
  const cfg = ANNEXURE_2_TABLES[sectionType];
  if (!cfg) return;
  const validRows = rows.filter(row => row.some(cell => String(cell === undefined || cell === null ? '' : cell).trim() !== ''));
  const headerIdx = validRows.findIndex(row => anx2LooksLikeHeader(row, sectionType));
  const startIndex = headerIdx >= 0 ? headerIdx + 1 : 0;
  const dataRows = validRows.slice(startIndex);
  if (!dataRows.length) {
    toast('No data found after the header in the uploaded file.', 'warn');
    return;
  }
  const table = targetTable || document.getElementById(cfg.tableId);
  const tbody = table ? table.querySelector('tbody') : null;
  if (!tbody) return;
  const uploadRows = dataRows.map((rowData, index) => normalizeAnx2Row(rowData, sectionType, index));
  if (typeof rbacApplyExcelRowsToTable === 'function') {
    rbacApplyExcelRowsToTable(table, uploadRows, row => addRowAnx2(table, row));
  } else {
    tbody.innerHTML = '';
    uploadRows.forEach(row => addRowAnx2(table, row));
  }
  if (sectionType === 'PATTA_SECTION_B') updatePattaGrandTotalsAnx2(table);
  if (sectionType === 'DESILT_SECTION_C') updateDesiltGrandTotalsAnx2(table);
  toast(`Uploaded section ${sectionType === 'PATTA_SECTION_B' ? 'patta' : sectionType === 'DESILT_SECTION_C' ? 'desilt' : sectionType === 'MSAND_SECTION_D' ? 'msand' : 'leases'} data successfully`, 'success');
  if (window.debouncedSaveState) window.debouncedSaveState();
  if (window.pdfPreview && window.pdfPreview.currentView === 'anx2') {
    exportAnx2PDF(null, true);
  }
}
function anx2LooksLikeHeader(row, sectionType) {
  const rowStr = row.map(c => String(c || '')).join(' ').toLowerCase();
  if (sectionType === 'LEASES') return rowStr.includes('lease') || rowStr.includes('river');
  if (sectionType === 'PATTA_SECTION_B') return rowStr.includes('owner') || rowStr.includes('patta');
  if (sectionType === 'DESILT_SECTION_C') return rowStr.includes('reservoir') || rowStr.includes('desilt');
  if (sectionType === 'MSAND_SECTION_D') return rowStr.includes('plant') || rowStr.includes('msand');
  return false;
}
function normalizeAnx2Row(rowData, sectionType, index) {
  const row = Array.from(rowData);
  const del = anx2DeleteButtonHTML();
  while (row.length < 18) row.push('');
  if (sectionType === 'LEASES') {
    let area = parseFloat(row[3]) || 0;
    let bulkDensity = parseFloat(row[8]) || 1.54;
    let depth = parseFloat(row[9]) || 3.0;
    let gross = area * 10000 * depth * bulkDensity;
    let net = gross * 0.60;
    let epVal = String(row[13] || '').trim().toLowerCase();
    let epSelect = `<select><option ${epVal === 'existing' || epVal !== 'proposed' ? 'selected' : ''}>Existing</option><option ${epVal === 'proposed' ? 'selected' : ''}>Proposed</option></select>`;
    return [String(index + 1), row[0], row[1], row[2], area.toString(), row[4], row[5], row[6], row[7], bulkDensity.toString(), depth.toString(), gross.toFixed(2), net.toFixed(2), row[12] || 'Sand', epSelect, row[14], del];
  }
  if (sectionType === 'PATTA_SECTION_B') {
    let area = parseFloat(row[2]) || 0;
    let reserve = Math.round(area * 10000 * 3 * 1.52);
    let mineral = Math.round(reserve * 0.60);
    let epVal = String(row[10] || '').trim().toLowerCase();
    let epSelect = `<select><option ${epVal === 'existing' || epVal !== 'proposed' ? 'selected' : ''}>Existing</option><option ${epVal === 'proposed' ? 'selected' : ''}>Proposed</option></select>`;
    return [String(index + 1), row[0], row[1], area.toString(), row[3], row[4], row[5] || 'Jalandhar', row[6], row[7], reserve.toString(), mineral.toString(), epSelect, row[11], del];
  }
  if (sectionType === 'DESILT_SECTION_C') {
    let epVal = String(row[9] || '').trim().toLowerCase();
    let epSelect = `<select><option ${epVal === 'existing' || epVal !== 'proposed' ? 'selected' : ''}>Existing</option><option ${epVal === 'proposed' ? 'selected' : ''}>Proposed</option></select>`;
    return [row[0], row[1], row[2], row[3], row[4] || 'Jalandhar', row[5], row[6], row[7], row[8], epSelect, del];
  }
  let epVal = String(row[7] || '').trim().toLowerCase();
  let epSelect = `<select><option ${epVal === 'existing' || epVal !== 'proposed' ? 'selected' : ''}>Existing</option><option ${epVal === 'proposed' ? 'selected' : ''}>Proposed</option></select>`;
  return [row[0], row[1], row[2] || 'Jalandhar', row[3], row[4], row[5], row[6], epSelect, del];
}
function addRowAnx2(tableId, cellDataArray) {
  const table = resolveAnx2Table(tableId);
  const tbody = table ? table.querySelector('tbody') : null;
  if (!tbody) return;
  const tr = document.createElement('tr');
  cellDataArray.forEach((data, index) => {
    const td = document.createElement('td');
    let dataStr = String(data === undefined || data === null ? '' : data).trim();
    if (dataStr === '' && !dataStr.includes('<button') && !dataStr.includes('<select')) {
      dataStr = 'NA';
    }
    if (dataStr.includes('<button') || dataStr.includes('<select')) {
      td.innerHTML = dataStr;
    } else {
      td.textContent = dataStr;
      const isReadOnly = typeof isUserReadOnly === 'function' ? isUserReadOnly() : !(window.S && (S.role === 'user' || S.role === 'admin'));
      td.contentEditable = isReadOnly ? 'false' : 'true';
      if (isReadOnly) {
        td.style.backgroundColor = 'var(--off)';
        td.style.cursor = 'not-allowed';
      }
      const tableIdStr = table.id || '';
      if (tableIdStr.startsWith('anx2-leases')) {
        if (index === 4 || index === 9 || index === 10) {
          td.addEventListener('input', function() { calcLeaseRowAnx2(this); });
        }
      } else if (tableIdStr.startsWith('anx2-patta')) {
        if (index === 3) {
          td.addEventListener('input', function() { calcPattaRowAnx2(this); });
        }
      } else if (tableIdStr.startsWith('anx2-desilt')) {
        if (index === 7) {
          td.addEventListener('input', function() { updateDesiltGrandTotalsAnx2(table); });
        }
      }
    }
    tr.appendChild(td);
  });
  const tableIdStr = table.id || '';
  if (tableIdStr.startsWith('anx2-leases')) {
    if (tr.children.length > 12) {
      tr.children[11].classList.add('calc-total');
      tr.children[12].classList.add('calc-net');
      tr.children[11].contentEditable = 'false';
      tr.children[12].contentEditable = 'false';
    }
  } else if (tableIdStr.startsWith('anx2-patta')) {
    if (tr.children.length > 10) {
      tr.children[9].classList.add('p-reserve');
      tr.children[10].classList.add('p-min');
    }
  }
  tbody.appendChild(tr);
  if (window.initLucide) window.initLucide();
  if (window.debouncedSaveState) window.debouncedSaveState();
  if (window.pdfPreview && window.pdfPreview.currentView === 'anx2') {
    exportAnx2PDF(null, true);
  }
}
function calcLeaseRowAnx2(element) {
  const row = element.closest('tr');
  const cells = row.cells;
  const area = parseFloat(cells[4]?.innerText) || 0;
  const bulkDensity = parseFloat(cells[9]?.innerText) || 0;
  const depth = parseFloat(cells[10]?.innerText) || 0;
  const gross = area * 10000 * depth * bulkDensity;
  const net = gross * 0.60;
  if (cells[11]) cells[11].innerText = gross > 0 ? gross.toFixed(2) : '0.00';
  if (cells[12]) cells[12].innerText = net > 0 ? net.toFixed(2) : '0.00';
}
function calcPattaRowAnx2(element) {
  const row = element.closest('tr');
  const cells = row.cells;
  const area = parseFloat(cells[3]?.innerText) || 0;
  const reserve = Math.round(area * 10000 * 3 * 1.52);
  const mineral = Math.round(reserve * 0.60);
  if (cells[9]) cells[9].innerText = reserve;
  if (cells[10]) cells[10].innerText = mineral;
  updatePattaGrandTotalsAnx2(row.closest('table'));
}
function updatePattaGrandTotalsAnx2(targetTable) {
  const table = targetTable || document.getElementById('anx2-patta');
  if (!table) return;
  let areaSum = 0, resSum = 0, minSum = 0;
  table.querySelectorAll('tbody tr').forEach(tr => {
    if (tr.cells.length > 10) {
      areaSum += parseFloat(tr.cells[3]?.innerText) || 0;
      resSum += parseFloat(tr.querySelector('.p-reserve')?.innerText || tr.cells[9]?.innerText) || 0;
      minSum += parseFloat(tr.querySelector('.p-min')?.innerText || tr.cells[10]?.innerText) || 0;
    }
  });
  const sumAreaEl = table.querySelector('[id^="patta-sum-area"]');
  const sumReserveEl = table.querySelector('[id^="patta-sum-reserve"]');
  const sumMineralEl = table.querySelector('[id^="patta-sum-mineral"]');
  if (sumAreaEl) sumAreaEl.innerText = areaSum.toFixed(2);
  if (sumReserveEl) sumReserveEl.innerText = resSum.toFixed(0);
  if (sumMineralEl) sumMineralEl.innerText = minSum.toFixed(2);
}
function updateDesiltGrandTotalsAnx2(targetTable) {
  const table = targetTable || document.getElementById('anx2-desilt');
  if (!table) return;
  let sizeSum = 0;
  table.querySelectorAll('tbody tr').forEach(tr => {
    if (tr.cells.length > 7) {
      sizeSum += parseFloat(tr.cells[7]?.innerText) || 0;
    }
  });
  const sumSizeEl = table.querySelector('[id^="desilt-sum-size"]');
  if (sumSizeEl) sumSizeEl.innerText = sizeSum.toFixed(2);
}
function renumberAnx2TableBlocks(sectionType) {
  const cfg = ANNEXURE_2_TABLES[sectionType];
  const container = cfg ? document.getElementById(cfg.containerId) : null;
  if (!container) return;
  const blocks = container.querySelectorAll('.anx2-table-block');
  blocks.forEach((block, index) => {
    const title = block.querySelector('.anx2-block-title');
    const delBtn = block.querySelector('.anx2-delete-table');
    if (title) title.textContent = index === 0 ? '' : `Table ${index + 1}`;
    if (delBtn) delBtn.style.display = blocks.length <= 1 ? 'none' : 'inline-flex';
  });
}
function deleteAnx2TableBlock(btn) {
  const block = btn.closest('.anx2-table-block');
  if (!block) return;
  const sectionType = block.getAttribute('data-section-type');
  const cfg = ANNEXURE_2_TABLES[sectionType];
  const container = cfg ? document.getElementById(cfg.containerId) : null;
  if (!container) return;
  if (container.querySelectorAll('.anx2-table-block').length <= 1) {
    toast('You cannot delete the last remaining table.', 'warn');
    return;
  }
  if (confirm('Are you sure you want to delete this entire table block?')) {
    block.remove();
    renumberAnx2TableBlocks(sectionType);
    toast('Table block deleted.', 'success');
    if (window.debouncedSaveState) window.debouncedSaveState();
    if (window.pdfPreview && window.pdfPreview.currentView === 'anx2') {
      exportAnx2PDF(null, true);
    }
  }
}
function addAnx2TableBlock(sectionType) {
  const cfg = ANNEXURE_2_TABLES[sectionType];
  const container = cfg ? document.getElementById(cfg.containerId) : null;
  const firstTable = document.getElementById(cfg?.tableId);
  if (!cfg || !container || !firstTable) return;
  const tableIdx = container.querySelectorAll('.anx2-table-block').length + 1;
  const newTableId = `${cfg.tableId}-clone-${Date.now()}-${tableIdx}`;
  const headerHtml = Array.from(firstTable.querySelectorAll('thead th')).map(th => th.outerHTML).join('');
  const footHtml = firstTable.querySelector('tfoot') ? Array.from(firstTable.querySelectorAll('tfoot tr')).map(tr => tr.outerHTML).join('') : '';
  const blockHtml = `
    <div class="anx2-table-block" data-section-type="${sectionType}" style="margin-top:18px; padding-top:18px; border-top:1px dashed var(--border);">
      <div style="display:flex; justify-content:space-between; align-items:center; gap:8px; margin-bottom:10px; flex-wrap:wrap;">
        <div class="anx2-block-title" style="font-size:12px; font-weight:700; color:var(--text-mid);">Table ${tableIdx}</div>
        <button class="btn btn-xs btn-danger anx2-delete-table" onclick="deleteAnx2TableBlock(this)" style="display:inline-flex; align-items:center; gap:6px;">
          <i data-lucide="trash-2" style="width:12px; height:12px;"></i>
          <span>Delete Table</span>
        </button>
      </div>
      <div class="tbl-wrap">
        <table class="anx-tbl anx2-table" data-section-type="${sectionType}" id="${newTableId}" name="${newTableId}" style="min-width:${cfg.minWidth}">
          <thead><tr>${headerHtml}</tr></thead>
          <tbody></tbody>
          ${footHtml ? `<tfoot>${footHtml}</tfoot>` : ''}
        </table>
      </div>
      <div class="section-footer" style="margin-top:12px; display:flex; gap:8px; align-items:center; flex-wrap:wrap;">
        <button class="btn btn-xs btn-outline" onclick="addRowAnx2(this,getAnx2EmptyRow('${sectionType}'))" style="display:inline-flex; align-items:center; gap:6px;">
          <i data-lucide="plus" style="width:12px; height:12px;"></i>
          <span>${cfg.addLabel}</span>
        </button>
        <label class="btn btn-excel-upload btn-xs" style="cursor:pointer; display:inline-flex; align-items:center; gap:6px; margin-bottom:0;">
          <i data-lucide="upload" style="width:12px; height:12px;"></i>
          <span>${cfg.uploadLabel}</span>
          <input type="file" accept=".xlsx,.xls,.csv" hidden onchange="handleSectionUploadAnx2(event, '${sectionType}')">
        </label>
      </div>
    </div>`;
  container.insertAdjacentHTML('beforeend', blockHtml);
  addRowAnx2(document.getElementById(newTableId), getAnx2EmptyRow(sectionType));
  renumberAnx2TableBlocks(sectionType);
  if (typeof applyMoreAnnexureAccess === 'function') applyMoreAnnexureAccess(document.getElementById('view-anx2'));
  if (typeof addCoreAnnexureTableControls === 'function') addCoreAnnexureTableControls('anx2');
  if (window.initLucide) window.initLucide();
  if (window.debouncedSaveState) window.debouncedSaveState();
  if (window.pdfPreview && window.pdfPreview.currentView === 'anx2') {
    exportAnx2PDF(null, true);
  }
}
function delRowAnx2(btn) {
  const row = btn.closest('tr');
  if (!row) return;
  const table = row.closest('table');
  row.remove();
  if (table && table.id.startsWith('anx2-patta')) {
    updatePattaGrandTotalsAnx2(table);
  } else if (table && table.id.startsWith('anx2-desilt')) {
    updateDesiltGrandTotalsAnx2(table);
  }
  if (window.debouncedSaveState) window.debouncedSaveState();
  if (window.pdfPreview && window.pdfPreview.currentView === 'anx2') {
    exportAnx2PDF(null, true);
  }
}
function extractAnx2Table(tableId) {
  const table = typeof tableId === 'string' ? document.getElementById(tableId) : tableId;
  if (!table) return { headers: [], rows: [] };
  const headerRow = table.querySelector('thead tr');
  const headers = getPrintableTableCells(headerRow)
    .map(th => th.innerText.trim().replace(/\n/g, ' '));
  const rows = [];
  table.querySelectorAll('tbody tr').forEach(tr => {
    const cells = getPrintableTableCells(tr);
    rows.push(cells.map(anx2CellValue));
  });
  return { headers, rows };
}
async function exportAnx2PDF(btn, isLivePreview = false) {
  if (typeof btn === 'boolean') {
    isLivePreview = btn;
    btn = null;
  }
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF('l', 'pt', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const border = { x: 30, y: 14, w: pageWidth - 60, h: pageHeight - 42 };
  const tableLeft = 52;
  const tableWidth = pageWidth - tableLeft - 36;
  const headerLeft = tableLeft + 4;
  const footerY = pageHeight - 38;
  const pageNumberOffset = 490;
  const district = (S.activeProject && S.activeProject.district) || 'Jalandhar';
  const state = (S.activeProject && S.activeProject.state) || 'Punjab';
  const CONTENT_TOP = 72;
  let startY = CONTENT_TOP;
  const normalizeSectionTitle = (title) => String(title || '')
    .replace(/^>\s*/, '')
    .replace(/:$/, '');
  const drawReportFrame = (data) => {
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.6);
    doc.rect(border.x, border.y, border.w, border.h);
    doc.setFont('times', 'italic');
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text('District Survey Report', headerLeft, 27);
    doc.text(`${district} District`, headerLeft, 39);
    doc.text(state, headerLeft, 51);
    doc.setLineWidth(0.4);
    doc.line(tableLeft, 62, pageWidth - 32, 62);
    doc.setFont('times', 'normal');
    doc.setFontSize(8);
    doc.text('PREPARED BY:', pageWidth / 2 - 130, footerY - 2, { align: 'left' });
    doc.setFont('times', 'bold');
    doc.text(` SUB-DIVISIONAL COMMITTEE OF ${district.toUpperCase()} DISTRICT`, pageWidth / 2 - 76, footerY - 2, { align: 'left' });
    doc.setFont('times', 'normal');
    doc.text('ASSISTED BY:', pageWidth / 2 - 130, footerY + 10, { align: 'left' });
    doc.setFont('times', 'bold');
    doc.text(' RSP GREEN DEVELOPMENT AND LABORATORIES PVT. LTD', pageWidth / 2 - 78, footerY + 10, { align: 'left' });
    doc.setFont('times', 'bold');
    doc.setFontSize(10);
    doc.text(String(pageNumberOffset + data.pageNumber), pageWidth - 26, pageHeight - 18, { align: 'right' });
  };
  const sections = ['LEASES', 'PATTA_SECTION_B', 'DESILT_SECTION_C', 'MSAND_SECTION_D'].flatMap(sectionType => {
    const cfg = ANNEXURE_2_TABLES[sectionType];
    return getAnx2Tables(sectionType).map((table, tableIndex) => ({
      sectionType,
      title: tableIndex === 0 ? cfg.pdfTitle : `${cfg.pdfTitle} Table ${tableIndex + 1}`,
      table,
      tableId: table.id,
      fontSize: cfg.fontSize
    }));
  });
  sections.forEach((section, index) => {
    const titleHeight = 14;
    const tableStartEstimate = startY + titleHeight + 6;
    if (index > 0 && tableStartEstimate + 40 > pageHeight - 40) {
      doc.addPage();
      drawReportFrame({ pageNumber: doc.getCurrentPageInfo().pageNumber });
      startY = CONTENT_TOP;
    }
    doc.setFont('times', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.text(normalizeSectionTitle(section.title), pageWidth / 2, startY, { align: 'center' });
    startY += titleHeight;
    const tableData = extractAnx2Table(section.table);
    const isPatta = section.tableId && section.tableId.startsWith('anx2-patta');
    const isDesilt = section.tableId && section.tableId.startsWith('anx2-desilt');
    let footRows = [];
    if (isPatta || isDesilt) {
      const tableEl = typeof section.table === 'string' ? document.getElementById(section.table) : section.table;
      if (tableEl) {
        tableEl.querySelectorAll('tfoot tr').forEach(tr => {
          const row = [];
          getPrintableTableCells(tr).forEach(td => row.push(anx2CellValue(td)));
          if (row.length) footRows.push(row);
        });
      }
    }
    doc.autoTable({
      startY,
      head: [tableData.headers],
      body: tableData.rows,
      foot: footRows.length ? footRows : undefined,
      theme: 'grid',
      styles: {
        font: 'times',
        fontSize: section.fontSize,
        textColor: 0,
        lineColor: 0,
        lineWidth: 0.4,
        cellPadding: 2.5,
        valign: 'middle',
        halign: 'left',
        minCellHeight: 0
      },
      headStyles: {
        fillColor: false,
        fontStyle: 'bold',
        halign: 'center',
        valign: 'middle',
        textColor: 0,
        lineColor: 0,
        lineWidth: 0.4,
        cellPadding: 2.5
      },
      footStyles: isPatta || isDesilt ? { fillColor: false, fontStyle: 'bold', textColor: 0, halign: 'center' } : undefined,
      columnStyles: section.tableId && section.tableId.startsWith('anx2-leases') ? {
        5: { cellWidth: 70 },
        6: { cellWidth: 70 }
      } : {},
      margin: { top: startY, bottom: 40, left: tableLeft, right: tableLeft },
      tableWidth,
      didDrawPage: drawReportFrame
    });
    startY = doc.lastAutoTable.finalY + 18;
  });
  doc.setFont('times', 'italic');
  doc.setFontSize(9);
  doc.text('(Reference: Table of the Proforma for the district of Jalandhar, Page no 560 -563)', pageWidth / 2, startY + 4, { align: 'center' });
  await appendAnx2AttachmentPages(doc);
  if (isLivePreview) {
    const blob = doc.output('blob');
    const blobUrl = URL.createObjectURL(blob);
    const iframe = (window.getAnnexurePreviewIframe ? window.getAnnexurePreviewIframe('anx2') : document.getElementById('pdf-iframe-anx2'));
    if (iframe) iframe.src = blobUrl;
  } else {
    doc.save('Annexure_II_Mining_Leases.pdf');
    toast('PDF downloaded successfully!', 'success');
  }
}
function getAnx2Attachment() {
  if (window.S && S.activeProject && S.activeProject.anx2Attachment) return S.activeProject.anx2Attachment;
  return window.anx2Attachment || null;
}
function setAnx2Attachment(attachment) {
  window.anx2Attachment = attachment;
  if (window.S && S.activeProject) {
    S.activeProject.anx2Attachment = attachment;
    const pIdx = S.projects.findIndex(p => p.id === S.activeProject.id);
    if (pIdx !== -1) S.projects[pIdx].anx2Attachment = attachment;
  }
}
function renderAttachmentUploadUIAnx2() {
  const el = document.getElementById('anx2-attachment-info');
  if (!el) return;
  const attachment = getAnx2Attachment();
  if (!attachment || !attachment.pages || !attachment.pages.length) {
    el.innerHTML = `<div style="padding:14px 16px; border:1px dashed var(--border); border-radius:var(--r-sm); color:var(--text-soft); font-size:13px; background:var(--off);">No supporting PDF/image uploaded yet.</div>`;
    return;
  }
  el.innerHTML = `<div class="file-item" style="margin-top:10px; background:var(--off); border:1px solid var(--border); max-width:560px; display:flex; align-items:center; justify-content:space-between; padding:10px 12px; border-radius:var(--r-sm);"><div style="display:flex; align-items:center; gap:8px;"><div class="file-icon" style="background:var(--teal-lt); color:var(--teal); padding:6px; border-radius:var(--r-xs); font-size:14px;"><i data-lucide="file-up" style="width:16px; height:16px;"></i></div><div style="line-height:1.25;"><div style="font-size:12px; font-weight:700; color:var(--text);">${attachment.fileName}</div><div style="font-size:10.5px; color:var(--text-faint);">${attachment.fileSize || ''} - ${attachment.pages.length} page(s) will be appended</div></div></div><button type="button" class="btn btn-xs btn-danger" onclick="deleteAttachmentAnx2()">Remove</button></div>`;
  if (window.initLucide) window.initLucide();
}
function handleAttachmentUploadAnx2(event) {
  const file = event.target.files[0];
  if (!file) return;
  const sizeStr = (file.size / 1024).toFixed(1) + ' KB';
  if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
    toast('Processing supporting PDF...', 'info');
    if (typeof renderPdfToImages !== 'function') { toast('PDF renderer is not available on this page.', 'error'); event.target.value = ''; return; }
    renderPdfToImages(file, (err, imgs) => {
      if (err || !imgs || !imgs.length) { console.error(err); toast('PDF render failed. Please try another PDF or upload an image.', 'error'); event.target.value = ''; return; }
      setAnx2Attachment({ fileName: file.name, fileSize: sizeStr, fileType: 'pdf', pages: imgs });
      renderAttachmentUploadUIAnx2();
      if (window.debouncedSaveState) window.debouncedSaveState();
      toast('Supporting PDF added to Annexure II.', 'success');
      if (window.pdfPreview && window.pdfPreview.currentView === 'anx2') { exportAnx2PDF(null, true); }
      event.target.value = '';
    });
    return;
  }
  if (file.type.startsWith('image/')) {
    const reader = new FileReader();
    reader.onload = function(evt) {
      setAnx2Attachment({ fileName: file.name, fileSize: sizeStr, fileType: 'image', pages: [evt.target.result] });
      renderAttachmentUploadUIAnx2();
      if (window.debouncedSaveState) window.debouncedSaveState();
      toast('Supporting image added to Annexure II.', 'success');
      if (window.pdfPreview && window.pdfPreview.currentView === 'anx2') { exportAnx2PDF(null, true); }
      event.target.value = '';
    };
    reader.readAsDataURL(file);
    return;
  }
  toast('Unsupported file format. Please upload a PDF or image.', 'error');
  event.target.value = '';
}
function deleteAttachmentAnx2() {
  setAnx2Attachment(null);
  renderAttachmentUploadUIAnx2();
  if (window.debouncedSaveState) window.debouncedSaveState();
  if (window.pdfPreview && window.pdfPreview.currentView === 'anx2') { exportAnx2PDF(null, true); }
  toast('Supporting file removed.', 'success');
}
function loadAnx2Image(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}
async function appendAnx2AttachmentPages(doc) {
  const attachment = getAnx2Attachment();
  if (!attachment || !attachment.pages || !attachment.pages.length) return;
  for (const src of attachment.pages) {
    const img = await loadAnx2Image(src);
    doc.addPage('a4', 'p');
    const w = doc.internal.pageSize.getWidth();
    const h = doc.internal.pageSize.getHeight();
    const margin = 24;
    const maxW = w - margin * 2;
    const maxH = h - margin * 2;
    const ratio = Math.min(maxW / img.width, maxH / img.height);
    const drawW = img.width * ratio;
    const drawH = img.height * ratio;
    const x = (w - drawW) / 2;
    const y = (h - drawH) / 2;
    const format = String(src).startsWith('data:image/png') ? 'PNG' : 'JPEG';
    doc.addImage(src, format, x, y, drawW, drawH);
  }
}
function renderAnx2() {
  renderAttachmentUploadUIAnx2();
  ['LEASES', 'PATTA_SECTION_B', 'DESILT_SECTION_C', 'MSAND_SECTION_D'].forEach(renumberAnx2TableBlocks);
  if (typeof applyMoreAnnexureAccess === 'function') applyMoreAnnexureAccess(document.getElementById('view-anx2'));
  if (window.initLucide) window.initLucide();
}
document.addEventListener('input', (e) => {
  if (e.target.closest('#view-anx2 table')) {
    if (window.anx2DebounceTimer) clearTimeout(window.anx2DebounceTimer);
    window.anx2DebounceTimer = setTimeout(() => { exportAnx2PDF(null, true); }, 1500);
  }
});
window.downloadSectionTemplateAnx2 = downloadSectionTemplateAnx2;
window.handleSectionUploadAnx2 = handleSectionUploadAnx2;
window.addRowAnx2 = addRowAnx2;
window.addAnx2TableBlock = addAnx2TableBlock;
window.deleteAnx2TableBlock = deleteAnx2TableBlock;
window.getAnx2EmptyRow = getAnx2EmptyRow;
window.delRowAnx2 = delRowAnx2;
window.exportAnx2PDF = exportAnx2PDF;
window.handleAttachmentUploadAnx2 = handleAttachmentUploadAnx2;
window.deleteAttachmentAnx2 = deleteAttachmentAnx2;
window.renderAttachmentUploadUIAnx2 = renderAttachmentUploadUIAnx2;
window.renderAnx2 = renderAnx2;
document.addEventListener('change', (e) => {
  if (e.target.closest('#view-anx2 table')) {
    if (window.anx2DebounceTimer) clearTimeout(window.anx2DebounceTimer);
    window.anx2DebounceTimer = setTimeout(() => { exportAnx2PDF(null, true); }, 300);
  }
});
