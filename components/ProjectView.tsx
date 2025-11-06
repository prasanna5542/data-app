import React, { useState } from 'react';
import { Project, ShootLog } from '../types';
import { PlusIcon } from './icons/PlusIcon';
import { TrashIcon } from './icons/TrashIcon';
import { DownloadIcon } from './icons/DownloadIcon';
import { BackIcon } from './icons/BackIcon';
import ConfirmationModal from './ConfirmationModal';
import { XIcon } from './icons/XIcon';
import { ChevronDownIcon } from './icons/ChevronDownIcon';

interface ProjectViewProps {
  project: Project;
  onSelectLog: (logId: string) => void;
  onAddShootLog: (name: string, date: string, location: string) => void;
  onDeleteShootLog: (logId: string) => void;
  onAddLensPreset: (lens: string) => void;
  onDeleteLensPreset: (lens: string) => void;
  onAddCameraNamePreset: (name: string) => void;
  onDeleteCameraNamePreset: (name: string) => void;
  onAddCameraModelPreset: (model: string) => void;
  onDeleteCameraModelPreset: (model: string) => void;
  onExportProject: () => void;
  onBack: () => void;
}

const ProjectView: React.FC<ProjectViewProps> = ({ 
    project, 
    onSelectLog, 
    onAddShootLog, 
    onDeleteShootLog,
    onAddLensPreset,
    onDeleteLensPreset,
    onAddCameraNamePreset,
    onDeleteCameraNamePreset,
    onAddCameraModelPreset,
    onDeleteCameraModelPreset,
    onExportProject,
    onBack,
}) => {
  const [newLogName, setNewLogName] = useState('');
  const [newLogDate, setNewLogDate] = useState(new Date().toISOString().split('T')[0]);
  const [newLogLocation, setNewLogLocation] = useState('');
  
  const [newLensPreset, setNewLensPreset] = useState('');
  const [newCameraNamePreset, setNewCameraNamePreset] = useState('');
  const [newCameraModelPreset, setNewCameraModelPreset] = useState('');

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [logToDelete, setLogToDelete] = useState<ShootLog | null>(null);
  
  const [isPresetsSectionOpen, setIsPresetsSectionOpen] = useState(false);

  const handleAddLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (newLogName.trim() && newLogDate && newLogLocation.trim()) {
      onAddShootLog(newLogName.trim(), newLogDate, newLogLocation.trim());
      setNewLogName('');
      setNewLogLocation('');
      // Keep date for convenience
    }
  };
  
  const handleAddLensPreset = (e: React.FormEvent) => {
    e.preventDefault();
    if (newLensPreset.trim()) {
        onAddLensPreset(newLensPreset.trim());
        setNewLensPreset('');
    }
  };
  
  const handleAddCameraNamePreset = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCameraNamePreset.trim()) {
        onAddCameraNamePreset(newCameraNamePreset.trim());
        setNewCameraNamePreset('');
    }
  };
  
  const handleAddCameraModelPreset = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCameraModelPreset.trim()) {
        onAddCameraModelPreset(newCameraModelPreset.trim());
        setNewCameraModelPreset('');
    }
  };

  const openDeleteModal = (log: ShootLog) => {
      setLogToDelete(log);
      setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
      setIsDeleteModalOpen(false);
      setLogToDelete(null);
  };

  const confirmDelete = () => {
      if (logToDelete) {
          onDeleteShootLog(logToDelete.id);
      }
      closeDeleteModal();
  };


  return (
    <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div className="flex items-center gap-4">
                <button onClick={onBack} className="p-2 rounded-full bg-surface hover:bg-surface-light transition-colors" title="Back to Projects">
                    <BackIcon />
                </button>
                <h1 className="text-4xl font-bold text-text-primary truncate">{project.name}</h1>
            </div>
            <div className="flex gap-2 self-end sm:self-center">
                <button onClick={onExportProject} className="flex items-center gap-2 bg-surface hover:bg-surface-light text-text-primary font-bold py-2 px-4 rounded-lg border border-border transition-colors duration-300">
                    <DownloadIcon /> Export Project
                </button>
            </div>
        </div>

        <form onSubmit={handleAddLog} className="mb-8 p-6 bg-surface rounded-lg shadow-md border border-border">
            <h3 className="text-xl font-semibold mb-4 text-text-primary">Add New Shoot Log</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div>
                    <label htmlFor="log-name" className="block text-sm font-medium text-text-secondary mb-1">Shoot Day Name</label>
                    <input
                      id="log-name"
                      type="text"
                      placeholder="e.g., Day 1, 2nd Unit"
                      value={newLogName}
                      onChange={(e) => setNewLogName(e.target.value)}
                      className="w-full bg-background border border-border rounded-lg px-4 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>
                <div>
                    <label htmlFor="log-date" className="block text-sm font-medium text-text-secondary mb-1">Date</label>
                    <input
                      id="log-date"
                      type="date"
                      value={newLogDate}
                      onChange={(e) => setNewLogDate(e.target.value)}
                      className="w-full bg-background border border-border rounded-lg px-4 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>
                <div>
                    <label htmlFor="log-location" className="block text-sm font-medium text-text-secondary mb-1">Location</label>
                    <input
                      id="log-location"
                      type="text"
                      placeholder="e.g., Studio 5, Desert Set"
                      value={newLogLocation}
                      onChange={(e) => setNewLogLocation(e.target.value)}
                      className="w-full bg-background border border-border rounded-lg px-4 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>
            </div>
            <button type="submit" className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-focus text-black font-bold py-3 mt-4 rounded-lg transition-colors duration-300 disabled:opacity-50" disabled={!newLogName.trim() || !newLogDate || !newLogLocation.trim()}>
                <PlusIcon /> Add Shoot Log
            </button>
      </form>
      
      <div className="mb-8 bg-surface rounded-lg shadow-md border border-border">
        <button
          onClick={() => setIsPresetsSectionOpen(prev => !prev)}
          className="w-full flex justify-between items-center p-4 text-left focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary rounded-lg transition-colors hover:bg-surface-light"
          aria-expanded={isPresetsSectionOpen}
          aria-controls="presets-content"
        >
          <h3 className="text-xl font-semibold text-text-primary">Manage Presets</h3>
          <ChevronDownIcon className={`h-6 w-6 text-text-secondary transition-transform duration-300 ${isPresetsSectionOpen ? 'rotate-180' : ''}`} />
        </button>

        {isPresetsSectionOpen && (
          <div id="presets-content" className="p-6 pt-4 border-t border-border">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Lens Presets */}
              <div className="bg-background rounded-lg border border-border p-4">
                <h3 className="text-lg font-semibold mb-3 text-text-primary">Lens Presets</h3>
                <form onSubmit={handleAddLensPreset} className="flex items-center gap-2 mb-3">
                    <input
                        type="text"
                        value={newLensPreset}
                        onChange={(e) => setNewLensPreset(e.target.value)}
                        placeholder="e.g., 50mm"
                        className="flex-grow bg-surface border border-border rounded-md px-3 py-1.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <button
                        type="submit"
                        className="flex-shrink-0 flex items-center justify-center gap-1.5 bg-surface hover:bg-surface-light text-text-primary font-bold py-1.5 px-3 rounded-md border border-border transition-colors duration-300 disabled:opacity-50 text-sm"
                        disabled={!newLensPreset.trim()}
                    >
                        <PlusIcon /> Add
                    </button>
                </form>
                <div className="flex flex-wrap gap-1.5 min-h-[24px]">
                    {(project.lensPresets && project.lensPresets.length > 0) ? (
                        project.lensPresets.map(lens => (
                            <div key={lens} className="flex items-center gap-1.5 bg-surface-light rounded-full px-2.5 py-1 text-xs text-text-primary">
                                <span>{lens}</span>
                                <button onClick={() => onDeleteLensPreset(lens)} className="text-gray-500 hover:text-red-400 rounded-full hover:bg-gray-600 p-0.5 transition-colors">
                                    <XIcon />
                                </button>
                            </div>
                        ))
                    ) : ( <p className="text-text-secondary text-xs italic px-1">No presets defined.</p> )}
                </div>
              </div>
              
              {/* Camera Name Presets */}
              <div className="bg-background rounded-lg border border-border p-4">
                <h3 className="text-lg font-semibold mb-3 text-text-primary">Camera Name Presets</h3>
                <form onSubmit={handleAddCameraNamePreset} className="flex items-center gap-2 mb-3">
                    <input
                        type="text"
                        value={newCameraNamePreset}
                        onChange={(e) => setNewCameraNamePreset(e.target.value)}
                        placeholder="e.g., A Cam"
                        className="flex-grow bg-surface border border-border rounded-md px-3 py-1.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <button
                        type="submit"
                        className="flex-shrink-0 flex items-center justify-center gap-1.5 bg-surface hover:bg-surface-light text-text-primary font-bold py-1.5 px-3 rounded-md border border-border transition-colors duration-300 disabled:opacity-50 text-sm"
                        disabled={!newCameraNamePreset.trim()}
                    >
                        <PlusIcon /> Add
                    </button>
                </form>
                <div className="flex flex-wrap gap-1.5 min-h-[24px]">
                    {(project.cameraNamePresets && project.cameraNamePresets.length > 0) ? (
                        project.cameraNamePresets.map(name => (
                            <div key={name} className="flex items-center gap-1.5 bg-surface-light rounded-full px-2.5 py-1 text-xs text-text-primary">
                                <span>{name}</span>
                                <button onClick={() => onDeleteCameraNamePreset(name)} className="text-gray-500 hover:text-red-400 rounded-full hover:bg-gray-600 p-0.5 transition-colors">
                                    <XIcon />
                                </button>
                            </div>
                        ))
                    ) : ( <p className="text-text-secondary text-xs italic px-1">No presets defined.</p> )}
                </div>
              </div>

              {/* Camera Model Presets */}
              <div className="bg-background rounded-lg border border-border p-4">
                <h3 className="text-lg font-semibold mb-3 text-text-primary">Camera Model Presets</h3>
                <form onSubmit={handleAddCameraModelPreset} className="flex items-center gap-2 mb-3">
                    <input
                        type="text"
                        value={newCameraModelPreset}
                        onChange={(e) => setNewCameraModelPreset(e.target.value)}
                        placeholder="e.g., ARRI Alexa"
                        className="flex-grow bg-surface border border-border rounded-md px-3 py-1.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <button
                        type="submit"
                        className="flex-shrink-0 flex items-center justify-center gap-1.5 bg-surface hover:bg-surface-light text-text-primary font-bold py-1.5 px-3 rounded-md border border-border transition-colors duration-300 disabled:opacity-50 text-sm"
                        disabled={!newCameraModelPreset.trim()}
                    >
                        <PlusIcon /> Add
                    </button>
                </form>
                <div className="flex flex-wrap gap-1.5 min-h-[24px]">
                    {(project.cameraModelPresets && project.cameraModelPresets.length > 0) ? (
                        project.cameraModelPresets.map(model => (
                            <div key={model} className="flex items-center gap-1.5 bg-surface-light rounded-full px-2.5 py-1 text-xs text-text-primary">
                                <span>{model}</span>
                                <button onClick={() => onDeleteCameraModelPreset(model)} className="text-gray-500 hover:text-red-400 rounded-full hover:bg-gray-600 p-0.5 transition-colors">
                                    <XIcon />
                                </button>
                            </div>
                        ))
                    ) : ( <p className="text-text-secondary text-xs italic px-1">No presets defined.</p> )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <h3 className="text-2xl font-semibold mb-4 text-text-primary">Shoot Logs</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {project.shootLogs.length > 0 ? (
            project.shootLogs.map(log => (
            <div key={log.id} className="bg-surface rounded-lg border border-border shadow-lg p-6 group transition-all duration-300 transform hover:border-primary hover:-translate-y-1">
              <div className="flex justify-between items-start">
                  <div onClick={() => onSelectLog(log.id)} className="cursor-pointer flex-grow min-w-0">
                    <h2 className="text-xl font-semibold text-text-primary mb-1 group-hover:text-primary transition-colors truncate">
                        {log.name}
                    </h2>
                    <p className="text-text-secondary text-sm truncate">{log.location}</p>
                    <p className="text-text-secondary text-sm">
                        {new Date(log.date + 'T00:00:00').toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                    <p className="text-text-secondary mt-3 text-xs">{log.data.length} entries</p>
                  </div>
                  <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        openDeleteModal(log);
                    }} 
                    className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-500 transition-opacity p-2 -mr-2 -mt-2 flex-shrink-0"
                    title="Delete Log"
                  >
                    <TrashIcon />
                  </button>
              </div>
            </div>
          ))
        ) : (
            <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-12 bg-surface rounded-lg border border-border">
                <h2 className="text-lg text-text-secondary">No shoot logs for this project.</h2>
                <p className="text-text-secondary mt-1">Add a new shoot log to start entering camera data.</p>
            </div>
        )}
      </div>
       <ConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
          onConfirm={confirmDelete}
          title="Delete Shoot Log?"
          message={`Are you sure you want to delete the log "${logToDelete?.name}"? All recorded data for this day will be lost. This action cannot be undone.`}
      />
    </div>
  );
};

export default ProjectView;