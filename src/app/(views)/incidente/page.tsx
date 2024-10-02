import React from "react";
import IncidentForm from "./incidentForm";
import { incidentsData } from "@/lib/data";

async function IncidentPage({
  searchParams,
}: {
  searchParams?: { action?: string; incident?: string };
}) {
  const action = searchParams?.action || "create";
  const incidentID = searchParams?.incident || "1";

  if (action === "create") {
    return <IncidentForm action="create" />;
  }

  const getIncidentData = async (id: string) => {
    return incidentsData.find((incident) => incident.id === id);
  };

  const incidentData = (await getIncidentData(incidentID)) || incidentsData[0];

  return <IncidentForm action={action} incident={incidentData} />;
}

export default IncidentPage;
