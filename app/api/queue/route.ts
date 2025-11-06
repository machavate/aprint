import { getQueue, removeFromQueue } from "@/lib/storage"

interface QueueItem {
  id: string
  timestamp: string
  fileName: string
  copies: number
}

export async function GET() {
  const queue = getQueue()
  return Response.json({ success: true, queue })
}

export async function DELETE(request: Request) {
  const body = await request.json()
  const { id } = body

  removeFromQueue(id)

  return Response.json({ success: true })
}
