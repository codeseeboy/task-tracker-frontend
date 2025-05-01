"use client"

import type React from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import Card, { CardBody, CardFooter } from "../ui/Card"
import Badge from "../ui/Badge"
import type { Project } from "../../types/project"

interface ProjectCardProps {
  project: Project
  onEdit?: () => void
  onDelete?: () => void
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onEdit, onDelete }) => {
  const formattedDate = new Date(project.createdAt).toLocaleDateString()

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Card className="h-full flex flex-col">
        <CardBody className="flex-1">
          <div className="flex justify-between items-start mb-2">
            <Link
              to={`/projects/${project.id}`}
              className="text-lg font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              {project.name}
            </Link>
            <Badge variant="primary" size="sm">
              {project.taskCount || 0} Tasks
            </Badge>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">{project.description}</p>
          <div className="text-xs text-gray-500 dark:text-gray-500">Created on {formattedDate}</div>
        </CardBody>
        <CardFooter className="flex justify-between items-center">
          <Link to={`/projects/${project.id}`} className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
            View Details
          </Link>
          <div className="flex space-x-2">
            {onEdit && (
              <button
                onClick={onEdit}
                className="p-1 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
                aria-label="Edit project"
              >
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
              </button>
            )}
            {onDelete && (
              <button
                onClick={onDelete}
                className="p-1 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
                aria-label="Delete project"
              >
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
              </button>
            )}
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

export default ProjectCard
