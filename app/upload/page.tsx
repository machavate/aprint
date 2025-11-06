"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import FileUploadZone from "@/components/file-upload-zone"
import JobDetailsForm from "@/components/job-details-form"

export default function UploadPage() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [step, setStep] = useState(1)

  const handleFileUpload = (file: File) => {
    setUploadedFile(file)
    setStep(2)
  }

  const handleReset = () => {
    setUploadedFile(null)
    setStep(1)
  }

  return (
    <main className="min-h-screen bg-background">
      <header className="flex h-16 items-center justify-between border-b border-border px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
            PM
          </div>
          <span className="text-lg font-semibold">PrintManager</span>
        </Link>
        <div className="flex gap-4">
          <Link href="/dashboard">
            <Button variant="outline">Dashboard</Button>
          </Link>
          <Button>Perfil</Button>
        </div>
      </header>

      <div className="flex-1 px-6 py-12">
        <div className="max-w-2xl mx-auto space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-balance mb-2">Enviar Trabalho de Impressão</h1>
            <p className="text-lg text-muted-foreground">Passo {step} de 2</p>
          </div>

          {step === 1 && <FileUploadZone onFileUpload={handleFileUpload} />}

          {step === 2 && uploadedFile && <JobDetailsForm file={uploadedFile} onBack={handleReset} />}
        </div>
      </div>
    </main>
  )
}
