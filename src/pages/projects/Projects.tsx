"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import Button from "../../components/ui/Button"
import LoadingSpinner from "../../components/ui/LoadingSpinner"
import EmptyState from "../../components/ui/EmptyState"
import ProjectCard from "../../components/projects/ProjectCard"
import ProjectForm from "../../components/projects/ProjectForm"
import Modal from "../../components/ui/Modal"
import Confirmation from "../../components/ui/Confirmation"
import { useProjects } from "../../hooks/useProjects"
import type { Project, ProjectCreateDto, ProjectUpdateDto } from "../../types/project"

const Projects: React.FC = () => {
  const { projects, isLoading, createProject, updateProject, deleteProject, isCreating, isUpdating, isDeleting } =
    useProjects()

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  // This function handles form submission for creating a project
  const handleCreateProject = (data: ProjectCreateDto | ProjectUpdateDto) => {
    // We know this will be treated as a ProjectCreateDto
    createProject(data as ProjectCreateDto, {
      onSuccess: () => {
        setIsCreateModalOpen(false)
      },
    })
  }

  // This function handles form submission for updating a project
  const handleUpdateProject = (data: ProjectCreateDto | ProjectUpdateDto) => {
    if (selectedProject) {
      updateProject(
        { projectId: selectedProject.id, data: data as ProjectUpdateDto },
        {
          onSuccess: () => {
            setIsEditModalOpen(false)
            setSelectedProject(null)
          },
        },
      )
    }
  }

  const handleDeleteProject = () => {
    if (selectedProject) {
      deleteProject(selectedProject.id, {
        onSuccess: () => {
          setIsDeleteModalOpen(false)
          setSelectedProject(null)
        },
      })
    }
  }

  const openEditModal = (project: Project) => {
    setSelectedProject(project)
    setIsEditModalOpen(true)
  }

  const openDeleteModal = (project: Project) => {
    setSelectedProject(project)
    setIsDeleteModalOpen(true)
  }

  if (isLoading) {
    return <LoadingSpinner fullScreen />
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Projects</h1>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          leftIcon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          }
        >
          Create Project
        </Button>
      </div>

      {projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project: Project, index: number) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <ProjectCard
                project={project}
                onEdit={() => openEditModal(project)}
                onDelete={() => openDeleteModal(project)}
              />
            </motion.div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No projects found"
          description="Create your first project to get started tracking tasks"
          actionLabel="Create Project"
          onAction={() => setIsCreateModalOpen(true)}
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          }
        />
      )}

      {/* Create Project Modal */}
      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Create New Project">
        <ProjectForm 
          onSubmit={handleCreateProject} 
          isLoading={isCreating} 
          mode="create"
        />
      </Modal>

      {/* Edit Project Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Project">
        {selectedProject && (
          <ProjectForm 
            onSubmit={handleUpdateProject} 
            project={selectedProject} 
            isLoading={isUpdating}
            mode="update"
          />
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Confirmation
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteProject}
        title="Delete Project"
        message="Are you sure you want to delete this project? This action cannot be undone and all associated tasks will also be deleted."
        confirmLabel="Delete"
        isLoading={isDeleting}
        variant="danger"
      />
    </div>
  )
}

export default Projects