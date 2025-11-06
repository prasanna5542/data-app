import { Project, ShootLog, SheetRow } from '../types';

const CSV_HEADERS: (keyof Omit<SheetRow, 'id'>)[] = [
    'slno', 'slate', 'cameraName', 'cameraModel', 'clipNo', 'lens', 'height', 'focus', 'fps', 'shutter', 'notes'
];

const toCSV = (data: SheetRow[]): string => {
  const header = CSV_HEADERS.join(',');
  const rows = data.map(row => 
    CSV_HEADERS.map(fieldName => {
        const value = String(row[fieldName] || '');
        // Escape quotes and wrap in quotes if it contains commas or newlines
        if (value.includes(',') || value.includes('"') || value.includes('\n')) {
            return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
    }).join(',')
  );

  return [header, ...rows].join('\n');
};

const downloadCSV = (csvContent: string, filename: string) => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-s-8;' });
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

export const exportLogToCSV = (project: Project, shootLog: ShootLog) => {
    const csvHeader = [
        `Project:,${project.name.includes(',') ? `"${project.name}"` : project.name}`,
        `Shoot Day:,${shootLog.name.includes(',') ? `"${shootLog.name}"` : shootLog.name}`,
        `Date:,${shootLog.date}`,
        `Location:,${shootLog.location.includes(',') ? `"${shootLog.location}"` : shootLog.location}`,
        '' // empty line
    ].join('\n');

    const csvData = toCSV(shootLog.data);
    const csvContent = `${csvHeader}\n${csvData}`;
    downloadCSV(csvContent, `vfx-log-${project.name.replace(/\s+/g, '_')}-${shootLog.date}.csv`);
};

export const exportProjectToCSV = (project: Project) => {
    let allRows: SheetRow[] = [];
    project.shootLogs.forEach(log => {
        const datedRows = log.data.map(row => ({
            ...row,
            slate: `${log.name} | ${log.date} | ${row.slate}` // Prepend name and date to slate for context
        }));
        allRows = [...allRows, ...datedRows];
    });

    const csvData = toCSV(allRows);
    downloadCSV(csvData, `vfx-project-${project.name.replace(/\s+/g, '_')}.csv`);
};