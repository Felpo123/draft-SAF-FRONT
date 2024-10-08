import { LoadingSpinner } from '@/components/Loader'
import { Suspense } from 'react'
import { date, number } from 'zod'
import dynamic from 'next/dynamic'
import { extractDatesAndIds, fetchIncidentGEOJSON } from '@/lib/mapUtils'

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
    idEvent?: string
  }
}) {
  const incidentId = searchParams?.incident || '1'

  const idEvent = searchParams?.idEvent || '01'

  const geojsonData = await fetchIncidentGEOJSON(idEvent)

  if (!geojsonData) {
    return <div>No se encontró información para el incidente</div>
  }

  return (
    <Suspense key={idEvent} fallback={<LoadingSpinner />}>
      <DynamicMap
        incidentId={incidentId}
        idEvent={idEvent}
        geoJson={geojsonData}
      />
    </Suspense>
  )
}

export default MapLibrePage

// pages/index.js
// "use client";
// import Head from 'next/head';
// import MapComponent from '../../../components/MapaLineaTiempo';

// export default function Home() {
//   const initialUserId = '1'; // Reemplaza con el ID que deseas usar

//   return (
//     <div>
//       <Head>
//         <title>Mapa con MapLibre</title>
//         <meta name="description" content="Mapa de ejemplo usando MapLibre GL y OpenStreetMap" />
//         <link rel="icon" href="/favicon.ico" />
//       </Head>
//       <h1 style={{ textAlign: 'center' }}>Mapa de OpenStreetMap con MapLibre</h1>
//       <MapComponent initialIncidentId={'2'} /> {/* Pasa el ID aquí */}
//     </div>
//   );
// }
