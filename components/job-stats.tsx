"use client"

import { Card } from "@/components/ui/card"

interface StatCard {
  label: string
  value: string | number
  icon: string
  color: string
}

export default function JobStats() {
  const stats: StatCard[] = [
    {
      label: "Trabalhos em Fila",
      value: 12,
      icon: "📋",
      color: "bg-yellow-100 text-yellow-800",
    },
    {
      label: "Em Processamento",
      value: 3,
      icon: "⚙️",
      color: "bg-blue-100 text-blue-800",
    },
    {
      label: "Concluídos Hoje",
      value: 8,
      icon: "✅",
      color: "bg-green-100 text-green-800",
    },
    {
      label: "Tempo Médio",
      value: "45 min",
      icon: "⏱️",
      color: "bg-purple-100 text-purple-800",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
              <p className="text-3xl font-bold">{stat.value}</p>
            </div>
            <div className={`text-2xl p-2 rounded-lg ${stat.color}`}>{stat.icon}</div>
          </div>
        </Card>
      ))}
    </div>
  )
}
