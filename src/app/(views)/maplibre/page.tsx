import { LoadingSpinner } from "@/components/Loader"
import { Suspense } from "react"
import { date } from "zod"
import dynamic from 'next/dynamic'

// Cargar el componente dinámicamente deshabilitando SSR
const DynamicMap = dynamic(
  () => import('../../../components/LayerisMapLibre'),
  { ssr: false, loading: () => <LoadingSpinner /> },

)

async function MapLibrePage({
  searchParams,
}: {
  searchParams?: {
    incident?: string
    date?: string
  }
}) {
  const incidentId = searchParams?.incident || '1'

  const date = searchParams?.date || ''

  return (
    <Suspense key={date} fallback={<LoadingSpinner />}>
      <DynamicMap incidentId={incidentId} date={date} />
    </Suspense>
  )
}

export default MapLibrePage