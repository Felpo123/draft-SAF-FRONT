'use client';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Button } from './ui/button';
import { Download, Eye } from 'lucide-react';
import { Charts } from './chart-01';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { useState } from 'react';
import { Input } from './ui/input';
import { incidentsData } from '@/lib/data';

function GeneralReport() {
  const performanceData = [
    { name: 'Incendios', value: 87 },
    { name: 'Inundaciones', value: 35 },
    { name: 'Sismos', value: 25 },
    { name: 'Remociones', value: 12 },
  ];
  const [searchTerm, setSearchTerm] = useState('');

  const filteredIncidents = incidentsData.filter((incident) =>
    incident.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Datos para las regiones y comunas más afectadas
  const regionData = [
    {
      region: 'Valparaíso',
      comunas: ['Viña del Mar', 'Quillota'],
      poblacionAfectada: 50000,
      tiposDeIncidentes: ['Incendios', 'Inundaciones'],
    },
    {
      region: 'Santiago',
      comunas: ['Maipú', 'Puente Alto'],
      poblacionAfectada: 120000,
      tiposDeIncidentes: ['Terremotos', 'Incendios'],
    },
    {
      region: 'Concepción',
      comunas: ['Talcahuano', 'Hualpén'],
      poblacionAfectada: 80000,
      tiposDeIncidentes: ['Incendios', 'Deslizamientos de tierra'],
    },
  ];

  return (
    <div className="flex justify-center p-6 bg-gray-100 min-h-screen">
      <div className="w-3/5 p-10 bg-white shadow-lg rounded-lg">
        {/* Encabezado */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-4xl font-bold text-blue-900 mb-2 font-serif">
            Reporte General
          </h1>
          <Button className="bg-blue-600 text-white hover:bg-blue-700">
            <Download className="mr-2 h-4 w-4" /> Exportar
          </Button>
        </div>
        <p className="text-gray-600 italic">Fecha: 24 de Octubre, 2024</p>
        <p className="text-gray-600 italic mb-6">Periodo: 1er semestre 2024</p>

        {/* Cuerpo del reporte */}
        <div className="mb-10 space-y-8">
          <div>
            <h2 className="text-2xl font-semibold text-blue-800 mb-4 font-serif">
              Resumen
            </h2>
            <p className="text-gray-800 leading-relaxed text-justify">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book. It has
              survived not only five centuries, but also the leap into
              electronic typesetting, remaining essentially unchanged.
            </p>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Resumen de Incidentes</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {performanceData.map((item) => (
                  <div key={item.name} className="flex flex-col items-center">
                    <Progress value={item.value} className="w-24 h-24" />
                    <p className="mt-2 text-sm font-medium">{item.name}</p>
                    <p className="text-2xl font-bold text-blue-800">
                      {item.value}%
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Subsección: Regiones, Comunas Más Afectadas, Población y Tipos de Incidentes */}
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-blue-800 mb-4 font-serif">
                Regiones y Comunas Más Afectadas
              </h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Región</TableHead>
                    <TableHead>Comunas</TableHead>
                    <TableHead>Población Afectada</TableHead>
                    <TableHead>Tipos de Incidentes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {regionData.map((region, index) => (
                    <TableRow key={index}>
                      <TableCell>{region.region}</TableCell>
                      <TableCell>{region.comunas.join(', ')}</TableCell>
                      <TableCell>
                        {region.poblacionAfectada.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {region.tiposDeIncidentes.join(', ')}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-blue-800 mb-4 font-serif">
              Detalles
            </h2>
            <p className="text-gray-800 leading-relaxed">
              Esta sección puede incluir los detalles más importantes del
              reporte. Puedes usar párrafos, listas, o cualquier otro contenido
              relevante.
            </p>

            <Card className="mt-6">
              <CardHeader className="p-1"></CardHeader>
              <div className="my-2 mx-6">
                <Input
                  type="text"
                  placeholder="Buscar incidente"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-1/3"
                />
              </div>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Ubicación</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Descripción</TableHead>
                      <TableHead>Ver Inicidente</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredIncidents.map((incident) => (
                      <TableRow key={incident.id}>
                        <TableCell>{incident.ultima_actualizacion}</TableCell>
                        <TableCell>{incident.tipo}</TableCell>
                        <TableCell>{incident.region}</TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full ${
                              incident.estado === 'Activo'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {incident.estado}
                          </span>
                        </TableCell>
                        <TableCell>{incident.nombre}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Sección de visualizaciones */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold text-blue-800 mb-4 font-serif">
            Visualizaciones
          </h2>
          <div className="bg-gray-100 p-6 rounded-lg">
            <p className="text-gray-600 mb-4">
              Espacio para gráficos o mapas geoespaciales.
            </p>
            <Charts />
          </div>
        </div>

        {/* Conclusiones */}
        <div>
          <h2 className="text-2xl font-semibold text-blue-800 mb-4 font-serif">
            Conclusiones
          </h2>
          <p className="text-gray-800 leading-relaxed text-justify">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book. It has survived not
            only five centuries, but also the leap into electronic typesetting,
            remaining essentially unchanged.
          </p>
        </div>
      </div>
    </div>
  );
}

export default GeneralReport;
