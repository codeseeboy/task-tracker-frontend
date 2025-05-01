"use client"

import type React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import Input from "../ui/Input"
import TextArea from "../ui/TextArea"
import Button from "../ui/Button"
import type { Project, ProjectCreateDto, ProjectUpdateDto } from "../../types/project"

const projectSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters").max(100, "Name must be less than 100 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must be less than 500 characters"),
})

interface ProjectFormProps {
  project?: Project
  onSubmit: (data: ProjectCreateDto | ProjectUpdateDto) => void
  isLoading?: boolean
  mode?: 'create' | 'update' 
}

const ProjectForm: React.FC<ProjectFormProps> = ({ onSubmit, project, isLoading = false }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProjectCreateDto>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: project?.name || "",
      description: project?.description || "",
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input label="Project Name" placeholder="Enter project name" error={errors.name?.message} {...register("name")} />
      <TextArea
        label="Description"
        placeholder="Enter project description"
        error={errors.description?.message}
        {...register("description")}
      />
      <div className="flex justify-end">
        <Button type="submit" isLoading={isLoading}>
          {project ? "Update Project" : "Create Project"}
        </Button>
      </div>
    </form>
  )
}

export default ProjectForm
