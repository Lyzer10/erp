type ReportColumn<T> = { header: string; value: (row: T) => string | number };

type ReportExportOptions = {
  subtitle?: string;
  totals?: Array<{ label: string; value: string | number }>;
};

export async function downloadReportExcel<T>(title: string, columns: ReportColumn<T>[], rows: T[], options: ReportExportOptions = {}) {
  const { default: ExcelJS } = await import("exceljs");
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "DeveleERP";
  const headingRows = options.subtitle ? 3 : 2;
  const sheet = workbook.addWorksheet(title.slice(0, 31), { views: [{ state: "frozen", ySplit: headingRows }] });
  sheet.columns = columns.map((column) => ({ key: column.header, width: Math.max(14, Math.min(32, column.header.length + 8)) }));
  sheet.mergeCells(1, 1, 1, Math.max(1, columns.length));
  sheet.getCell(1, 1).value = title;
  sheet.getCell(1, 1).font = { bold: true, size: 16, color: { argb: "FF0F172A" } };
  if (options.subtitle) {
    sheet.mergeCells(2, 1, 2, Math.max(1, columns.length));
    sheet.getCell(2, 1).value = options.subtitle;
    sheet.getCell(2, 1).font = { color: { argb: "FF475569" }, size: 10 };
  }
  const headerRow = sheet.getRow(headingRows);
  headerRow.values = columns.map((column) => column.header);
  headerRow.eachCell((cell) => { cell.font = { bold: true, color: { argb: "FFFFFFFF" } }; cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF1F9C88" } }; });
  rows.forEach((row) => sheet.addRow(Object.fromEntries(columns.map((column) => [column.header, column.value(row)]))));
  if (options.totals?.length) {
    sheet.addRow([]);
    options.totals.forEach(({ label, value }) => {
      const row = sheet.addRow([label, value]);
      row.font = { bold: true };
    });
  }
  const bytes = await workbook.xlsx.writeBuffer();
  const url = URL.createObjectURL(new Blob([bytes], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }));
  Object.assign(document.createElement("a"), { href: url, download: `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${new Date().toISOString().slice(0, 10)}.xlsx` }).click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function downloadReportPdf<T>(title: string, subtitle: string, columns: ReportColumn<T>[], rows: T[], options: ReportExportOptions = {}) {
  const [{ jsPDF }, autoTableModule] = await Promise.all([import("jspdf"), import("jspdf-autotable")]);
  const doc = new jsPDF({ orientation: columns.length > 6 ? "landscape" : "portrait" });
  doc.setFontSize(16); doc.text(title, 14, 16);
  doc.setFontSize(9); doc.setTextColor(90); doc.text(subtitle, 14, 23);
  autoTableModule.default(doc, { startY: 29, head: [columns.map((column) => column.header)], body: rows.map((row) => columns.map((column) => String(column.value(row)))), styles: { fontSize: 8, cellPadding: 2 }, headStyles: { fillColor: [31, 156, 136] } });
  if (options.totals?.length) {
    const lastTable = (doc as typeof doc & { lastAutoTable?: { finalY: number } }).lastAutoTable;
    let y = (lastTable?.finalY ?? 29) + 8;
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(10);
    options.totals.forEach(({ label, value }) => {
      doc.setFont("helvetica", "bold");
      doc.text(label, 14, y);
      doc.text(String(value), doc.internal.pageSize.getWidth() - 14, y, { align: "right" });
      y += 6;
    });
  }
  doc.save(`${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${new Date().toISOString().slice(0, 10)}.pdf`);
}
