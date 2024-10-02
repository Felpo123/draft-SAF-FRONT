"use client";

import React, { Suspense, useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Settings,
  Users,
  ArrowUp,
  ArrowDown,
  Flame,
  Building,
  School,
  Plane,
  Landmark,
  Hospital,
  Antenna,
  ShieldPlus,
  Heart,
  Home,
  Wifi,
} from "lucide-react";
import { LoadingSpinner } from "@/components/Loader";
import TableComponent from "@/components/TableData";
import DataCard from "@/components/DataCard";
import { DonutChart } from "@/components/DonutChart";
import { AreaChart } from "@/components/BarChart";
import dynamic from "next/dynamic";
import { Incident } from "@/lib/data";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { set } from "zod";
import DashboardBar from "@/components/DashboardBar";
import { BarChart } from "@/components/BarraChart";

const MapCard = dynamic(() => import("@/components/MapCard"), { ssr: false });

interface DashboardProps {
  incidentData: Incident;
}

interface Event {
  id: string;
  date: string;
  location: string;
}

const events: Event[] = [
  { id: "1", date: "11/2014 8:00 p.", location: "Valparaíso" },
  { id: "2", date: "13/2014 8:00 p.", location: "Valparaíso RapidEye" },
  { id: "3", date: "15/2014 10:00 a.", location: "Viña del Mar" },
  { id: "4", date: "17/2014 2:00 p.", location: "Concón" },
  { id: "5", date: "20/2014 9:00 a.", location: "Quilpué" },
];

