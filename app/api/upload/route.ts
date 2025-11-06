import { addToQueue, storeFile } from "@/lib/storage"

export async function POST(request: Request) {
  const formData = await request.formData()
  const file = formData.get("file") as File
  const copies = formData.get("copies") as string

  if (!file) {
    return Response.json({ error: "Ficheiro não encontrado" }, { status: 400 })
  }

  const bytes = await file.arrayBuffer()
  storeFile(file.name, Buffer.from(bytes))

  const id = addToQueue(file.name, Number.parseInt(copies) || 1)

  return Response.json({
    success: true,
    fileName: file.name,
    copies: copies,
    id: id,
  })
}
