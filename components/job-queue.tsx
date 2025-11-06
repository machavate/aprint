"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"

interface Job {
  id: string
  name: string
  customer: string
  status: "pending" | "processing" | "completed"
  createdAt: string
  pages: number
  priority: "low" | "medium" | "high"
}

interface JobQueueProps {
  onSelectJob: (jobId: string) => void
  selectedJobId: string | null
}

export default function JobQueue({ onSelectJob, selectedJobId }: JobQueueProps) {
  const [jobs, setJobs] = useState<Job[]>([
    {
      id: "1",
      name: "Brochuras Marketing",
      customer: "Cliente A",
      status: "pending",
      createdAt: "2024-11-05 10:30",
      pages: 50,
      priority: "high",
    },
    {
      id: "2",
      name: "Cartões de Visita",
      customer: "Cliente B",
      status: "processing",
      createdAt: "2024-11-05 09:15",
      pages: 200,
      priority: "medium",
    },
    {
      id: "3",
      name: "Relatórios Financeiros",
      customer: "Cliente C",
      status: "pending",
      createdAt: "2024-11-05 08:45",
      pages: 100,
      priority: "low",
    },
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "processing":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "Pendente"
      case "processing":
        return "Em Processamento"
      case "completed":
        return "Concluído"
      default:
        return status
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-600"
      case "medium":
        return "text-orange-600"
      case "low":
        return "text-green-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4">Fila de Trabalhos</h2>
      <div className="space-y-3">
        {jobs.map((job) => (
          <div
            key={job.id}
            onClick={() => onSelectJob(job.id)}
            className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
              selectedJobId === job.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-semibold">{job.name}</h3>
                <p className="text-sm text-muted-foreground">{job.customer}</p>
              </div>
              <span className={`text-xs font-semibold px-2 py-1 rounded ${getStatusColor(job.status)}`}>
                {getStatusLabel(job.status)}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{job.pages} páginas</span>
              <span className={`font-medium ${getPriorityColor(job.priority)}`}>
                {job.priority === "high" ? "⚠ Alta" : job.priority === "medium" ? "Média" : "Baixa"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
