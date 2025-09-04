'use client'

import { useEffect, useState } from 'react'

export default function SimpleDashboard() {
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    fetch('/api/health')
      .then(res => res.json())
      .then(setData)
      .catch(console.error)
  }, [])

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">InsightTrader</h1>
      <div className="bg-gray-100 p-4 rounded">
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>
    </div>
  )
}