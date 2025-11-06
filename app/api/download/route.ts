import { getFile } from "@/lib/storage"

function getMimeType(fileName: string): string {
  const ext = fileName.substring(fileName.lastIndexOf(".")).toLowerCase()
  const mimeTypes: Record<string, string> = {
    ".pdf": "application/pdf",
    ".doc": "application/msword",
    ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ".xls": "application/vnd.ms-excel",
    ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ".ppt": "application/vnd.ms-powerpoint",
    ".pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    ".txt": "text/plain",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".gif": "image/gif",
  }
  return mimeTypes[ext] || "application/octet-stream"
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const fileName = searchParams.get("file")

    if (!fileName) {
      return new Response("Ficheiro não encontrado", { status: 400 })
    }

    const storedFile = getFile(fileName)
    if (!storedFile) {
      return new Response("Ficheiro não encontrado", { status: 404 })
    }

    const mimeType = getMimeType(fileName)

    return new Response(storedFile.data, {
      headers: {
        "Content-Type": mimeType,
        "Content-Disposition": `attachment; filename="${fileName}"`,
      },
    })
  } catch (error) {
    console.error("Erro ao fazer download:", error)
    return new Response("Erro ao fazer download", { status: 500 })
  }
}
