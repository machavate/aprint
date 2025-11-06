"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card } from "@/components/ui/card"

interface FileUploadZoneProps {
  onFileUpload: (file: File) => void
}

export default function FileUploadZone({ onFileUpload }: FileUploadZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [fileName, setFileName] = useState<string>("")

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = () => {
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)

    const files = e.dataTransfer.files
    if (files.length > 0) {
      const file = files[0]
      validateAndUpload(file)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      validateAndUpload(files[0])
    }
  }

  const validateAndUpload = (file: File) => {
    // Validate file size (max 500MB)
    if (file.size > 500 * 1024 * 1024) {
      alert("Ficheiro muito grande. Máximo 500MB.")
      return
    }

    // Validate file type
    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "application/postscript",
      "application/vnd.ms-excel",
    ]
    if (!allowedTypes.includes(file.type)) {
      alert("Tipo de ficheiro não suportado. Use PDF, JPG, PNG, ou EPS.")
      return
    }

    setFileName(file.name)
    onFileUpload(file)
  }

  return (
    <Card
      className="p-8 border-2 border-dashed border-border hover:border-primary/50 transition-colors cursor-pointer"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleFileChange}
        accept=".pdf,.jpg,.jpeg,.png,.eps"
      />

      <div className="flex flex-col items-center gap-4 py-12">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <svg className="h-8 w-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3v-6"
            />
          </svg>
        </div>
        <div className="text-center">
          <p className="text-xl font-semibold mb-2">Arraste e solte seu ficheiro aqui</p>
          <p className="text-muted-foreground mb-4">ou clique para selecionar</p>
          <p className="text-sm text-muted-foreground">Formatos aceitos: PDF, JPG, PNG, EPS (máx. 500MB)</p>
        </div>
        {fileName && (
          <div className="mt-4 p-3 bg-accent/10 rounded-lg">
            <p className="text-sm font-medium text-accent-foreground">Ficheiro: {fileName}</p>
          </div>
        )}
      </div>
    </Card>
  )
}
