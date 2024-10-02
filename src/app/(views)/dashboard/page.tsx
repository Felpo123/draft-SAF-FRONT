import React, { Suspense } from "react";
import DraggableDashboard from "./Dashboard";
import { incidentsData } from "@/lib/data";
import { LoadingSpinner } from "@/components/Loader";
import MapDashboard from "./new-dashboard";

async function DashboardPage({
  searchParams,
}: {
  searchParams?: {
    incident?: string;
  };
}) {
  const incidentId = searchParams?.incident || "1";

  const getIncidentData = async (id: string) => {
    return incidentsData.find((incident) => incident.id === id);
  };

  const incidentData = (await getIncidentData(incidentId)) || incidentsData[0];

  return (
    <Suspense key={incidentId} fallback={<LoadingSpinner />}>
      {/* <DraggableDashboard incidentData={incidentData} /> */}
      <MapDashboard></MapDashboard>
    </Suspense>
  );
}

export default DashboardPage;
