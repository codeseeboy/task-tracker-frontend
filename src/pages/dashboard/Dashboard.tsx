"use client"

import type React from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import Card, { CardBody, CardHeader } from "../../components/ui/Card"
import Button from "../../components/ui/Button"
import LoadingSpinner from "../../components/ui/LoadingSpinner"
import EmptyState from "../../components/ui/EmptyState"
import ProgressBar from "../../components/ui/ProgressBar"
import { useProjects } from "../../hooks/useProjects"
import { useTasks } from "../../hooks/useTasks"
import { useAuth } from "../../hooks/useAuth"

const Dashboard: React.FC = () => {
  const { user } = useAuth()
  const { projects, isLoading: isLoadingProjects } = useProjects()
  const { tasks, isLoading: isLoadingTasks } = useTasks()

  const isLoading = isLoadingProjects || isLoadingTasks

  if (isLoading) {
    return <LoadingSpinner fullScreen />
  }

  // Calculate statistics
  const totalProjects = projects.length
  const totalTasks = tasks.length
  const completedTasks = tasks.filter((task: { status: string }) => task.status === "DONE").length
  const inProgressTasks = tasks.filter((task: { status: string }) => task.status === "IN_PROGRESS").length
  const todoTasks = tasks.filter((task: { status: string }) => task.status === "TODO").length
  const reviewTasks = tasks.filter((task: { status: string }) => task.status === "REVIEW").length

  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0

  // Get recent projects and tasks
  const recentProjects = [...projects]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3)

  const recentTasks = [...tasks]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <div className="flex space-x-2">
          <Button
            as={Link}
            to="/projects"
            variant="primary"
            size="sm"
            leftIcon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            }
          >
            New Project
          </Button>
          <Button
            as={Link}
            to="/tasks"
            variant="outline"
            size="sm"
            leftIcon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            }
          >
            New Task
          </Button>
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <Card>
          <CardBody>
            <div className="flex flex-col md:flex-row items-center">
              <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
                <div className="w-20 h-20 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl font-bold">
                  {user?.name.charAt(0).toUpperCase()}
                </div>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Welcome back, {user?.name}!</h2>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Here's an overview of your projects and tasks.</p>
              </div>
            </div>
          </CardBody>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card>
            <CardBody className="text-center">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{totalProjects}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Projects</div>
            </CardBody>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card>
            <CardBody className="text-center">
              <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{totalTasks}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Tasks</div>
            </CardBody>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card>
            <CardBody className="text-center">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">{completedTasks}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Completed Tasks</div>
            </CardBody>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <Card>
            <CardBody className="text-center">
              <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{inProgressTasks}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">In Progress</div>
            </CardBody>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Projects</h2>
                <Link to="/projects" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                  View All
                </Link>
              </div>
            </CardHeader>
            <CardBody>
              {recentProjects.length > 0 ? (
                <div className="space-y-4">
                  {recentProjects.map((project) => (
                    <div
                      key={project.id}
                      className="border-b border-gray-200 dark:border-gray-700 pb-3 last:border-0 last:pb-0"
                    >
                      <Link
                        to={`/projects/${project.id}`}
                        className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                      >
                        {project.name}
                      </Link>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                        {project.description}
                      </p>
                      <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        Created on {new Date(project.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  title="No projects yet"
                  description="Create your first project to get started"
                  actionLabel="Create Project"
                  onAction={() => (window.location.href = "/projects")}
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
            </CardBody>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Tasks</h2>
                <Link to="/tasks" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                  View All
                </Link>
              </div>
            </CardHeader>
            <CardBody>
              {recentTasks.length > 0 ? (
                <div className="space-y-4">
                  {recentTasks.map((task) => (
                    <div
                      key={task.id}
                      className="border-b border-gray-200 dark:border-gray-700 pb-3 last:border-0 last:pb-0"
                    >
                      <div className="flex justify-between items-start">
                        <Link
                          to={`/tasks/${task.id}`}
                          className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                        >
                          {task.title}
                        </Link>
                        <div
                          className={`text-xs px-2 py-1 rounded-full ${
                            task.status === "DONE"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:bg-opacity-30 dark:text-green-300"
                              : task.status === "IN_PROGRESS"
                                ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:bg-opacity-30 dark:text-blue-300"
                                : task.status === "REVIEW"
                                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:bg-opacity-30 dark:text-yellow-300"
                                  : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                          }`}
                        >
                          {task.status === "TODO"
                            ? "To Do"
                            : task.status === "IN_PROGRESS"
                              ? "In Progress"
                              : task.status === "REVIEW"
                                ? "In Review"
                                : "Done"}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-1">{task.description}</p>
                      <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        Created on {new Date(task.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  title="No tasks yet"
                  description="Create your first task to get started"
                  actionLabel="Create Task"
                  onAction={() => (window.location.href = "/tasks")}
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
            </CardBody>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.7 }}
      >
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Task Progress</h2>
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">To Do</span>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{todoTasks}</span>
                  </div>
                  <ProgressBar value={todoTasks} max={totalTasks || 1} color="indigo" />
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">In Progress</span>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{inProgressTasks}</span>
                  </div>
                  <ProgressBar value={inProgressTasks} max={totalTasks || 1} color="blue" />
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">In Review</span>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{reviewTasks}</span>
                  </div>
                  <ProgressBar value={reviewTasks} max={totalTasks || 1} color="yellow" />
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Completed</span>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{completedTasks}</span>
                  </div>
                  <ProgressBar value={completedTasks} max={totalTasks || 1} color="green" />
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </motion.div>
    </div>
  )
}

export default Dashboard
