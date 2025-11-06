"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface ActiveJobDetailProps {
  jobId: string
}

export default function ActiveJobDetail({ jobId }: ActiveJobDetailProps) {
  const [isUpdating, setIsUpdating] = useState(false)

  // Mock job data
  const job = {
    id: jobId,
    name: "Brochuras Marketing",
    customer: "Cliente A",
    email: "cliente@example.com",
    status: "pending",
    quantity: 500,
    paperType: "A4",
    colorMode: "Color",
    pages: 50,
    notes: "Necessário grampeamento nas dobras",
    uploadedAt: "2024-11-05 10:30",
  }

  const handleStatusUpdate = async (newStatus: string) => {
    setIsUpdating(true)
    // TODO: Call API to update status
    console.log("Updating status to:", newStatus)
    setTimeout(() => {
      setIsUpdating(false)
      alert("Status atualizado!")
    }, 500)
  }

  return (
    <Card className="p-6 space-y-4">
      <div>
        <h3 className="text-xl font-bold mb-1">{job.name}</h3>
        <p className="text-sm text-muted-foreground">{job.customer}</p>
      </div>

      <div className="space-y-3 border-t border-border pt-4">
        <div>
          <p className="text-xs text-muted-foreground uppercase">Email do Cliente</p>
          <p className="font-medium">{job.email}</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs text-muted-foreground uppercase">Quantidade</p>
            <p className="font-medium">{job.quantity}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase">Papel</p>
            <p className="font-medium">{job.paperType}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs text-muted-foreground uppercase">Cor</p>
            <p className="font-medium">{job.colorMode}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase">Páginas</p>
            <p className="font-medium">{job.pages}</p>
          </div>
        </div>

        {job.notes && (
          <div className="bg-blue-50 border border-blue-200 rounded p-3">
            <p className="text-xs text-blue-900 font-semibold mb-1">NOTAS:</p>
            <p className="text-sm text-blue-800">{job.notes}</p>
          </div>
        )}

        <div className="bg-gray-50 rounded p-3">
          <p className="text-xs text-muted-foreground">Recebido em: {job.uploadedAt}</p>
        </div>
      </div>

      <div className="pt-4 space-y-2">
        <Button className="w-full" onClick={() => handleStatusUpdate("processing")} disabled={isUpdating}>
          Iniciar Processamento
        </Button>
        <Button
          variant="outline"
          className="w-full bg-transparent"
          onClick={() => handleStatusUpdate("completed")}
          disabled={isUpdating}
        >
          Marcar Concluído
        </Button>
      </div>
    </Card>
  )
}
