"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export default function ClientPage() {
  const [file, setFile] = useState<File | null>(null)
  const [customerName, setCustomerName] = useState("")
  const [customerEmail, setCustomerEmail] = useState("")
  const [customerPhone, setCustomerPhone] = useState("")
  const [quantity, setQuantity] = useState("1")
  const [paperSize, setPaperSize] = useState("A4")
  const [colorMode, setColorMode] = useState("bw")
  const [priority, setPriority] = useState("normal")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [jobId, setJobId] = useState("")

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file || !customerName) {
      alert("Preencha todos os campos obrigatórios")
      return
    }

    setLoading(true)
    const formData = new FormData()
    formData.append("file", file)
    formData.append("customerName", customerName)
    formData.append("customerEmail", customerEmail)
    formData.append("customerPhone", customerPhone)
    formData.append("quantity", quantity)
    formData.append("paperSize", paperSize)
    formData.append("colorMode", colorMode)
    formData.append("priority", priority)

    try {
      const response = await fetch("/api/jobs", {
        method: "POST",
        body: formData,
      })
      const data = await response.json()

      if (data.success) {
        setSuccess(true)
        setJobId(data.data.id)
        setFile(null)
        setCustomerName("")
        setCustomerEmail("")
        setCustomerPhone("")
        setQuantity("1")
      } else {
        alert("Erro ao enviar: " + data.error)
      }
    } catch (error) {
      alert("Erro de conexão")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <main className="min-h-screen bg-success text-success-foreground p-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white text-foreground rounded-lg p-8 text-center space-y-6">
            <div className="text-6xl">✅</div>
            <h1 className="text-3xl font-bold">Trabalho Enviado!</h1>
            <p className="text-lg">Seu ficheiro foi enviado com sucesso para impressão.</p>
            <div className="bg-muted p-4 rounded text-left">
              <p className="text-sm">
                <strong>ID do Trabalho:</strong>
              </p>
              <p className="font-mono text-sm break-all">{jobId}</p>
            </div>
            <p className="text-sm text-muted-foreground">Guarde este ID para rastrear seu trabalho</p>
            <Button onClick={() => setSuccess(false)} className="w-full">
              Enviar Outro Ficheiro
            </Button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-accent p-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg p-8 shadow-lg">
          <h1 className="text-3xl font-bold text-foreground mb-2">Upload de Ficheiros</h1>
          <p className="text-muted-foreground mb-6">Envie seu ficheiro de impressão</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Ficheiro PDF *</label>
              <div className="relative">
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                  className="hidden"
                  id="file-input"
                />
                <label
                  htmlFor="file-input"
                  className="block border-2 border-dashed border-primary rounded-lg p-6 text-center cursor-pointer hover:bg-muted transition"
                >
                  {file ? (
                    <div>
                      <p className="font-medium text-primary">{file.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-2xl mb-2">📎</p>
                      <p className="font-medium text-foreground">Clique para selecionar</p>
                      <p className="text-xs text-muted-foreground">ou arraste e solte</p>
                    </div>
                  )}
                </label>
              </div>
            </div>

            {/* Customer Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Nome do Cliente *</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full border border-input rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="João Silva"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full border border-input rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="joao@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Telefone</label>
              <input
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full border border-input rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="+351 9XX XXX XXX"
              />
            </div>

            {/* Print Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Quantidade de Cópias</label>
                <input
                  type="number"
                  min="1"
                  max="999"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full border border-input rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Tamanho do Papel</label>
                <select
                  value={paperSize}
                  onChange={(e) => setPaperSize(e.target.value)}
                  className="w-full border border-input rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="A4">A4</option>
                  <option value="A3">A3</option>
                  <option value="A5">A5</option>
                  <option value="Letter">Letter</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Modo de Cor</label>
                <select
                  value={colorMode}
                  onChange={(e) => setColorMode(e.target.value)}
                  className="w-full border border-input rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="bw">Preto e Branco</option>
                  <option value="color">Cor</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Prioridade</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full border border-input rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="low">Baixa</option>
                  <option value="normal">Normal</option>
                  <option value="high">Alta</option>
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading || !file}
              className="w-full bg-primary text-primary-foreground font-bold py-3 text-lg"
            >
              {loading ? "Enviando..." : "Enviar para Impressão"}
            </Button>
          </form>
        </div>
      </div>
    </main>
  )
}
