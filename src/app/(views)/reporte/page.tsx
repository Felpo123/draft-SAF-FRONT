'use client'
import { AreaChart } from '@/components/BarChart'
import { DonutChart } from '@/components/DonutChart'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  BarChart,
  PieChart,
  MapPin,
  Home,
  Building,
  Download,
  Upload,
  AlertTriangle,
  Bell,
} from 'lucide-react'

const AreaData = [
  {
    date: 'Jan 23',
    SolarPanels: 2890,
    Inverters: 2338,
  },
  {
    date: 'Feb 23',
    SolarPanels: 2756,
    Inverters: 2103,
  },
  {
    date: 'Mar 23',
    SolarPanels: 3322,
    Inverters: 2194,
  },
  {
    date: 'Apr 23',
    SolarPanels: 3470,
    Inverters: 2108,
  },
  {
    date: 'May 23',
    SolarPanels: 3475,
    Inverters: 1812,
  },
  {
    date: 'Jun 23',
    SolarPanels: 3129,
    Inverters: 1726,
  },
  {
    date: 'Jul 23',
    SolarPanels: 3490,
    Inverters: 1982,
  },
  {
    date: 'Aug 23',
    SolarPanels: 2903,
    Inverters: 2012,
  },
  {
    date: 'Sep 23',
    SolarPanels: 2643,
    Inverters: 2342,
  },
  {
    date: 'Oct 23',
    SolarPanels: 2837,
    Inverters: 2473,
  },
  {
    date: 'Nov 23',
    SolarPanels: 2954,
    Inverters: 3848,
  },
  {
    date: 'Dec 23',
    SolarPanels: 3239,
    Inverters: 3736,
  },
]

const DonutData = [
  {
    name: 'SolarCells',
    amount: 4890,
  },
  {
    name: 'Glass',
    amount: 2103,
  },
  {
    name: 'JunctionBox',
    amount: 2050,
  },
  {
    name: 'Adhesive',
    amount: 1300,
  },
  {
    name: 'BackSheet',
    amount: 1100,
  },
  {
    name: 'Frame',
    amount: 700,
  },
  {
    name: 'Encapsulant',
    amount: 200,
  },
]

export default function IncidentReportDashboard() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <header className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Reporte de Incidentes</h1>
        <Button className="bg-blue-600 text-white hover:bg-blue-700">
          <Download className="mr-2 h-4 w-4" /> Descargar Reporte
        </Button>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Detalles del Incidente</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Ubicación</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Descripción</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>01-09-2021 12:43:02</TableCell>
                <TableCell>Incendio</TableCell>
                <TableCell>Valparaíso</TableCell>
                <TableCell>
                  <span className="px-2 py-1 rounded-full bg-yellow-100 text-yellow-800">
                    Activo
                  </span>
                </TableCell>
                <TableCell>Incendio forestal en zona continental</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Superficie Afectada
            </CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3626.45 KM</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Viviendas Afectadas
            </CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7642</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Establecimientos Afectados
            </CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">424</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="image" className="space-y-4">
        <TabsList>
          <TabsTrigger value="image">Última Imagen</TabsTrigger>
          <TabsTrigger value="zone">Zona Afectada</TabsTrigger>
          <TabsTrigger value="people">Personas Afectadas</TabsTrigger>
        </TabsList>
        <TabsContent value="image" className="space-y-4">
          <Card>
            <CardContent className="p-3">
              <img
                src="/imgs/3.jpeg"
                alt="Última imagen del incidente"
                className="w-full  object-cover rounded-lg"
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="zone" className="space-y-4 ">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">
                Gráfico Zona Afectada
              </CardTitle>
            </CardHeader>
            <CardContent className="pl-2 flex justify-center">
              <div className="w-3/4">
                <AreaChart
                  className="min-h-14 "
                  data={AreaData}
                  index="date"
                  categories={['SolarPanels', 'Inverters']}
                  valueFormatter={(number: number) =>
                    `$${Intl.NumberFormat('us').format(number).toString()}`
                  }
                  onValueChange={(v) => console.log(v)}
                  autoMinValue
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="people" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">
                Gráfico Personas Afectadas
              </CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <DonutChart
                data={DonutData}
                variant="pie"
                category="name"
                value="amount"
                valueFormatter={(number: number) =>
                  `$${Intl.NumberFormat('us').format(number).toString()}`
                }
                className="w-full h-80"
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end space-x-4">
        <Button variant="outline">
          <Upload className="mr-2 h-4 w-4" /> Importar Información
        </Button>
        <Button variant="destructive">
          <AlertTriangle className="mr-2 h-4 w-4" /> Finalizar Incidente
        </Button>
        <Button className="bg-blue-600 text-white hover:bg-blue-700">
          <Bell className="mr-2 h-4 w-4" /> Alerta
        </Button>
      </div>
    </div>
  )
}
