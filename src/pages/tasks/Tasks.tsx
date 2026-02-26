"use client"

import type React from "react"
import { useState, useCallback } from "react"
import { motion } from "framer-motion"
import Button from "../../components/ui/Button"
import LoadingSpinner from "../../components/ui/LoadingSpinner"
import EmptyState from "../../components/ui/EmptyState"
import TaskCard from "../../components/tasks/TaskCard"
import TaskForm from "../../components/tasks/TaskForm"
import Modal from "../../components/ui/Modal"
import Confirmation from "../../components/ui/Confirmation"
import { useTasks } from "../../hooks/useTasks"
import { useProjects } from "../../hooks/useProjects"
import type { Task, TaskStatus, TaskUpdateDto } from "../../types/task"

const TASKS_PER_PAGE = 9

const Tasks: React.FC = () => {
  const [filter, setFilter] = useState<TaskStatus | "ALL">("ALL")
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  // Debounced search - reset page when search or filter changes
  const handleFilterChange = (newFilter: TaskStatus | "ALL") => {
    setFilter(newFilter)
    setCurrentPage(1)
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    setCurrentPage(1)
  }

  const {
    tasks,
    pagination,
    isLoading: isLoadingTasks,
    createTask,
    updateTask,
    deleteTask,
    isCreating,
    isUpdating,
    isDeleting,
  } = useTasks({
    status: filter === "ALL" ? undefined : filter,
    search: searchQuery || undefined,
    page: currentPage,
    limit: TASKS_PER_PAGE,
  })

  const { projects, isLoading: isLoadingProjects } = useProjects()

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)

  const isLoading = isLoadingTasks || isLoadingProjects

  const selectedTask = selectedTaskId ? tasks.find((task: { id: string }) => task.id === selectedTaskId) : null

  const handleCreateTask = (data: any) => {
    createTask(data, {
      onSuccess: () => {
        setIsCreateModalOpen(false)
      },
    })
  }

  const handleUpdateTask = (data: TaskUpdateDto) => {
    if (selectedTaskId) {
      updateTask(
        { taskId: selectedTaskId, data },
        {
          onSuccess: () => {
            setIsEditModalOpen(false)
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
          setIsDeleteModalOpen(false)
          setSelectedTaskId(null)
        },
      })
    }
  }

  const handleStatusChange = (taskId: string, status: TaskStatus) => {
    updateTask({ taskId, data: { status } })
  }

  const openEditModal = (taskId: string) => {
    setSelectedTaskId(taskId)
    setIsEditModalOpen(true)
  }

  const openDeleteModal = (taskId: string) => {
    setSelectedTaskId(taskId)
    setIsDeleteModalOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Tasks</h1>
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
          Create Task
        </Button>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search tasks by title..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        {/* Status Filter Buttons */}
        <div className="flex rounded-md shadow-sm flex-wrap">
          <button
            onClick={() => handleFilterChange("ALL")}
            className={`px-4 py-2 text-sm font-medium rounded-l-md ${
              filter === "ALL"
                ? "bg-blue-600 text-white"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            }`}
          >
            All
          </button>
          <button
            onClick={() => handleFilterChange("TODO")}
            className={`px-4 py-2 text-sm font-medium ${
              filter === "TODO"
                ? "bg-blue-600 text-white"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            }`}
          >
            To Do
          </button>
          <button
            onClick={() => handleFilterChange("IN_PROGRESS")}
            className={`px-4 py-2 text-sm font-medium ${
              filter === "IN_PROGRESS"
                ? "bg-blue-600 text-white"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            }`}
          >
            In Progress
          </button>
          <button
            onClick={() => handleFilterChange("REVIEW")}
            className={`px-4 py-2 text-sm font-medium ${
              filter === "REVIEW"
                ? "bg-blue-600 text-white"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            }`}
          >
            Review
          </button>
          <button
            onClick={() => handleFilterChange("DONE")}
            className={`px-4 py-2 text-sm font-medium rounded-r-md ${
              filter === "DONE"
                ? "bg-blue-600 text-white"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            }`}
          >
            Done
          </button>
        </div>
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : tasks.length > 0 ? (
        <>
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
                  onEdit={() => openEditModal(task.id)}
                  onDelete={() => openDeleteModal(task.id)}
                  onStatusChange={(status) => handleStatusChange(task.id, status)}
                />
              </motion.div>
            ))}
          </div>

          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-4">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Showing{" "}
                <span className="font-medium">{(pagination.page - 1) * pagination.limit + 1}</span> to{" "}
                <span className="font-medium">
                  {Math.min(pagination.page * pagination.limit, pagination.total)}
                </span>{" "}
                of <span className="font-medium">{pagination.total}</span> tasks
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm font-medium rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 text-sm font-medium rounded-md ${
                      page === currentPage
                        ? "bg-blue-600 text-white"
                        : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(pagination.totalPages, p + 1))}
                  disabled={currentPage === pagination.totalPages}
                  className="px-3 py-1 text-sm font-medium rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <EmptyState
          title={
            searchQuery
              ? "No matching tasks"
              : filter === "ALL"
                ? "No tasks found"
                : `No ${filter.toLowerCase().replace("_", " ")} tasks`
          }
          description={
            searchQuery
              ? "Try a different search term or clear the search"
              : filter === "ALL"
                ? "Create your first task to get started"
                : "Change the filter or create a new task"
          }
          actionLabel="Create Task"
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
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
              />
            </svg>
          }
        />
      )}

      {/* Create Task Modal */}
      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Create New Task">
        <TaskForm onSubmit={handleCreateTask} projects={projects} isLoading={isCreating} />
      </Modal>

      {/* Edit Task Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Task">
        {selectedTask && (
          <TaskForm onSubmit={handleUpdateTask} task={selectedTask} projects={projects} isLoading={isUpdating} />
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Confirmation
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteTask}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
        confirmLabel="Delete"
        isLoading={isDeleting}
        variant="danger"
      />
    </div>
  )
}

export default Tasks
