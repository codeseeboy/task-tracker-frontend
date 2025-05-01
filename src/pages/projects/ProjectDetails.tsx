"use client"

import type React from "react"
import { useState } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import Button from "../../components/ui/Button"
import LoadingSpinner from "../../components/ui/LoadingSpinner"
import EmptyState from "../../components/ui/EmptyState"
import Card, { CardBody, CardHeader } from "../../components/ui/Card"
import TaskCard from "../../components/tasks/TaskCard"
import TaskForm from "../../components/tasks/TaskForm"
import Modal from "../../components/ui/Modal"
import Confirmation from "../../components/ui/Confirmation"
import ProjectForm from "../../components/projects/ProjectForm"
import ProgressBar from "../../components/ui/ProgressBar"
import { useProject } from "../../hooks/useProjects"
import { useTasks } from "../../hooks/useTasks"
import type { Task, TaskStatus, TaskUpdateDto } from "../../types/task"

const ProjectDetails: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>()
  const navigate = useNavigate()

  console.log("Project ID from params:", projectId)

  const { project, isLoading: isLoadingProject } = useProject(projectId || "")
  console.log("Project Details:", project)

  const {
    tasks,
    isLoading: isLoadingTasks,
    createTask,
    updateTask,
    deleteTask,
    isCreating,
    isUpdating,
    isDeleting,
  } = useTasks(projectId)
  console.log("Tasks for project:", tasks)

  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false)
  const [isEditTaskModalOpen, setIsEditTaskModalOpen] = useState(false)
  const [isDeleteTaskModalOpen, setIsDeleteTaskModalOpen] = useState(false)
  const [isEditProjectModalOpen, setIsEditProjectModalOpen] = useState(false)
  const [isDeleteProjectModalOpen, setIsDeleteProjectModalOpen] = useState(false)
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)

  const isLoading = isLoadingProject || isLoadingTasks

  if (isLoading) {
    return <LoadingSpinner fullScreen />
  }

  if (!project) {
    return (
      <EmptyState
        title="Project not found"
        description="The project you're looking for doesn't exist or you don't have access to it."
        actionLabel="Back to Projects"
        onAction={() => navigate("/projects")}
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
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        }
      />
    )
  }

  const selectedTask = selectedTaskId ? tasks.find((task: { id: string }) => task.id === selectedTaskId) : null

  // Calculate task statistics
  const totalTasks = tasks.length
  const completedTasks = tasks.filter((task: { status: string }) => task.status === "DONE").length
  const inProgressTasks = tasks.filter((task: { status: string }) => task.status === "IN_PROGRESS").length
  const todoTasks = tasks.filter((task: { status: string }) => task.status === "TODO").length
  const reviewTasks = tasks.filter((task: { status: string }) => task.status === "REVIEW").length

  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0

  const handleCreateTask = (data: any) => {
    createTask(
      {
        ...data,
        projectId: project.id,
      },
      {
        onSuccess: () => {
          setIsCreateTaskModalOpen(false)
        },
      },
    )
  }

  const handleUpdateTask = (data: TaskUpdateDto) => {
    if (selectedTaskId) {
      updateTask(
        { taskId: selectedTaskId, data },
        {
          onSuccess: () => {
            setIsEditTaskModalOpen(false)
            setSelectedTaskId(null)
          },
        },
      )
    }
  }

  const handleDeleteTask = () => {
    if (selectedTaskId) {
      deleteTask(selectedTaskId, {
        onSuccess: () => {
          setIsDeleteTaskModalOpen(false)
          setSelectedTaskId(null)
        },
      })
    }
  }

  const handleStatusChange = (taskId: string, status: TaskStatus) => {
    updateTask({ taskId, data: { status } })
  }

  const openEditTaskModal = (taskId: string) => {
    setSelectedTaskId(taskId)
    setIsEditTaskModalOpen(true)
  }

  const openDeleteTaskModal = (taskId: string) => {
    setSelectedTaskId(taskId)
    setIsDeleteTaskModalOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Link to="/projects" className="text-blue-600 dark:text-blue-400 hover:underline">
              Projects
            </Link>
            <span className="text-gray-500 dark:text-gray-400">/</span>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{project.name}</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mt-1">{project.description}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={() => setIsCreateTaskModalOpen(true)}
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
            Add Task
          </Button>
          <Button
            variant="outline"
            onClick={() => setIsEditProjectModalOpen(true)}
            leftIcon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            }
          >
            Edit Project
          </Button>
          <Button
            variant="danger"
            onClick={() => setIsDeleteProjectModalOpen(true)}
            leftIcon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            }
          >
            Delete Project
          </Button>
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Project Progress</h2>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Overall Completion</span>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {completionRate.toFixed(0)}%
                  </span>
                </div>
                <ProgressBar value={completionRate} color="blue" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400">To Do</div>
                  <div className="mt-1 text-2xl font-semibold">{todoTasks}</div>
                  <ProgressBar value={todoTasks} max={totalTasks || 1} color="indigo" className="mt-2" />
                </div>

                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400">In Progress</div>
                  <div className="mt-1 text-2xl font-semibold">{inProgressTasks}</div>
                  <ProgressBar value={inProgressTasks} max={totalTasks || 1} color="blue" className="mt-2" />
                </div>

                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400">In Review</div>
                  <div className="mt-1 text-2xl font-semibold">{reviewTasks}</div>
                  <ProgressBar value={reviewTasks} max={totalTasks || 1} color="yellow" className="mt-2" />
                </div>

                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Completed</div>
                  <div className="mt-1 text-2xl font-semibold">{completedTasks}</div>
                  <ProgressBar value={completedTasks} max={totalTasks || 1} color="green" className="mt-2" />
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </motion.div>

      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Tasks</h2>

        {tasks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map((task: Task, index: number) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <TaskCard
                  task={task}
                  onEdit={() => openEditTaskModal(task.id)}
                  onDelete={() => openDeleteTaskModal(task.id)}
                  onStatusChange={(status) => handleStatusChange(task.id, status)}
                />
              </motion.div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No tasks found"
            description="Add tasks to this project to start tracking progress"
            actionLabel="Add Task"
            onAction={() => setIsCreateTaskModalOpen(true)}
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
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                />
              </svg>
            }
          />
        )}
      </div>

      {/* Create Task Modal */}
      <Modal isOpen={isCreateTaskModalOpen} onClose={() => setIsCreateTaskModalOpen(false)} title="Add New Task">
        <TaskForm
          onSubmit={handleCreateTask}
          projects={[project]}
          isLoading={isCreating}
          selectedProjectId={project.id}
        />
      </Modal>

      {/* Edit Task Modal */}
      <Modal isOpen={isEditTaskModalOpen} onClose={() => setIsEditTaskModalOpen(false)} title="Edit Task">
        {selectedTask && (
          <TaskForm
            onSubmit={handleUpdateTask}
            task={selectedTask}
            projects={[project]}
            isLoading={isUpdating}
            selectedProjectId={project.id}
          />
        )}
      </Modal>

      {/* Delete Task Confirmation */}
      <Confirmation
        isOpen={isDeleteTaskModalOpen}
        onClose={() => setIsDeleteTaskModalOpen(false)}
        onConfirm={handleDeleteTask}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
        confirmLabel="Delete"
        isLoading={isDeleting}
        variant="danger"
      />

      {/* Edit Project Modal */}
      <Modal isOpen={isEditProjectModalOpen} onClose={() => setIsEditProjectModalOpen(false)} title="Edit Project">
        <ProjectForm
          onSubmit={(data) => {
            // Handle project update
            setIsEditProjectModalOpen(false)
          }}
          project={project}
          isLoading={false}
        />
      </Modal>

      {/* Delete Project Confirmation */}
      <Confirmation
        isOpen={isDeleteProjectModalOpen}
        onClose={() => setIsDeleteProjectModalOpen(false)}
        onConfirm={() => {
          // Handle project deletion
          navigate("/projects")
        }}
        title="Delete Project"
        message="Are you sure you want to delete this project? All associated tasks will also be deleted. This action cannot be undone."
        confirmLabel="Delete"
        isLoading={false}
        variant="danger"
      />
    </div>
  )
}

export default ProjectDetails
