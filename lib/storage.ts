// In-memory storage for Vercel (persists during serverless function execution)
interface StoredFile {
  data: Buffer
  originalName: string
  timestamp: number
}

const fileStore = new Map<string, StoredFile>()
const queueStore: Array<{
  id: string
  fileName: string
  copies: number
  timestamp: string
}> = []

export function addToQueue(fileName: string, copies: number): string {
  const id = Date.now().toString()
  const timestamp = new Date().toLocaleString("pt-PT")
  queueStore.push({ id, fileName, copies, timestamp })
  return id
}

export function getQueue() {
  return queueStore
}

export function removeFromQueue(id: string) {
  const index = queueStore.findIndex((item) => item.id === id)
  if (index > -1) {
    queueStore.splice(index, 1)
  }
}

export function storeFile(fileName: string, data: Buffer): void {
  const id = fileName
  fileStore.set(id, { data, originalName: fileName, timestamp: Date.now() })

  // Clean up old files (older than 24 hours)
  const now = Date.now()
  for (const [key, file] of fileStore.entries()) {
    if (now - file.timestamp > 24 * 60 * 60 * 1000) {
      fileStore.delete(key)
    }
  }
}

export function getFile(fileName: string): StoredFile | undefined {
  return fileStore.get(fileName)
}
