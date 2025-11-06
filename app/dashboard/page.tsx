"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import JobQueue from "@/components/job-queue"
import JobStats from "@/components/job-stats"
import ActiveJobDetail from "@/components/active-job-detail"

export default function DashboardPage() {
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null)

  return (
    <main className="min-h-screen bg-background">
      <header className="flex h-16 items-center justify-between border-b border-border px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
            PM
          </div>
          <span className="text-lg font-semibold">PrintManager</span>
        </Link>
        <div className="flex gap-4 items-center">
          <span className="text-sm text-muted-foreground">Operador: João Silva</span>
          <Button variant="outline" size="sm">
            Sair
          </Button>
        </div>
      </header>

      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div>
            <h1 className="text-4xl font-bold mb-2">Dashboard de Operador</h1>
            <p className="text-muted-foreground">Gerencie e acompanhe os trabalhos de impressão</p>
          </div>

          <JobStats />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <JobQueue onSelectJob={setSelectedJobId} selectedJobId={selectedJobId} />
            </div>
            <div>
              {selectedJobId ? (
                <ActiveJobDetail jobId={selectedJobId} />
              ) : (
                <div className="border border-border rounded-lg p-6 text-center">
                  <p className="text-muted-foreground">Selecione um trabalho para ver detalhes</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
