import React, { useState } from 'react';
import { Project } from '../types';
import { PlusIcon } from './icons/PlusIcon';
import { TrashIcon } from './icons/TrashIcon';
import { FolderIcon } from './icons/FolderIcon';
import ConfirmationModal from './ConfirmationModal';

interface ProjectListProps {
  projects: Project[];
  onSelectProject: (projectId: string) => void;
  onAddProject: (name: string) => void;
  onDeleteProject: (projectId: string) => void;
}

const ProjectList: React.FC<ProjectListProps> = ({ projects, onSelectProject, onAddProject, onDeleteProject }) => {
    const [newProjectName, setNewProjectName] = useState('');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

    const handleAddProject = (e: React.FormEvent) => {
        e.preventDefault();
        if (newProjectName.trim()) {
            onAddProject(newProjectName.trim());
            setNewProjectName('');
        }
    };
    
    const openDeleteModal = (project: Project) => {
        setProjectToDelete(project);
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setProjectToDelete(null);
    };

    const confirmDelete = () => {
        if (projectToDelete) {
            onDeleteProject(projectToDelete.id);
        }
        closeDeleteModal();
    };

    return (
        <div className="animate-fade-in max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold text-text-primary">Projects</h1>
            </div>

            <form onSubmit={handleAddProject} className="mb-12 p-6 bg-surface rounded-lg shadow-md border border-border">
                <h3 className="text-xl font-semibold mb-4 text-text-primary">Create New Project</h3>
                <div className="flex flex-col sm:flex-row gap-3">
                    <input
                        type="text"
                        value={newProjectName}
                        onChange={(e) => setNewProjectName(e.target.value)}
                        placeholder="Enter Project Name"
                        className="flex-grow bg-background border border-border rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <button
                        type="submit"
                        className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-focus text-black font-bold py-3 px-6 rounded-lg transition-colors duration-300 disabled:opacity-50"
                        disabled={!newProjectName.trim()}
                    >
                        <PlusIcon />
                        Create Project
                    </button>
                </div>
            </form>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.length > 0 ? (
                    projects.map(project => (
                        <div key={project.id} className="bg-surface rounded-lg border border-border shadow-lg p-6 group transition-all duration-300 transform hover:border-primary hover:-translate-y-1">
                            <div className="flex justify-between items-start">
                                <div onClick={() => onSelectProject(project.id)} className="cursor-pointer flex-grow min-w-0">
                                    <div className="flex items-center gap-3 mb-2">
                                        <FolderIcon />
                                        <h2 className="text-xl font-semibold text-text-primary group-hover:text-primary transition-colors truncate">
                                            {project.name}
                                        </h2>
                                    </div>
                                    <p className="text-text-secondary text-sm">
                                        {project.shootLogs.length} shoot log{project.shootLogs.length !== 1 ? 's' : ''}
                                    </p>
                                </div>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        openDeleteModal(project);
                                    }}
                                    className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-500 transition-opacity p-2 -mr-2 -mt-2 flex-shrink-0"
                                    title="Delete Project"
                                >
                                    <TrashIcon />
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-20 bg-surface rounded-lg border border-border">
                        <h2 className="text-2xl font-bold text-text-primary">Welcome to VFX Camera Log</h2>
                        <p className="text-lg text-text-secondary mt-2">Create your first project to get started.</p>
                    </div>
                )}
            </div>
             <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={closeDeleteModal}
                onConfirm={confirmDelete}
                title="Delete Project?"
                message={`Are you sure you want to delete the project "${projectToDelete?.name}" and all its associated data? This action cannot be undone.`}
            />
        </div>
    );
};

export default ProjectList;