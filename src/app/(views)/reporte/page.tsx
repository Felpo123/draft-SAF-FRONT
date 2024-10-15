import { LoadingSpinner } from '@/components/Loader'
import { Suspense } from 'react'
import { date, number } from 'zod'
import dynamic from 'next/dynamic'
import { extractDatesAndIds, fetchIncidentGEOJSON } from '@/lib/mapUtils'
import { notFound } from 'next/navigation'
import IncidentReportDashboard from '@/components/ReportPage'

async function MapLibrePage({
  searchParams,
}: {
  searchParams?: {
    name?: string
    idEvent?: string
  }
}) {
  const nameEvent = searchParams?.name || 'Xd'

  const idEvent = searchParams?.idEvent || '01'

  const geojsonData = await fetchIncidentGEOJSON(idEvent)

  if (!geojsonData) {
    return notFound()
  }

  return (
    <Suspense key={idEvent} fallback={<LoadingSpinner />}>
      <IncidentReportDashboard geoJson={geojsonData} />
    </Suspense>
  )
}

export default MapLibrePage