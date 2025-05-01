"use client"

import { useEffect } from "react"
import type React from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import Input from "../ui/Input"
import TextArea from "../ui/TextArea"
import Select from "../ui/Select"
import Button from "../ui/Button"
import type { Task, TaskCreateDto, TaskUpdateDto } from "../../types/task"
import type { Project } from "../../types/project"

const taskSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100, "Title must be less than 100 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must be less than 500 characters"),
  status: z.string().optional(),
  projectId: z.string().min(1, "Project is required"),
})

interface TaskFormProps {
  onSubmit: (data: TaskCreateDto | TaskUpdateDto) => void
  task?: Task
  projects: Project[]
  isLoading?: boolean
  selectedProjectId?: string
}

const TaskForm: React.FC<TaskFormProps> = ({ onSubmit, task, projects, isLoading = false, selectedProjectId }) => {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<TaskCreateDto>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: task?.title || "",
      description: task?.description || "",
      status: task?.status || "TODO",
      projectId: selectedProjectId || task?.projectId || (projects.length > 0 ? projects[0].id : ""),
    },
  })

  // Set projectId if selectedProjectId changes
  useEffect(() => {
    if (selectedProjectId) {
      setValue("projectId", selectedProjectId);
    }
  }, [selectedProjectId, setValue]);

  const statusOptions = [
    { value: "TODO", label: "To Do" },
    { value: "IN_PROGRESS", label: "In Progress" },
    { value: "REVIEW", label: "In Review" },
    { value: "DONE", label: "Done" },
  ]

  const projectOptions = projects.map((project) => ({
    value: project.id,
    label: project.name,
  }))

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input label="Task Title" placeholder="Enter task title" error={errors.title?.message} {...register("title")} />
      <TextArea
        label="Description"
        placeholder="Enter task description"
        error={errors.description?.message}
        {...register("description")}
      />
      
      <Controller
        name="status"
        control={control}
        render={({ field }) => (
          <Select 
            label="Status" 
            options={statusOptions} 
            value={field.value}
            onChange={field.onChange}
            error={errors.status?.message} 
          />
        )}
      />
      
      <Controller
        name="projectId"
        control={control}
        render={({ field }) => (
          <Select 
            label="Project" 
            options={projectOptions} 
            value={field.value}
            onChange={field.onChange}
            error={errors.projectId?.message} 
            disabled={!!selectedProjectId}
          />
        )}
      />
      
      <div className="flex justify-end">
        <Button type="submit" isLoading={isLoading}>
          {task ? "Update Task" : "Create Task"}
        </Button>
      </div>
    </form>
  )
}

export default TaskForm