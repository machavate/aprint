"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

interface QueueItem {
  id: string
  fileName: string
  copies: number
  timestamp: string
}

export default function OperatorPage() {
  const [queue, setQueue] = useState<QueueItem[]>([])
  const [currentJob, setCurrentJob] = useState<QueueItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadQueue = async () => {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch("/api/queue")
      const data = await res.json()

      if (data.success && data.queue) {
        setQueue(data.queue)
        if (!currentJob && data.queue.length > 0) {
          setCurrentJob(data.queue[0])
        }
        return
      }
    } catch (e) {
      console.warn("API falhou, usando fallback local")
    }

    // Fallback: tenta ler diretamente da pasta
    try {
      const localRes = await fetch("/api/local-queue")
      const localData = await localRes.json()
      if (localData.queue) {
        setQueue(localData.queue)
        if (!currentJob && localData.queue.length > 0) {
          setCurrentJob(localData.queue[0])
        }
      }
    } catch (e) {
      setError("Sem conexão com a pasta de impressões")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadQueue()
    const interval = setInterval(loadQueue, 2000)
    return () => clearInterval(interval)
  }, [currentJob])

  const handleMarkDone = async () => {
    if (!currentJob) return

    try {
      await fetch("/api/queue", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: currentJob.id }),
      })
      setCurrentJob(null)
      await loadQueue()
    } catch (e) {
      alert("Erro ao mover ficheiro. Verifique a pasta ImpressoesRecebidas.")
    }
  }

  return (
    <>
      {/* HEADER */}
      <header className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-center sm:justify-start">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="Papelaria"
              width={60}
              height={60}
              className="w-12 h-12 sm:w-16 sm:h-16 object-contain rounded-full shadow-md"
              priority
            />
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-green-700">Painel do Operador</h1>
              <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">Impressões em tempo real</p>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {error && (
            <div className="mb-6 p-4 bg-red-100 border-2 border-red-400 text-red-700 rounded-xl text-center font-medium">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* TRABALHO ATUAL */}
            <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 sticky top-24 lg:top-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-emerald-700 text-center sm:text-left mb-6">
                Trabalho Atual
              </h2>

              {loading ? (
                <div className="flex flex-col items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent mb-4"></div>
                  <p className="text-gray-600">Carregando fila...</p>
                </div>
              ) : currentJob ? (
                <div className="space-y-6">
                  {/* FICHEIRO */}
                  <div className="bg-gradient-to-r from-emerald-100 to-green-100 p-6 rounded-xl border-4 border-emerald-400 shadow-lg">
                    <p className="text-sm font-bold text-emerald-700 uppercase tracking-wider">Ficheiro</p>
                    <p className="text-2xl sm:text-3xl font-extrabold text-green-800 break-all mt-2">
                      {currentJob.fileName}
                    </p>
                  </div>

                  {/* CÓPIAS */}
                  <div className="bg-gradient-to-r from-amber-100 to-yellow-100 p-6 rounded-xl border-4 border-amber-400 shadow-lg text-center">
                    <p className="text-sm font-bold text-amber-700 uppercase tracking-wider">Cópias</p>
                    <p className="text-5xl sm:text-7xl font-extrabold text-amber-600 mt-2">
                      {currentJob.copies}x
                    </p>
                  </div>

                  {/* DATA */}
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-300">
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Enviado em</p>
                    <p className="text-base font-semibold text-gray-800">{currentJob.timestamp}</p>
                  </div>

                  {/* BOTÕES SEMPRE VISÍVEIS */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                    <a
                      href={`/api/download?file=${encodeURIComponent(currentJob.fileName)}`}
                      download
                      className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3 text-base"
                    >
                      Download
                    </a>

                    <button
                      onClick={handleMarkDone}
                      className="bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3 text-base hover:from-green-600 hover:to-emerald-600"
                    >
                      Concluído
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="text-7xl sm:text-9xl mb-4 text-emerald-500">Check</div>
                  <p className="text-2xl sm:text-3xl font-bold text-emerald-600">Sem trabalhos!</p>
                  <p className="text-gray-600 mt-3 text-sm sm:text-base">Aguardando novos ficheiros...</p>
                </div>
              )}
            </div>

            {/* PRÓXIMOS NA FILA */}
            <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-emerald-700 text-center sm:text-left mb-6">
                Próximos na Fila ({queue.length})
              </h2>

              <div className="space-y-3 max-h-96 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-emerald-400">
                {queue.length === 0 ? (
                  <div className="text-center py-16 text-gray-400">
                    <div className="text-6xl mb-4">Inbox</div>
                    <p className="text-lg">Fila vazia</p>
                  </div>
                ) : (
                  queue.map((item, i) => (
                    <div
                      key={item.id}
                      className={`p-5 rounded-xl border-2 transition-all duration-300 ${
                        i === 0
                          ? "bg-gradient-to-r from-emerald-100 to-green-100 border-emerald-500 shadow-xl scale-105"
                          : "bg-gray-50 border-gray-200 hover:bg-gray-100 hover:shadow-md"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-bold ${i === 0 ? "text-emerald-700" : "text-gray-600"}`}>
                            #{i + 1} {i === 0 && "→ PRÓXIMO"}
                          </p>
                          <p className="font-semibold text-gray-800 truncate text-sm sm:text-base">
                            {item.fileName}
                          </p>
                          <p className={`text-xs ${i === 0 ? "text-emerald-600" : "text-gray-500"}`}>
                            {item.copies} cópia{item.copies > 1 ? "s" : ""} • {item.timestamp}
                          </p>
                        </div>
                        <div className={`ml-3 text-2xl sm:text-3xl font-extrabold ${i === 0 ? "text-emerald-600" : "text-gray-400"}`}>
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

      {/* FOOTER */}
      <footer className="bg-gradient-to-r from-emerald-600 to-green-600 text-white py-5 mt-12 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm sm:text-base font-medium">
            Feito por amor por <span className="font-bold text-yellow-300">Osmane Machavate</span>
          </p>
        </div>
      </footer>
    </>
  )
}
