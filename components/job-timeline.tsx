"use client"

interface TimelineUpdate {
  status: string
  time: string
  message: string
}

interface JobTimelineProps {
  updates: TimelineUpdate[]
}

export default function JobTimeline({ updates }: JobTimelineProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Histórico de Atualizações</h2>

      <div className="space-y-4">
        {updates.map((update, index) => (
          <div key={index} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="w-4 h-4 rounded-full bg-primary mt-1.5"></div>
              {index < updates.length - 1 && <div className="w-1 h-12 bg-border mt-2"></div>}
            </div>
            <div className="pb-4">
              <div className="flex items-center gap-3 mb-1">
                <p className="font-semibold">{update.status}</p>
                <p className="text-sm text-muted-foreground">{update.time}</p>
              </div>
              <p className="text-muted-foreground">{update.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
