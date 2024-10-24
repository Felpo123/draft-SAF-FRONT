import { LoadingSpinner } from '@/components/Loader';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import IncidentReportDashboard from '@/components/ReportPage';
import { geoserverApi } from '@/lib/api/geoserver/geoserverApi';
import { geojsonData } from '@/lib/data';
import GeneralReport from '@/components/GeneralReport';

async function MapLibrePage({
  searchParams,
}: {
  searchParams?: {
    name?: string;
    idEvent?: string;
  };
}) {
  const nameEvent = searchParams?.name || 'Xd';

  const idEvent = searchParams?.idEvent || '01';

  // const geojsonData = await geoserverApi.getIncidentsByIDEvent(idEvent);

  const geoJsonData = geojsonData;

  if (!geoJsonData) {
    return notFound();
  }

  return (
    <Suspense key={idEvent} fallback={<LoadingSpinner />}>
      {/* <IncidentReportDashboard geoJson={geoJsonData} /> */}
      <GeneralReport />
    </Suspense>
  );
}

export default MapLibrePage;
