"use client";
import React, { useState, useEffect, use } from "react";
import { Card } from "./ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { incidentsData } from "@/lib/data";
import { usePathname, useSearchParams, useRouter } from "next/navigation";

interface DashboardBarProps {
  placeholders?: {
    type: string;
    state: string;
    name_incident: string;
  };
}

function DashboardBar({ placeholders }: DashboardBarProps) {
  // Estados locales para el tipo, estado y nombre seleccionados
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [selectedIncident, setSelectedIncident] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  // Filtrar los incidentes basados en el tipo de evento y estado seleccionados
  const filteredIncidents = incidentsData.filter((incident) => {
    return (
      (!selectedType ||
        incident.tipo.toLowerCase() === selectedType.toLowerCase()) &&
      (!selectedState ||
        incident.estado.toLowerCase() === selectedState.toLowerCase())
    );
  });

  // Manejar cambios en el select de tipo de evento
  const handleTypeChange = (value: string) => {
    setSelectedType(value);
    setSelectedIncident(null); // Resetear nombre del evento
  };

  // Manejar cambios en el select de estado
  const handleStateChange = (value: string) => {
    setSelectedState(value);
    setSelectedIncident(null); // Resetear nombre del evento
  };

  // Manejar cambios en el select de nombre de evento
  const handleIncidentChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set("incident", value);
    } else {
      params.delete("incident");
    }
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <Card className="mb-2 p-4 rounded-lg shadow-sm">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-xl font-bold">
          Plataforma Emergencia Desafío SAF-UFRO 2024
        </h1>
        <div className="flex space-x-2">
          {/* Select de Tipo de Evento */}
          <span className="font-semibold xl:flex items-center hidden">
            Tipo de Evento
          </span>
          <Select onValueChange={handleTypeChange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue
                placeholder={placeholders ? placeholders.type : "Tipo Evento"}
              />
            </SelectTrigger>
            <SelectContent className="z-[1000]">
              <SelectItem value="Incendios">Incendio</SelectItem>
              <SelectItem value="Inundaciones">Inundación</SelectItem>
              <SelectItem value="Erupciones Volcánicas">
                Erupción Volcánica
              </SelectItem>
              <SelectItem value="Sismos">Sismo</SelectItem>
            </SelectContent>
          </Select>

          {/* Select de Estado */}
          <span className="font-semibold xl:flex items-center hidden">
            Estado
          </span>
          <Select onValueChange={handleStateChange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue
                placeholder={placeholders ? placeholders.state : "Estado"}
              />
            </SelectTrigger>
            <SelectContent className="z-[1000]">
              <SelectItem value="Activo">Activo</SelectItem>
              <SelectItem value="Inactivo">Inactivo</SelectItem>
            </SelectContent>
          </Select>

          {/* Select de Nombre de Evento */}
          <span className="font-semibold xl:flex items-center hidden">
            Nombre Evento
          </span>
          <Select onValueChange={handleIncidentChange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue
                placeholder={
                  placeholders ? placeholders.name_incident : "Nombre de Evento"
                }
              />
            </SelectTrigger>
            <SelectContent className="z-[1000]">
              {filteredIncidents.map((incident) => (
                <SelectItem key={incident.id} value={incident.id}>
                  {incident.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </Card>
  );
}

export default DashboardBar;
