import { LoadingSpinner } from '@/components/Loader'
import { Suspense } from 'react'
import { date, number } from 'zod'
import dynamic from 'next/dynamic'
import { extractDatesAndIds, fetchIncidentGEOJSON } from '@/lib/mapUtils'
import { notFound } from 'next/navigation'

// Cargar el componente dinámicamente deshabilitando SSR
const DynamicMap = dynamic(
  () => import('../../../components/LayerisMapLibre'),
  { ssr: false, loading: () => <LoadingSpinner /> },
)

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

  let geojsonData;
  // = await fetchIncidentGEOJSON(idEvent)

  // if (!geojsonData) {
  //   return notFound()
  // }

  return (
    <Suspense key={idEvent} fallback={<LoadingSpinner />}>
      <DynamicMap
        nameEvent={nameEvent}
        idEvent={idEvent}
        geoJson={geojsonData}
      />
    </Suspense>
  )
}

export default MapLibrePage