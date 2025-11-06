import React, { useState, useCallback } from 'react';
import { Project, ShootLog, SheetRow } from '../types';
import EditableTableCell from './EditableTableCell';
import { TrashIcon } from './icons/TrashIcon';
import { PlusIcon } from './icons/PlusIcon';
import { DownloadIcon } from './icons/DownloadIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { exportLogToCSV } from '../services/exportService';
import { generateSampleData } from '../services/geminiService';
import { BackIcon } from './icons/BackIcon';

interface DateViewProps {
  project: Project;
  shootLog: ShootLog;
  onUpdateData: (newData: SheetRow[]) => void;
  onBack: () => void;
}

const columns: { key: keyof Omit<SheetRow, 'id'>, label: string, className?: string }[] = [
    { key: 'slno', label: 'SL No' },
    { key: 'slate', label: 'Slate', className: 'w-64' },
    { key: 'cameraName', label: 'Camera Name' },
    { key: 'cameraModel', label: 'Camera Model' },
    { key: 'clipNo', label: 'Clip No', className: 'w-72' },
    { key: 'lens', label: 'Lens' },
    { key: 'height', label: 'Height' },
    { key: 'focus', label: 'Focus' },
    { key: 'fps', label: 'FPS' },
    { key: 'shutter', label: 'Shutter' },
    { key: 'notes', label: 'Notes', className: 'w-96' },
];

const DateView: React.FC<DateViewProps> = ({ project, shootLog, onUpdateData, onBack }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const apiKeyExists = !!process.env.API_KEY;

  const updateCell = useCallback((rowIndex: number, columnKey: keyof Omit<SheetRow, 'id'>, value: string) => {
    const newData = [...shootLog.data];
    newData[rowIndex] = { ...newData[rowIndex], [columnKey]: value };
    onUpdateData(newData);
  }, [shootLog.data, onUpdateData]);

  const addRow = () => {
    const now = new Date();

    const day = now.getDate().toString().padStart(2, '0');
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const year = now.getFullYear();
    const datePart = `[${day}-${month}-${year}]`;

    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    let hours = now.getHours();
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const timePart = `${hours}:${minutes}:${seconds} ${ampm}`;

    const timestampSlate = `${timePart} -${datePart}`;

    const newRow: SheetRow = {
      id: crypto.randomUUID(),
      slno: (shootLog.data.length + 1).toString(),
      slate: timestampSlate, 
      cameraName: '', cameraModel: '', clipNo: '', lens: '', height: '', focus: '', fps: '', shutter: '', notes: ''
    };
    onUpdateData([...shootLog.data, newRow]);
  };

  const deleteRow = (rowIndex: number) => {
    const newData = shootLog.data.filter((_, index) => index !== rowIndex);
    onUpdateData(newData);
  };
  
  const handleGenerateSample = async () => {
    if (!apiKeyExists) return;
    setIsGenerating(true);
    setError(null);
    try {
        const sampleRows = await generateSampleData();
        const newRows: SheetRow[] = sampleRows.map((row) => ({
            ...row,
            id: crypto.randomUUID(),
        }));
        onUpdateData([...shootLog.data, ...newRows]);
    } catch(err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
        setIsGenerating(false);
    }
  };

  return (
    <div className="animate-fade-in flex flex-col h-full max-w-full mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 rounded-full bg-surface hover:bg-surface-light transition-colors" title={`Back to ${project.name}`}>
                <BackIcon />
            </button>
            <div>
                <p className="text-sm text-text-secondary">{project.name}</p>
                <h1 className="text-4xl font-bold text-text-primary truncate">
                    {shootLog.name}
                </h1>
            </div>
        </div>
        <p className="text-lg text-text-secondary mt-2 ml-12">
            {new Date(shootLog.date + 'T00:00:00').toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
            <span className="mx-2 text-border">|</span>
            {shootLog.location}
        </p>
      </div>

      <div className="mb-4 flex flex-wrap gap-3 items-center p-3 bg-surface rounded-lg border border-border">
        <button onClick={addRow} className="flex items-center gap-2 bg-primary hover:bg-primary-focus text-black font-bold py-2 px-4 rounded-lg transition-colors duration-300">
          <PlusIcon /> Add Row
        </button>
        <button onClick={() => exportLogToCSV(project, shootLog)} className="flex items-center gap-2 bg-surface hover:bg-surface-light text-text-primary font-bold py-2 px-4 rounded-lg border border-border transition-colors duration-300">
          <DownloadIcon /> Export CSV
        </button>
        <button 
          onClick={handleGenerateSample} 
          disabled={isGenerating || !apiKeyExists} 
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          title={!apiKeyExists ? 'Gemini API key not configured. This feature is disabled.' : 'Generate sample data using AI'}
        >
          <SparklesIcon /> {isGenerating ? 'Generating...' : 'Generate Sample'}
        </button>
        {error && <div className="bg-red-900 border border-red-700 text-red-200 px-3 py-2 rounded-lg text-sm">{error}</div>}
      </div>

      <div className="flex-grow overflow-auto bg-surface rounded-lg shadow-lg border border-border">
        <table className="min-w-full divide-y divide-border relative">
          <thead className="bg-surface-light sticky top-0 z-10">
            <tr>
              {columns.map(col => (
                <th key={col.key} scope="col" className={`px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider ${col.className || ''}`}>{col.label}</th>
              ))}
              <th scope="col" className="relative px-4 py-3"><span className="sr-only">Delete</span></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {shootLog.data.length > 0 ? shootLog.data.map((row, rowIndex) => (
              <tr key={row.id} className="hover:bg-surface-light/50 transition-colors duration-200 group">
                {columns.map(col => {
                   let suggestions: string[] = [];
                   // Fix: TypeScript struggles to infer the mapped type correctly.
                   // Cast to string[] is safe as all SheetRow properties are strings.
                   const existingData = [...new Set((shootLog.data.map(r => r[col.key]) as string[]).filter(Boolean))];

                   switch (col.key) {
                        case 'lens':
                            suggestions = [...new Set([...(project.lensPresets || []), ...existingData])];
                            break;
                        case 'cameraName':
                            suggestions = [...new Set([...(project.cameraNamePresets || []), ...existingData])];
                            break;
                        case 'cameraModel':
                            suggestions = [...new Set([...(project.cameraModelPresets || []), ...existingData])];
                            break;
                        default:
                            suggestions = existingData;
                   }
                   suggestions.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

                   return (
                      <EditableTableCell 
                        key={col.key}
                        value={row[col.key]}
                        onUpdate={(value) => updateCell(rowIndex, col.key, value)}
                        className={col.className}
                        isNote={col.key === 'notes'}
                        isPresetCell={['lens', 'cameraName', 'cameraModel'].includes(col.key)}
                        columnLabel={col.label}
                        suggestions={suggestions}
                      />
                   );
                })}
                <td className="px-4 py-2 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => deleteRow(rowIndex)} className="text-gray-500 hover:text-red-400 transition-colors opacity-20 group-hover:opacity-100" title="Delete Row">
                    <TrashIcon />
                  </button>
                </td>
              </tr>
            )) : null}
          </tbody>
        </table>
        {shootLog.data.length === 0 && (
            <div className="text-center py-20">
                <p className="text-text-secondary">No data entered for this log.</p>
                <p className="text-sm text-gray-500 mt-1">Click "Add Row" to start.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default DateView;