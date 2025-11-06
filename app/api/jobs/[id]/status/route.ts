import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const { status, message } = body

    // TODO: Save status update to database
    const statusUpdate = {
      jobId: id,
      status,
      message,
      timestamp: new Date().toISOString(),
      notificationSent: false,
    }

    console.log("[v0] Status update created:", statusUpdate)

    // TODO: Send notification to customer via email
    // sendEmailNotification(jobId, status, message)

    return NextResponse.json({
      success: true,
      data: statusUpdate,
    })
  } catch (error) {
    console.error("[v0] Error updating job status:", error)
    return NextResponse.json({ success: false, error: "Failed to update job status" }, { status: 500 })
  }
}
