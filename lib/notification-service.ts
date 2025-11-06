// Notification service for sending status updates to customers
export interface StatusNotification {
  jobId: string
  status: "received" | "queued" | "processing" | "printing" | "completed"
  customerEmail: string
  message: string
}

const statusMessages = {
  received: "Seu ficheiro foi recebido com sucesso",
  queued: "Seu trabalho foi adicionado à fila de impressão",
  processing: "Seu trabalho está sendo preparado",
  printing: "Seu trabalho está sendo impresso",
  completed: "Seu trabalho está pronto para retirada",
}

export async function sendStatusNotification(notification: StatusNotification) {
  try {
    // TODO: Implement email notification using SendGrid or similar
    console.log("[v0] Notification would be sent:", {
      to: notification.customerEmail,
      subject: `Atualização do Trabalho #${notification.jobId}`,
      message: statusMessages[notification.status],
    })

    // Placeholder for actual email sending
    return { success: true, notificationId: Date.now() }
  } catch (error) {
    console.error("[v0] Error sending notification:", error)
    return { success: false, error: "Failed to send notification" }
  }
}

export async function sendBulkStatusUpdates(jobs: any[]) {
  // TODO: Batch process status updates for all jobs
  for (const job of jobs) {
    await sendStatusNotification({
      jobId: job.id,
      status: job.status,
      customerEmail: job.customerEmail,
      message: `Your job ${job.name} status: ${job.status}`,
    })
  }
}
