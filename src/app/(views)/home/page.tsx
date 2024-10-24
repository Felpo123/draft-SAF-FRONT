import { geojsonData, Incident, incidentsData } from '@/lib/data';
import { columns } from './columns';
import { DataTable } from './data-table';
import { agruparIncidentesPorEvento, Geojson } from '@/lib/mapUtils';
import { notFound } from 'next/navigation';
import { auth } from '@/lib/auth-config';

const fetchDataIncident = async () => {
  const wfsUrl = `http://192.168.1.116:8080/geoserver/desafio/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=desafio:incidentes&outputFormat=application/json`;
  try {
    const response = await fetch(wfsUrl);
    if (!response.ok) {
      throw new Error(
        `Error en la respuesta del servidor: ${response.statusText}`
      );
    }

    const data = (await response.json()) as Geojson;

    const groupIncidences = agruparIncidentesPorEvento(data.features);

    return groupIncidences;
  } catch (error) {
    console.error('Error al obtener los datos WFS:', error);
  }
};

export default async function DemoPage() {
  const geojson = geojsonData;
  const data = agruparIncidentesPorEvento(geojson.features);
  // const data = await fetchDataIncident();
  const session = await auth();

  console.log('SESSION', session);

  if (!data) {
    return notFound();
  }

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
