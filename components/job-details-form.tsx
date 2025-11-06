"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

interface JobDetailsFormProps {
  file: File
  onBack: () => void
}

export default function JobDetailsForm({ file, onBack }: JobDetailsFormProps) {
  const [formData, setFormData] = useState({
    jobName: "",
    quantity: "1",
    paperType: "A4",
    colorMode: "color",
    notes: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // TODO: Submit to API
    console.log("Submitting:", { file: file.name, ...formData })

    setTimeout(() => {
      setIsSubmitting(false)
      alert("Trabalho enviado com sucesso!")
      onBack()
    }, 1000)
  }

  return (
    <Card className="p-8 space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Detalhes do Trabalho</h2>
        <p className="text-muted-foreground">Ficheiro: {file.name}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Nome do Trabalho</label>
            <Input
              type="text"
              name="jobName"
              placeholder="Ex: Brochuras Marketing"
              value={formData.jobName}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Quantidade</label>
            <Input type="number" name="quantity" min="1" value={formData.quantity} onChange={handleChange} required />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Tamanho do Papel</label>
            <select
              name="paperType"
              value={formData.paperType}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-border rounded-md bg-background"
            >
              <option>A4</option>
              <option>A3</option>
              <option>A5</option>
              <option>Personalizado</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Modo de Cor</label>
            <select
              name="colorMode"
              value={formData.colorMode}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-border rounded-md bg-background"
            >
              <option value="color">Cores</option>
              <option value="bw">Preto e Branco</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Notas Adicionais</label>
          <textarea
            name="notes"
            placeholder="Instruções especiais, preferências de acabamento, etc."
            value={formData.notes}
            onChange={handleChange}
            rows={4}
            className="w-full px-3 py-2 border border-border rounded-md bg-background"
          />
        </div>

        <div className="flex gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onBack} disabled={isSubmitting}>
            Voltar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Enviando..." : "Enviar Trabalho"}
          </Button>
        </div>
      </form>
    </Card>
  )
}
