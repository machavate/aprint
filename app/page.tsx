"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Image from "next/image"

interface QueueItem {
  id: string
  fileName: string
  copies: number
  timestamp: string
}

export default function Home() {
  const [file, setFile] = useState<File | null>(null)
  const [copies, setCopies] = useState(1)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [queue, setQueue] = useState<QueueItem[]>([])

  useEffect(() => {
    const savedQueue = localStorage.getItem("printQueue")
    if (savedQueue) {
      setQueue(JSON.parse(savedQueue))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("printQueue", JSON.stringify(queue))
  }, [queue])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0])
      setSuccess(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return

    setLoading(true)
    const formData = new FormData()
    formData.append("file", file)
    formData.append("copies", copies.toString())

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        const newItem: QueueItem = {
          id: Date.now().toString(),
          fileName: file.name,
          copies: copies,
          timestamp: new Date().toLocaleString("pt-PT"),
        }
        setQueue([...queue, newItem])

        setSuccess(true)
        setFile(null)
        setCopies(1)
        ;(e.target as HTMLFormElement).reset()
        setTimeout(() => setSuccess(false), 3000)
      }
    } catch (error) {
      console.error("Erro:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-center sm:justify-start">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="Logo Papelaria"
              width={60}
              height={60}
              className="w-12 h-12 sm:w-16 sm:h-16 object-contain"
              priority
            />
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-orange-600">Impressão Rápida</h1>
              <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">Envie seus ficheiros com facilidade</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Upload Section */}
            <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-center text-orange-600 mb-2">Enviar para Impressão</h2>
              <p className="text-center text-gray-500 mb-8 text-sm sm:text-base">Selecione o ficheiro e o número de cópias</p>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Upload Area */}
                <div>
                  <label className="block w-full border-2 border-dashed border-orange-300 rounded-xl p-6 sm:p-8 text-center cursor-pointer hover:bg-orange-50 transition-all">
                    <div className="text-4xl mb-2">Document</div>
                    <p className="text-gray-700 font-semibold text-sm sm:text-base">
                      {file ? file.name : "Clique ou arraste o ficheiro"}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">PDF, DOCX, JPG, PNG, etc.</p>
                    <input
                      type="file"
                      onChange={handleFileChange}
                      className="hidden"
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.jpg,.jpeg,.png"
                    />
                  </label>
                </div>

                {/* Copies Input */}
                {file && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Número de Cópias</label>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setCopies(Math.max(1, copies - 1))}
                        className="w-10 h-10 bg-orange-200 text-orange-700 rounded-lg font-bold hover:bg-orange-300 transition-colors"
                      >
                        −
                      </button>
                      <input
                        type="number"
                        value={copies}
                        onChange={(e) => setCopies(Math.max(1, Number.parseInt(e.target.value) || 1))}
                        className="flex-1 border-2 border-orange-300 rounded-lg p-2 text-center text-lg sm:text-xl font-bold text-orange-600"
                      />
                      <button
                        type="button"
                        onClick={() => setCopies(copies + 1)}
                        className="w-10 h-10 bg-orange-200 text-orange-700 rounded-lg font-bold hover:bg-orange-300 transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                {file && (
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-bold py-3 px-4 rounded-xl hover:shadow-lg transition-all disabled:opacity-50 text-sm sm:text-base"
                  >
                    {loading ? "A enviar..." : `Imprimir (${copies} cópia${copies > 1 ? 's' : ''})`}
                  </button>
                )}

                {/* Success Message */}
                {success && (
                  <div className="bg-green-100 border-2 border-green-500 text-green-700 p-4 rounded-xl font-semibold text-center text-sm sm:text-base">
                    Enviado com sucesso! Adicionado à fila.
                  </div>
                )}
              </form>
            </div>

            {/* Queue Section */}
            <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-yellow-600 mb-4">Fila de Impressão (FIFO)</h2>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {queue.length === 0 ? (
                  <p className="text-gray-400 text-center py-12 text-sm sm:text-base">Nenhum ficheiro na fila</p>
                ) : (
                  queue.map((item, index) => (
                    <div
                      key={item.id}
                      className="bg-gradient-to-r from-yellow-100 to-orange-100 p-4 rounded-lg border-2 border-yellow-300 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-bold text-orange-700 text-sm sm:text-base">#{index + 1}</p>
                          <p className="text-xs sm:text-sm font-semibold text-gray-800 truncate max-w-[180px] sm:max-w-none">
                            {item.fileName}
                          </p>
                          <p className="text-xs text-gray-600">{item.timestamp}</p>
                        </div>
                        <div className="text-right">
                          <span className="inline-block bg-orange-500 text-white text-xs sm:text-sm font-bold px-3 py-1 rounded-full">
                            {item.copies}x
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-orange-600 to-yellow-600 text-white py-4 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm sm:text-base font-medium">
            Feito por amor por <span className="font-bold">Osmane Machavate</span>
          </p>
        </div>
      </footer>
    </>
  )
}