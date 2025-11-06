"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

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
    const interval = setInterval(loadQueue, 2000)
    return () => clearInterval(interval)
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
    <>
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
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
              <h1 className="text-xl sm:text-2xl font-bold text-green-600">Painel do Operador</h1>
              <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">Gestão de impressões</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Current Job */}
            <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 sticky top-24 lg:top-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-green-700 mb-6 text-center sm:text-left">
                Trabalho Atual
              </h2>

              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent"></div>
                  <p className="mt-4 text-gray-600">Carregando...</p>
                </div>
              ) : currentJob ? (
                <div className="space-y-6">
                  {/* Ficheiro */}
                  <div className="bg-gradient-to-r from-green-100 to-emerald-100 p-6 rounded-xl border-4 border-green-400 shadow-md">
                    <p className="text-sm font-medium text-green-700 uppercase tracking-wider">Ficheiro</p>
                    <p className="text-2xl sm:text-3xl font-bold text-green-800 break-all mt-1">
                      {currentJob.fileName}
                    </p>
                  </div>

                  {/* Cópias */}
                  <div className="bg-gradient-to-r from-yellow-100 to-amber-100 p-6 rounded-xl border-4 border-yellow-400 shadow-md">
                    <p className="text-sm font-medium text-yellow-700 uppercase tracking-wider">Cópias</p>
                    <p className="text-5xl sm:text-6xl font-extrabold text-yellow-600 text-center mt-2">
                      {currentJob.copies}x
                    </p>
                  </div>

                  {/* Timestamp */}
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Enviado em</p>
                    <p className="text-base font-semibold text-gray-800">{currentJob.timestamp}</p>
                  </div>

                  {/* Botões de Ação */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button
                      onClick={() => {
                        window.location.href = `/api/download?file=${encodeURIComponent(currentJob.fileName)}`
                      }}
                      className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold py-3 px-4 rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
                    >
                      Download
                      <span className="text-xl">Download</span>
                    </button>

                    <button
                      onClick={handleMarkDone}
                      className="bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold py-3 px-4 rounded-xl hover:shadow-xl transition-all flex items-center justify-center gap-2 text-sm sm:text-base hover:from-green-600 hover:to-emerald-600"
                    >
                      Concluído
                      <span className="text-xl">Check</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="text-6xl sm:text-8xl mb-4">Check</div>
                  <p className="text-2xl sm:text-3xl font-bold text-green-600">Sem trabalhos!</p>
                  <p className="text-gray-600 mt-2 text-sm sm:text-base">Aguardando novos ficheiros...</p>
                </div>
              )}
            </div>

            {/* Próximos na Fila */}
            <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-emerald-700 mb-6 text-center sm:text-left">
                Próximos na Fila ({queue.length})
              </h2>

              <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                {queue.length === 0 ? (
                  <div className="text-center py-16 text-gray-400">
                    <div className="text-6xl mb-4">Inbox</div>
                    <p className="text-lg">Fila vazia</p>
                  </div>
                ) : (
                  queue.map((item, index) => (
                    <div
                      key={item.id}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                        index === 0
                          ? "bg-gradient-to-r from-green-100 to-emerald-100 border-green-500 shadow-lg scale-105"
                          : "bg-gray-50 border-gray-200 hover:bg-gray-100 hover:shadow-md"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-bold ${index === 0 ? "text-green-700" : "text-gray-600"}`}>
                            #{index + 1} {index === 0 && "→ PRÓXIMO"}
                          </p>
                          <p className="font-semibold text-gray-800 truncate text-sm sm:text-base">
                            {item.fileName}
                          </p>
                          <p className={`text-xs ${index === 0 ? "text-green-600" : "text-gray-500"}`}>
                            {item.copies} cópia{item.copies > 1 ? "s" : ""} • {item.timestamp}
                          </p>
                        </div>
                        <div
                          className={`ml-3 text-2xl sm:text-3xl font-extrabold ${
                            index === 0 ? "text-green-600" : "text-gray-400"
                          }`}
                        >
                          {item.copies}x
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
      <footer className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm sm:text-base font-medium">
            Feito por amor por <span className="font-bold">Osmane Machavate</span>
          </p>
        </div>
      </footer>
    </>
  )
}