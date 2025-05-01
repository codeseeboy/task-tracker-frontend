"use client"

import React, { Suspense } from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import { useAuth } from "./hooks/useAuth"
import LoadingSpinner from "./components/ui/LoadingSpinner"

// Layouts
import AuthLayout from "./layouts/AuthLayout"
import DashboardLayout from "./layouts/DashboardLayout"

// Lazy-loaded pages for better performance
const LandingPage = React.lazy(() => import("./pages/landing/LandingPage"))
const Login = React.lazy(() => import("./pages/auth/Login"))
const Register = React.lazy(() => import("./pages/auth/Register"))
const Dashboard = React.lazy(() => import("./pages/dashboard/Dashboard"))
const Projects = React.lazy(() => import("./pages/projects/Projects"))
const ProjectDetails = React.lazy(() => import("./pages/projects/ProjectDetails"))
const Tasks = React.lazy(() => import("./pages/tasks/Tasks"))
const TaskDetails = React.lazy(() => import("./pages/tasks/TaskDetails"))
const Profile = React.lazy(() => import("./pages/profile/Profile"))
const NotFound = React.lazy(() => import("./pages/NotFound"))

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return <LoadingSpinner fullScreen />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

// Public route component (accessible only when not authenticated)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return <LoadingSpinner fullScreen />
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}

const App: React.FC = () => {
  return (
    <Suspense fallback={<LoadingSpinner fullScreen />}>
      <Routes>
        <Route path="/" element={<LandingPage />} />

        {/* Public routes */}
        <Route
          path="/"
          element={
            <PublicRoute>
              <AuthLayout />
            </PublicRoute>
          }
        >
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>

        {/* Protected routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="projects" element={<Projects />} />
          <Route path="projects/:projectId" element={<ProjectDetails />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="tasks/:taskId" element={<TaskDetails />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* 404 route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  )
}

export default App
