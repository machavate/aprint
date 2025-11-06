// Queue Manager for handling FIFO print job queue
interface QueueJob {
  id: string
  priority: "high" | "medium" | "low"
  createdAt: Date
  status: "pending" | "processing" | "completed"
}

class PrintQueueManager {
  private queue: QueueJob[] = []

  /**
   * Add a job to the queue
   * Jobs are automatically ordered by priority, then FIFO
   */
  addJob(job: QueueJob): void {
    this.queue.push(job)
    this.sortQueue()
  }

  /**
   * Get the next job from the queue
   */
  getNextJob(): QueueJob | null {
    const pendingJobs = this.queue.filter((job) => job.status === "pending")
    return pendingJobs[0] || null
  }

  /**
   * Update job status
   */
  updateJobStatus(jobId: string, status: string): boolean {
    const job = this.queue.find((j) => j.id === jobId)
    if (job) {
      job.status = status as any
      return true
    }
    return false
  }

  /**
   * Get all jobs in queue
   */
  getQueue(): QueueJob[] {
    return [...this.queue]
  }

  /**
   * Sort queue by priority (high > medium > low) then by creation time (FIFO)
   */
  private sortQueue(): void {
    const priorityOrder = { high: 0, medium: 1, low: 2 }
    this.queue.sort((a, b) => {
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority]
      if (priorityDiff !== 0) return priorityDiff
      return a.createdAt.getTime() - b.createdAt.getTime()
    })
  }

  /**
   * Get queue statistics
   */
  getStats() {
    return {
      total: this.queue.length,
      pending: this.queue.filter((j) => j.status === "pending").length,
      processing: this.queue.filter((j) => j.status === "processing").length,
      completed: this.queue.filter((j) => j.status === "completed").length,
    }
  }
}

export const queueManager = new PrintQueueManager()
