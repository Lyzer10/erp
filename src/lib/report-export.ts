type ReportColumn<T> = { header: string; value: (row: T) => string | number };

export async function downloadReportExcel<T>(title: string, columns: ReportColumn<T>[], rows: T[]) {
  const { default: ExcelJS } = await import("exceljs");
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "DeveleERP";
  const sheet = workbook.addWorksheet(title.slice(0, 31), { views: [{ state: "frozen", ySplit: 1 }] });
  sheet.columns = columns.map((column) => ({ header: column.header, key: column.header, width: Math.max(14, Math.min(32, column.header.length + 8)) }));
  sheet.getRow(1).eachCell((cell) => { cell.font = { bold: true, color: { argb: "FFFFFFFF" } }; cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF1F9C88" } }; });
  rows.forEach((row) => sheet.addRow(Object.fromEntries(columns.map((column) => [column.header, column.value(row)]))));
  const bytes = await workbook.xlsx.writeBuffer();
  const url = URL.createObjectURL(new Blob([bytes], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }));
  Object.assign(document.createElement("a"), { href: url, download: `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${new Date().toISOString().slice(0, 10)}.xlsx` }).click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function downloadReportPdf<T>(title: string, subtitle: string, columns: ReportColumn<T>[], rows: T[]) {
  const [{ jsPDF }, autoTableModule] = await Promise.all([import("jspdf"), import("jspdf-autotable")]);
  const doc = new jsPDF({ orientation: columns.length > 6 ? "landscape" : "portrait" });
  doc.setFontSize(16); doc.text(title, 14, 16);
  doc.setFontSize(9); doc.setTextColor(90); doc.text(subtitle, 14, 23);
  autoTableModule.default(doc, { startY: 29, head: [columns.map((column) => column.header)], body: rows.map((row) => columns.map((column) => String(column.value(row)))), styles: { fontSize: 8, cellPadding: 2 }, headStyles: { fillColor: [31, 156, 136] } });
  doc.save(`${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${new Date().toISOString().slice(0, 10)}.pdf`);
}
