import React, { useState, useEffect, useCallback } from 'react';
import { Project, ShootLog, SheetRow } from './types';
import { getProjects, saveProjects } from './services/storageService';
import ProjectList from './components/ProjectList';
import ProjectView from './components/ProjectView';
import DateView from './components/DateView';
import { exportProjectToCSV } from './services/exportService';

type View = 'home' | 'project' | 'log';

const App: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentView, setCurrentView] = useState<View>('home');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [selectedLogId, setSelectedLogId] = useState<string | null>(null);

  useEffect(() => {
    setProjects(getProjects());
  }, []);

  useEffect(() => {
    saveProjects(projects);
  }, [projects]);

  const selectProject = (projectId: string) => {
    setSelectedProjectId(projectId);
    setSelectedLogId(null);
    setCurrentView('project');
  };

  const selectLog = (logId: string) => {
    setSelectedLogId(logId);
    setCurrentView('log');
  };
  
  const handleBack = () => {
    if (currentView === 'log') {
        setSelectedLogId(null);
        setCurrentView('project');
    } else if (currentView === 'project') {
        setSelectedProjectId(null);
        setCurrentView('home');
    }
  }

  const addProject = (name: string) => {
    const newProject: Project = {
      id: crypto.randomUUID(),
      name,
      shootLogs: [],
      lensPresets: [],
      cameraNamePresets: [],
      cameraModelPresets: [],
    };
    setProjects(prev => [...prev, newProject]);
    selectProject(newProject.id); // Navigate to the new project
  };

  const deleteProject = (projectId: string) => {
    setProjects(prev => prev.filter(p => p.id !== projectId));
    if (selectedProjectId === projectId) {
      setSelectedProjectId(null);
      setCurrentView('home');
    }
  }

  const addShootLog = (projectId: string, name: string, date: string, location: string) => {
    const newLog: ShootLog = {
      id: crypto.randomUUID(),
      name,
      date,
      location,
      data: [],
    };
    setProjects(prev => prev.map(p => 
      p.id === projectId ? { ...p, shootLogs: [...p.shootLogs, newLog].sort((a, b) => b.date.localeCompare(a.date)) } : p
    ));
    selectLog(newLog.id); // Navigate to the new log
  };

  const deleteShootLog = (projectId: string, logId: string) => {
    setProjects(prev => prev.map(p => 
        p.id === projectId ? { ...p, shootLogs: p.shootLogs.filter(log => log.id !== logId) } : p
    ));
    if (selectedLogId === logId) {
        setSelectedLogId(null);
        setCurrentView('project');
    }
  };
  
  const addLensPreset = (projectId: string, lens: string) => {
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        const presets = [...(p.lensPresets || [])];
        if (!presets.includes(lens.trim())) {
          presets.push(lens.trim());
        }
        // Sort alphabetically and numerically for consistent display
        presets.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
        return { ...p, lensPresets: presets };
      }
      return p;
    }));
  };

  const deleteLensPreset = (projectId: string, lens: string) => {
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return { ...p, lensPresets: (p.lensPresets || []).filter(l => l !== lens) };
      }
      return p;
    }));
  };

  const addCameraNamePreset = (projectId: string, name: string) => {
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        const presets = [...(p.cameraNamePresets || [])];
        if (!presets.includes(name.trim())) {
          presets.push(name.trim());
        }
        presets.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
        return { ...p, cameraNamePresets: presets };
      }
      return p;
    }));
  };

  const deleteCameraNamePreset = (projectId: string, name: string) => {
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return { ...p, cameraNamePresets: (p.cameraNamePresets || []).filter(l => l !== name) };
      }
      return p;
    }));
  };

  const addCameraModelPreset = (projectId: string, model: string) => {
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        const presets = [...(p.cameraModelPresets || [])];
        if (!presets.includes(model.trim())) {
          presets.push(model.trim());
        }
        presets.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
        return { ...p, cameraModelPresets: presets };
      }
      return p;
    }));
  };

  const deleteCameraModelPreset = (projectId: string, model: string) => {
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return { ...p, cameraModelPresets: (p.cameraModelPresets || []).filter(l => l !== model) };
      }
      return p;
    }));
  };

  const updateShootLogData = useCallback((projectId: string, logId: string, newData: SheetRow[]) => {
    setProjects(prevProjects => 
      prevProjects.map(p => 
        p.id === projectId 
          ? {
              ...p,
              shootLogs: p.shootLogs.map(log => 
                log.id === logId ? { ...log, data: newData } : log
              )
            } 
          : p
      )
    );
  }, []);

  const handleExportProject = (projectId: string) => {
      const project = projects.find(p => p.id === projectId);
      if (project) {
          exportProjectToCSV(project);
      }
  };

  const selectedProject = projects.find(p => p.id === selectedProjectId);
  const selectedLog = selectedProject?.shootLogs.find(log => log.id === selectedLogId);

  const renderContent = () => {
    switch (currentView) {
      case 'log':
        if (selectedProject && selectedLog) {
          return (
            <DateView 
              project={selectedProject}
              shootLog={selectedLog}
              onUpdateData={(newData) => updateShootLogData(selectedProject.id, selectedLog.id, newData)}
              onBack={handleBack}
            />
          );
        }
        setCurrentView('home'); // Fallback
        return null;
      case 'project':
        if (selectedProject) {
          return (
            <ProjectView
              project={selectedProject}
              onSelectLog={selectLog}
              onAddShootLog={(name, date, location) => addShootLog(selectedProject.id, name, date, location)}
              onDeleteShootLog={(logId) => deleteShootLog(selectedProject.id, logId)}
              onAddLensPreset={(lens) => addLensPreset(selectedProject.id, lens)}
              onDeleteLensPreset={(lens) => deleteLensPreset(selectedProject.id, lens)}
              onAddCameraNamePreset={(name) => addCameraNamePreset(selectedProject.id, name)}
              onDeleteCameraNamePreset={(name) => deleteCameraNamePreset(selectedProject.id, name)}
              onAddCameraModelPreset={(model) => addCameraModelPreset(selectedProject.id, model)}
              onDeleteCameraModelPreset={(model) => deleteCameraModelPreset(selectedProject.id, model)}
              onExportProject={() => handleExportProject(selectedProject.id)}
              onBack={handleBack}
            />
          );
        }
        setCurrentView('home'); // Fallback
        return null;
      case 'home':
      default:
        return (
            <ProjectList 
                projects={projects}
                onSelectProject={selectProject}
                onAddProject={addProject}
                onDeleteProject={deleteProject}
            />
        );
    }
  };

  return (
    <div className="bg-background text-text-primary min-h-screen">
        <header className="p-4 border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-20">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-2xl font-bold text-text-primary">VFX Camera Log</h1>
            </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
            {renderContent()}
        </main>
    </div>
  );
};

export default App;