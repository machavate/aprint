"use client"

import { useState, useEffect } from "react"

interface QueueItem {
  id: string
  timestamp: string
  fileName: string
  copies: number
}

export default function OperatorPage() {
  const [queue, setQueue] = useState<QueueItem[]>([])
  const [currentJob, setCurrentJob] = useState<QueueItem | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadQueue()
    const interval = setInterval(() => {
      loadQueue()
    }, 2000)

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [])

  const loadQueue = async () => {
    try {
      const response = await fetch("/api/queue")
      const data = await response.json()

      if (data.success) {
        setQueue(data.queue)

        if (!currentJob && data.queue.length > 0) {
          setCurrentJob(data.queue[0])
        }
      }
    } catch (error) {
      console.error("Erro ao carregar fila:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleMarkDone = async () => {
    if (!currentJob) return

    try {
      const response = await fetch("/api/queue", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: currentJob.id }),
      })

      if (response.ok) {
        setCurrentJob(null)
        await loadQueue()
      }
    } catch (error) {
      console.error("Erro ao remover item:", error)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <header className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6 shadow-lg">
        <h1 className="text-4xl font-bold">Fila de Impressão</h1>
        <p className="text-green-100 mt-1">Operador</p>
      </header>

      <div className="flex gap-6 p-6 max-w-7xl mx-auto">
        {/* Current Job */}
        <div className="flex-1">
          <div className="bg-white rounded-2xl shadow-2xl p-8 sticky top-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Trabalho Atual</h2>

            {currentJob ? (
              <div className="space-y-6">
                {/* Filename - Big and Bold */}
                <div className="bg-gradient-to-r from-green-100 to-emerald-100 p-6 rounded-xl border-4 border-green-400">
                  <p className="text-sm text-gray-600 mb-2">Ficheiro</p>
                  <p className="text-3xl font-bold text-green-700 break-words">{currentJob.fileName}</p>
                </div>

                {/* Copies */}
                <div className="bg-yellow-100 p-6 rounded-xl border-4 border-yellow-400">
                  <p className="text-sm text-gray-600 mb-2">Cópias</p>
                  <p className="text-4xl font-bold text-yellow-700">{currentJob.copies}x</p>
                </div>

                {/* Timestamp */}
                <div className="bg-gray-100 p-4 rounded-lg">
                  <p className="text-xs text-gray-600">Enviado</p>
                  <p className="text-lg font-semibold text-gray-800">{currentJob.timestamp}</p>
                </div>

                {/* Download Button */}
                <button
                  onClick={() => {
                    window.location.href = `/api/download?file=${encodeURIComponent(currentJob.fileName)}`
                  }}
                  className="w-full bg-blue-500 text-white font-bold py-3 px-6 rounded-xl text-lg hover:bg-blue-600 transition-all"
                >
                  ⬇ Descarregar Ficheiro
                </button>

                {/* Action Button */}
                <button
                  onClick={handleMarkDone}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold py-4 px-6 rounded-xl text-xl hover:shadow-lg transition-all hover:from-green-600 hover:to-emerald-600"
                >
                  ✓ Concluído - Próximo
                </button>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-4xl mb-4">✓</p>
                <p className="text-2xl font-bold text-green-600">Sem trabalhos!</p>
                <p className="text-gray-600 mt-2">Aguardando ficheiros...</p>
              </div>
            )}
          </div>
        </div>

        {/* Queue List */}
        <div className="flex-1">
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Próximos ({queue.length})</h2>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {queue.length === 0 ? (
                <p className="text-center text-gray-400 py-8">Nenhum ficheiro na fila</p>
              ) : (
                queue.map((item, index) => (
                  <div
                    key={item.id}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      index === 0
                        ? "bg-green-100 border-green-400 font-bold"
                        : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className={`text-sm ${index === 0 ? "text-green-600" : "text-gray-600"}`}>#{index + 1}</p>
                        <p className="font-semibold text-gray-800 truncate">{item.fileName}</p>
                        <p className={`text-sm ${index === 0 ? "text-green-700" : "text-gray-600"}`}>{item.copies}x</p>
                      </div>
                      <span className={`text-2xl font-bold ${index === 0 ? "text-green-600" : "text-gray-400"}`}>
                        {item.copies}
                      </span>
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