export default function DraggableDashboard({ incidentData }: DashboardProps) {
  const [dashboardData, setDashboardData] = useState({
    revenue: "$45,231.89",
    change: "+20.1% from last month",
    newCustomers: "+2350",
    activeUsers: "+12,234",
    bounceRate: "-5.25%",
  });

  const [selectedEvent, setSelectedEvent] = useState<string | null>(null); // Estado compartido para manejar la capa activa

  const handleEventClick = (eventId: string) => {
    if (eventId !== selectedEvent) {
      return setSelectedEvent(eventId); // Almacena el ID del evento seleccionado
    }
  };

  const [donutData, setDonutData] = useState([
    {
      name: "SolarCells",
      amount: 4890,
    },
    {
      name: "Glass",
      amount: 2103,
    },
    {
      name: "JunctionBox",
      amount: 2050,
    },
    {
      name: "Adhesive",
      amount: 1300,
    },
    {
      name: "BackSheet",
      amount: 1100,
    },
    {
      name: "Frame",
      amount: 700,
    },
    {
      name: "Encapsulant",
      amount: 200,
    },
  ]);

  const [areaData, setAreaData] = useState([
    {
      date: "Jan 23",
      SolarPanels: 2890,
      Inverters: 2338,
    },
    {
      date: "Feb 23",
      SolarPanels: 2756,
      Inverters: 2103,
    },
    // ... otros datos
  ]);

  const [DataTable, setDataTable] = useState([
    { id: 1, name: "Alice", email: "alice@example.com", status: "Active" },
    { id: 2, name: "Bob", email: "bob@example.com", status: "Inactive" },
    { id: 3, name: "Charlie", email: "charlie@example.com", status: "Active" },
    { id: 4, name: "David", email: "david@example.com", status: "Pending" },
  ]);

  const chartdata = [
    {
      category: "Total Personas",
      value: 143.2,
    },
    {
      category: "Hombre",
      value: 82.5,
    },
    {
      category: "Mujeres",
      value: 60.6,
    },
    {
      category: "0 a 5 años",
      value: 8.3,
    },
    {
      category: "6 a 14 años",
      value: 13.5,
    },
    {
      category: "15 a 64 años",
      value: 105,
    },
    {
      category: "65 años o más",
      value: 13.6,
    },
    {
      category: "Migrantes",
      value: 1.1,
    },
    {
      category: "Pueblo Indígena",
      value: 7.6,
    },
    {
      category: "Hogares",
      value: 37.9,
    },
  ];

  const usoData = [
    { category: "Áreas Desprovistas de Vegetación", value: 7 },
    { category: "Áreas Urbanas e Industriales", value: 2844.4 },
    { category: "Bosques", value: 1647 },
    { category: "Praderas y Matorrales", value: 188.7 },
  ];

  const tipoUsoData = [
    { category: "Plantación", value: 4000 },
    { category: "Praderas y Matorrales", value: 188.7 },
    { category: "Bosques", value: 1647 },
    { category: "Áreas Urbanas e Industriales", value: 2844.4 },
    { category: "Áreas Desprovistas de Vegetación", value: 7 },
  ];

  return (
    <div className="flex flex-col h-full min-h-screen bg-gray-100 p-2 lg:p-4 ">
      <DashboardBar
        placeholders={
          incidentData && {
            name_incident: incidentData.nombre,
            type: incidentData.tipo,
            state: incidentData.estado,
          }
        }
      />
      <div className="md:grid md:grid-cols-5 md:grid-rows-5 gap-2 h-full grid-auto-rows-[minmax(100px,_1fr)] flex-grow ">
        {/* 1 - Eventos de emergencia */}
        <Card className="row-span-2 overflow-y-auto max-h-[calc(100vh-200px)]">
          <CardHeader className="flex flex-row items-center justify-center space-y-0 pb-2">
            <CardTitle className="`text-lg lg:text-xl` font-bold text-center">
              Eventos de emergencia
            </CardTitle>
          </CardHeader>
          <CardContent>
            {events.map((event) => (
              <Button
                key={event.id}
                variant="ghost"
                className={`w-full mb-3 p-3 flex items-center transition-colors  ${
                  selectedEvent === event.id
                    ? "bg-blue-100 text-primary-foreground"
                    : "bg-white hover:bg-blue-100"
                }`}
                onClick={() => handleEventClick(event.id)}
              >
                <Flame className="w-5 h-5 mr-2 flex-shrink-0" />
                <div className="flex flex-col justify-start w-full">
                  <p className="font-medium text-left">{event.date}</p>
                  <p className="text-sm text-gray-400 text-left">
                    {event.location}
                  </p>
                </div>
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* 4 - El Mapa */}
        <MapCard
          className="col-span-3 row-span-4 col-start-2 row-start-1"
          selectedEvent={selectedEvent ? selectedEvent : undefined}
          location={incidentData && incidentData.coordenada}
        />

        {/* 2 - 2 Cards Superficie Afectada */}
        <div className="col-start-1 row-start-3  grid grid-rows-2 gap-2 ">
          <DataCard
            title="Superficie afectada a la fecha"
            icon={<Flame className="h-4 w-4" />}
          >
            <div className="text-2xl font-bold">779,45 ha.</div>
          </DataCard>

          <DataCard
            title=" Superficie afectada"
            icon={<Flame className="h-4 w-4" />}
          >
            <div className="text-2xl font-bold">779,45 ha.</div>
          </DataCard>
        </div>

        {/* 3 - Demografía */}
        <Card className="row-span-2">
          <CardHeader className="p-2">
            <CardTitle className="`text-lg lg:text-xl` text-center">
              Demografía
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[200px] lg:h-[300px]">
            <Suspense fallback={<LoadingSpinner />}>
              <BarChart
                className="h-full w-full"
                data={chartdata}
                index="category"
                categories={["value"]}
                valueFormatter={(number: number) =>
                  `$${Intl.NumberFormat("us").format(number).toString()}`
                }
                layout="vertical"
              />
            </Suspense>
          </CardContent>
        </Card>

        {/* 5 - 4 Cards */}
        <div className="col-start-2 row-start-5 grid grid-cols-2 gap-2">
          <DataCard title="Bomberos" icon={<Flame className="h-4 w-4" />}>
            <div className="text-2xl font-bold">3</div>
          </DataCard>

          <DataCard title="Carabineros" icon={<Flame className="h-4 w-4" />}>
            <div className="text-2xl font-bold">3</div>
          </DataCard>

          <DataCard title="Aeropuertos" icon={<Plane className="h-4 w-4" />}>
            <div className="text-2xl font-bold">0</div>
          </DataCard>
          <DataCard title="PDI" icon={<Flame className="h-4 w-4" />}>
            <div className="text-2xl font-bold">3</div>
          </DataCard>
        </div>

        {/* 6 - Edificaciones Afectadas */}

        <DataCard
          title="Edificaciones Afectadas"
          icon={<Building className="h-4 w-4" />}
          classname="col-start-3 row-start-5"
        >
          <div className="text-3xl font-bold text-green-500">1,811</div>
        </DataCard>

        {/* 7 - 4 Cards (Educación, Salud, Municipios, Antenas) */}
        <div className="col-start-4 row-start-5 grid grid-cols-2 gap-2">
          <DataCard title="Educación" icon={<School className="h-4 w-4" />}>
            <div className="text-2xl font-bold">0</div>
          </DataCard>
          <DataCard
            title="Recintos de Salud"
            icon={<Heart className="h-4 w-4" />}
          >
            <div className="text-2xl font-bold">0</div>
          </DataCard>
          <DataCard title="Municipios" icon={<Home className="h-4 w-4" />}>
            <div className="text-2xl font-bold">0</div>
          </DataCard>
          <DataCard title="Antenas" icon={<Wifi className="h-4 w-4" />}>
            <div className="text-2xl font-bold">0</div>
          </DataCard>
        </div>

        {/* 8 - Gráfico de Uso */}
        <Card className="row-span-2 col-start-5 row-start-2">
          <CardHeader className="p-2">
            <CardTitle className="`text-lg lg:text-xl` text-center">
              Gráfico de Uso
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[200px] lg:h-[300px]">
            <BarChart
              className="h-full w-full"
              data={usoData}
              index="category"
              categories={["value"]}
              valueFormatter={(number: number) =>
                `${Intl.NumberFormat("us").format(number)} ha`
              }
              layout="vertical"
            />
          </CardContent>
          <CardFooter className="w-full">
            <p className="text-right text-xs text-gray-300">
              Última actualización: hace 2 min
            </p>
          </CardFooter>
        </Card>

        {/* 9 - Botón para regresar al Home */}
        <Card className="col-start-5 row-start-1 flex items-center justify-center">
          <Button
            onClick={() => console.log("home")}
            className="w-3/4 bg-blue-500 hover:bg-blue-600"
          >
            ESPACIO VACIO!
          </Button>
        </Card>

        {/* 10 - Gráfico de Tipo de Uso */}
        <Card className="row-span-2 col-start-5 row-start-4">
          <CardHeader className="p-2">
            <CardTitle className="`text-lg lg:text-xl` text-center">
              Tipo de uso de tierra afectada
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[200px] lg:h-[300px]">
            <BarChart
              className="h-full w-full"
              data={tipoUsoData}
              index="category"
              categories={["value"]}
              valueFormatter={(number: number) =>
                `${Intl.NumberFormat("us").format(number)} ha`
              }
              layout="vertical"
            />
          </CardContent>
          <CardFooter className="w-full">
            <p className="text-right text-xs text-gray-300">
              Última actualización: hace 2 min
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
