"use client"

import { useMemo } from "react"
import { Studio } from "@prisma/studio-core/ui"
import { createPostgresAdapter } from "@prisma/studio-core/data/postgres-core"
import { createStudioBFFClient } from "@prisma/studio-core/data/bff"
import "@prisma/studio-core/ui/index.css"

export default function PrismaStudioPage() {
  const adapter = useMemo(() => {
    const studioUrl = process.env.NEXT_PUBLIC_STUDIO_URL || "http://localhost:3000/api/studio"

    const executor = createStudioBFFClient({
      url: studioUrl,
    })

    const adapter = createPostgresAdapter({ executor })
    return adapter
  }, [])

  return (
    <div className="h-screen w-full">
      <Studio adapter={adapter} />
    </div>
  )
}
