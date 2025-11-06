"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function TrackPage() {
  const [jobId, setJobId] = useState("")
  const [selectedJob, setSelectedJob] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch(`/api/jobs/${jobId}`)
      const data = await response.json()

      if (data.success) {
        setSelectedJob(data.data)
      } else {
        setError("Trabalho não encontrado")
        setSelectedJob(null)
      }
    } catch (err) {
      setError("Erro ao buscar trabalho")
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-success text-success-foreground"
      case "processing":
        return "bg-warning text-warning-foreground"
      case "pending":
        return "bg-muted text-foreground"
      default:
        return "bg-primary text-primary-foreground"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "completed":
        return "Concluído"
      case "processing":
        return "Em Impressão"
      case "pending":
        return "Pendente"
      default:
        return status
    }
  }

  return (
    <main className="min-h-screen bg-warning">
      <header className="bg-primary text-primary-foreground p-4 border-b-4 border-primary/80">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link href="/" className="font-bold text-xl">
            PrintManager
          </Link>
          <Link href="/client">
            <Button variant="outline" className="text-primary-foreground border-primary-foreground bg-transparent">
              Enviar Ficheiro
            </Button>
          </Link>
        </div>
      </header>

      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Rastrear Trabalho</h1>
          <p className="text-muted-foreground mb-6">Introduza o ID do trabalho para ver o estado</p>

          <form onSubmit={handleSearch} className="flex gap-3 mb-6">
            <input
              type="text"
              placeholder="ID do trabalho (ex: 550e8400-e29b-41d4-a716-446655440000)"
              value={jobId}
              onChange={(e) => setJobId(e.target.value)}
              className="flex-1 border border-input rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Button
              type="submit"
              disabled={isLoading || !jobId}
              className="bg-primary text-primary-foreground font-bold px-6"
            >
              {isLoading ? "Procurando..." : "Procurar"}
            </Button>
          </form>

          {error && <div className="bg-destructive/10 text-destructive p-4 rounded-lg mb-6 text-center">{error}</div>}

          {selectedJob && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4 bg-muted p-4 rounded-lg">
                <div>
                  <p className="text-xs text-muted-foreground">Nome do Cliente</p>
                  <p className="font-bold text-foreground">{selectedJob.customer_name}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Ficheiro</p>
                  <p className="font-bold text-foreground text-sm truncate">{selectedJob.file_name}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Quantidade</p>
                  <p className="font-bold text-foreground">{selectedJob.quantity} cópias</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Tamanho</p>
                  <p className="font-bold text-foreground">{selectedJob.paper_size}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="font-bold text-foreground">Estado</p>
                  <span className={`px-3 py-1 rounded-full font-bold text-sm ${getStatusColor(selectedJob.status)}`}>
                    {getStatusLabel(selectedJob.status)}
                  </span>
                </div>

                <div className="flex justify-between gap-2">
                  <div
                    className={`flex-1 p-3 rounded text-center font-bold text-sm ${
                      ["pending", "processing", "completed"].indexOf("pending") <=
                      ["pending", "processing", "completed"].indexOf(selectedJob.status)
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    Recebido
                  </div>
                  <div
                    className={`flex-1 p-3 rounded text-center font-bold text-sm ${
                      ["pending", "processing", "completed"].indexOf("processing") <=
                      ["pending", "processing", "completed"].indexOf(selectedJob.status)
                        ? "bg-warning text-warning-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    Imprimindo
                  </div>
                  <div
                    className={`flex-1 p-3 rounded text-center font-bold text-sm ${
                      ["pending", "processing", "completed"].indexOf("completed") <=
                      ["pending", "processing", "completed"].indexOf(selectedJob.status)
                        ? "bg-success text-success-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    Concluído
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <p className="font-bold text-foreground">Informações</p>
                {selectedJob.customer_email && (
                  <p className="text-muted-foreground">Email: {selectedJob.customer_email}</p>
                )}
                {selectedJob.customer_phone && (
                  <p className="text-muted-foreground">Telefone: {selectedJob.customer_phone}</p>
                )}
                <p className="text-muted-foreground">
                  Criado em: {new Date(selectedJob.created_at).toLocaleString("pt-PT")}
                </p>
              </div>

              <Button
                onClick={() => {
                  setSelectedJob(null)
                  setJobId("")
                }}
                variant="outline"
                className="w-full"
              >
                Novo Rastreamento
              </Button>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
