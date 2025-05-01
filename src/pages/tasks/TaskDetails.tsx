"use client"

import type React from "react"
import { useState } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import Button from "../../components/ui/Button"
import LoadingSpinner from "../../components/ui/LoadingSpinner"
import EmptyState from "../../components/ui/EmptyState"
import Card, { CardBody, CardHeader } from "../../components/ui/Card"
import Badge from "../../components/ui/Badge"
import ProgressBar from "../../components/ui/ProgressBar"
import Modal from "../../components/ui/Modal"
import Confirmation from "../../components/ui/Confirmation"
import TaskForm from "../../components/tasks/TaskForm"
import { useTask } from "../../hooks/useTasks"
import { useProjects } from "../../hooks/useProjects"
import type { Task, TaskStatus, TaskUpdateDto } from "../../types/task"
import type { Project } from "../../types/project"

const TaskDetails: React.FC = () => {
  const { taskId } = useParams<{ taskId: string }>()
  const navigate = useNavigate()
  const { task, isLoading: isLoadingTask } = useTask(taskId || "")
  const { projects, isLoading: isLoadingProjects } = useProjects()

  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const isLoading = isLoadingTask || isLoadingProjects

  if (isLoading) {
    return <LoadingSpinner fullScreen />
  }

  if (!task) {
    return (
      <EmptyState
        title="Task not found"
        description="The task you're looking for doesn't exist or you don't have access to it."
        actionLabel="Back to Tasks"
        onAction={() => navigate("/tasks")}
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

  const taskData = task as unknown as Task
  const project = projects.find((p: Project) => p.id === taskData.projectId)

  const getStatusBadgeVariant = (status: TaskStatus) => {
    switch (status) {
      case "TODO":
        return "default"
      case "IN_PROGRESS":
        return "primary"
      case "REVIEW":
        return "warning"
      case "DONE":
        return "success"
      default:
        return "default"
    }
  }

  const getStatusLabel = (status: TaskStatus) => {
    switch (status) {
      case "TODO":
        return "To Do"
      case "IN_PROGRESS":
        return "In Progress"
      case "REVIEW":
        return "In Review"
      case "DONE":
        return "Done"
      default:
        return status
    }
  }

  const getProgressPercentage = (status: TaskStatus): number => {
    switch (status) {
      case "TODO":
        return 0
      case "IN_PROGRESS":
        return 33
      case "REVIEW":
        return 66
      case "DONE":
        return 100
      default:
        return 0
    }
  }

  const handleUpdateTask = (data: TaskUpdateDto) => {
    // Handle task update
    setIsEditModalOpen(false)
  }

  const handleDeleteTask = () => {
    // Handle task deletion
    navigate("/tasks")
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Link to="/tasks" className="text-blue-600 dark:text-blue-400 hover:underline">
              Tasks
            </Link>
            <span className="text-gray-500 dark:text-gray-400">/</span>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{taskData.title}</h1>
          </div>
          {project && (
            <div className="mt-1">
              <Link to={`/projects/${project.id}`} className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                {project.name}
              </Link>
            </div>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={() => setIsEditModalOpen(true)}
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
            Edit Task
          </Button>
          <Button
            variant="danger"
            onClick={() => setIsDeleteModalOpen(true)}
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
            Delete Task
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Task Details</h2>
                <Badge variant={getStatusBadgeVariant(taskData.status)}>{getStatusLabel(taskData.status)}</Badge>
              </div>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Description</h3>
                  <p className="mt-1 text-gray-900 dark:text-white">{taskData.description}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Progress</h3>
                  <div className="mt-2">
                    <ProgressBar
                      value={getProgressPercentage(taskData.status)}
                      color={taskData.status === "DONE" ? "green" : "blue"}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Created</h3>
                    <p className="mt-1 text-gray-900 dark:text-white">{new Date(taskData.createdAt).toLocaleString()}</p>
                  </div>
                  {taskData.completedAt && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Completed</h3>
                      <p className="mt-1 text-gray-900 dark:text-white">
                        {new Date(taskData.completedAt).toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CardBody>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Project</h2>
            </CardHeader>
            <CardBody>
              {project ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Project Name</h3>
                    <Link
                      to={`/projects/${project.id}`}
                      className="mt-1 block text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      {project.name}
                    </Link>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Description</h3>
                    <p className="mt-1 text-gray-900 dark:text-white line-clamp-3">{project.description}</p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">Project not found</p>
              )}
            </CardBody>
          </Card>
        </motion.div>
      </div>

      {/* Edit Task Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Task">
        <TaskForm onSubmit={handleUpdateTask} task={taskData} projects={projects} isLoading={false} />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Confirmation
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteTask}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
        confirmLabel="Delete"
        isLoading={false}
        variant="danger"
      />
    </div>
  )
}

export default TaskDetails