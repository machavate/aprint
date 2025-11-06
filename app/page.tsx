"use client"

import type React from "react"
import { useState, useEffect } from "react"

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
        setTimeout(() => setSuccess(false), 3000)
      }
    } catch (error) {
      console.error("Erro:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50">
      <div className="flex gap-6 p-6 max-w-7xl mx-auto">
        {/* Upload Section */}
        <div className="flex-1">
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <h1 className="text-4xl font-bold text-center text-orange-600 mb-2">Imprimir</h1>
            <p className="text-center text-gray-500 mb-8">Envie o ficheiro para impressão</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Upload Area */}
              <div>
                <label className="block w-full border-2 border-dashed border-orange-300 rounded-xl p-8 text-center cursor-pointer hover:bg-orange-50 transition-colors">
                  <div className="text-4xl mb-2">📄</div>
                  <p className="text-gray-700 font-semibold">{file ? file.name : "Clique ou arraste"}</p>
                  <p className="text-sm text-gray-500 mt-1">PDF, Word, Excel, etc</p>
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
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Cópias</label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setCopies(Math.max(1, copies - 1))}
                      className="w-10 h-10 bg-orange-200 text-orange-700 rounded-lg font-bold hover:bg-orange-300"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      value={copies}
                      onChange={(e) => setCopies(Math.max(1, Number.parseInt(e.target.value) || 1))}
                      className="flex-1 border-2 border-orange-300 rounded-lg p-2 text-center text-xl font-bold text-orange-600"
                    />
                    <button
                      type="button"
                      onClick={() => setCopies(copies + 1)}
                      className="w-10 h-10 bg-orange-200 text-orange-700 rounded-lg font-bold hover:bg-orange-300"
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
                  className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-bold py-3 px-4 rounded-xl hover:shadow-lg transition-all disabled:opacity-50"
                >
                  {loading ? "A enviar..." : `Imprimir (${copies}x)`}
                </button>
              )}

              {/* Success Message */}
              {success && (
                <div className="bg-green-100 border-2 border-green-500 text-green-700 p-4 rounded-xl font-semibold text-center">
                  ✓ Enviado com sucesso!
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Queue Section */}
        <div className="flex-1">
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <h2 className="text-2xl font-bold text-yellow-600 mb-4">Fila (FIFO)</h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {queue.length === 0 ? (
                <p className="text-gray-400 text-center py-8">Nenhum ficheiro na fila</p>
              ) : (
                queue.map((item, index) => (
                  <div
                    key={item.id}
                    className="bg-gradient-to-r from-yellow-100 to-orange-100 p-4 rounded-lg border-2 border-yellow-300"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-bold text-orange-700">#{index + 1}</p>
                        <p className="text-sm font-semibold text-gray-800 truncate">{item.fileName}</p>
                        <p className="text-xs text-gray-600">{item.copies}x</p>
                      </div>
                      <span className="text-2xl font-bold text-yellow-600">{item.copies}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
