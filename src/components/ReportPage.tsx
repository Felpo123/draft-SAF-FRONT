'use client'
import { AreaChart } from '@/components/BarChart'
import BarChartToMap from '@/components/BarChartToMap'
import { DonutChart } from '@/components/DonutChart'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { extractDatesAndComunas, extractDatesAndIds, Geojson } from '@/lib/mapUtils'
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
import { useState } from 'react'

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

const comunas = ["Todas", "Santiago", "Concepción", "Valparaíso", "Viña del Mar", "La Serena"]

const InfrastructureData = [
    {
        id: 1,
        entity: 'Carabineros',
        quantity: 100,
        icon: '👮',
        color: 'bg-blue-500',
    },
    {
        id: 2,
        entity: 'Bomberos',
        quantity: 100,
        icon: '🚒',
        color: 'bg-white',
    },
    {
        id: 4,
        entity: 'Superfice Afectada (ha)',
        quantity: 500, // Asumiendo un valor para superficieTotal
        icon: '🌍',
        color: 'bg-yellow-500',
    },
    {
        id: 5,
        entity: 'Recintos de Salud',
        quantity: 75,
        icon: '🏥',
        color: 'bg-yellow-500',
    },
    {
        id: 6,
        entity: 'Edificaciones Afectadas',
        quantity: 75,
        icon: '🏚️',
        color: 'bg-yellow-500',
    },
    {
        id: 7,
        entity: 'Establecimiento de Educacion',
        quantity: 65,
        icon: '🏫',
        color: 'bg-yellow-500',
    },
    {
        id: 8,
        entity: 'Antenas de Servicio',
        quantity: 10,
        icon: '📡',
        color: 'bg-yellow-500',
    },
    {
        id: 9,
        entity: 'Municipios',
        quantity: 15,
        icon: '🏛️',
        color: 'bg-yellow-500',
    },
]


interface IncidentReportDashboardProps {
    geoJson: Geojson
}

export default function IncidentReportDashboard({ geoJson }: IncidentReportDashboardProps) {
    const dates = extractDatesAndIds(geoJson).fechasUnicas;
    const [incidentDates, setIncidentDates] = useState<string[]>(dates);
    const lastDate = dates[dates.length - 1];
    const comunas = ['Todo el desastre', ...extractDatesAndComunas(geoJson).provinciasUnicas] as string[];
    const [selectedComuna, setSelectedComuna] = useState("")
    const [selectedDate, setSelectedDate] = useState<string>("")

    const handleComunaChange = (comuna: string) => {
        setSelectedComuna(comuna)

        if (comuna === "Todo el desastre") {
            return setIncidentDates(dates)
        }

        const incidentDates = geoJson.features
            .filter(feature => dates.includes(feature.properties.date) && feature.properties.nom_com === comuna)
            .map(feature => feature.properties.date)
            .sort();

        setIncidentDates(incidentDates);
    }


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
                                        Inactivo
                                    </span>
                                </TableCell>
                                <TableCell>Incendio forestal en zona continental</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className='flex flex-row justify-between'>
                    <div>
                        <CardTitle className="text-2xl font-bold">Informacion del Incidente</CardTitle>
                        <CardDescription>Registro y datos relacionados con el incidente</CardDescription>
                    </div>
                    <div className="flex sm:flex-row flex-col justify-end space-x-4 space-y-1">
                        <Button variant="outline">
                            <Upload className="mr-2 h-4 w-4" />
                            <span className='hidden sm:block'>
                                Importar Información
                            </span>
                        </Button>
                        <Button variant="destructive">
                            <AlertTriangle className="mr-2 h-4 w-4" />
                            <span className='hidden sm:block'>
                                Finalizar Incidente
                            </span>

                        </Button>
                        <Button className="bg-blue-600 text-white hover:bg-blue-700">
                            <Bell className="mr-2 h-4 w-4" />
                            <span className='hidden sm:block'>
                                Alerta
                            </span>

                        </Button>
                    </div>
                </CardHeader>

                <CardContent>
                    <Tabs defaultValue="image" className="space-y-4">
                        <div className='flex justify-between'>
                            <div className='flex gap-2'>
                                <Select value={selectedComuna} onValueChange={handleComunaChange}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Seleccionar comuna" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {comunas.map((comuna) => (
                                            <SelectItem key={comuna} value={comuna}>
                                                {comuna}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <Select value={selectedDate} onValueChange={setSelectedDate}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Seleccionar Fecha" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {incidentDates.map((date) => (
                                            <SelectItem key={date} value={date}>
                                                {date}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <TabsList>
                                <TabsTrigger value="zone">Infraestructura</TabsTrigger>
                                <TabsTrigger value="people">Demografia</TabsTrigger>
                                <TabsTrigger value="image">Imagenes</TabsTrigger>
                            </TabsList>
                        </div>
                        <TabsContent value="zone" className="space-y-4 ">


                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {InfrastructureData.map((item) => (
                                    <Card key={item.id} className="flex items-center p-4 space-x-4">
                                        <div className={`text-2xl ${item.color} rounded-full p-2`}>{item.icon}</div>
                                        <div>
                                            <h3 className="font-semibold">{item.entity}</h3>
                                            <p className="text-lg">{item.quantity}</p>
                                        </div>
                                    </Card>
                                ))}
                            </div>


                        </TabsContent>
                        <TabsContent value="image" className="space-y-4">
                            <Card>
                                <CardContent className="p-3 flex flex-wrap gap-2">
                                    <img
                                        src="/imgs/3.jpeg"
                                        alt="Última imagen del incidente"
                                        className="w-66 h-96  object-cover rounded-lg"
                                    />
                                    <img
                                        src="/imgs/3.jpeg"
                                        alt="Última imagen del incidente"
                                        className="w-66 h-96  object-cover rounded-lg"
                                    />
                                    <img
                                        src="/imgs/3.jpeg"
                                        alt="Última imagen del incidente"
                                        className="w-66 h-96  object-cover rounded-lg"
                                    />
                                </CardContent>
                            </Card>
                        </TabsContent>
                        <TabsContent value="people" className="space-y-4">
                            <div className='flex justify-center'>
                                <div className="p-2 rounded-lg  ">
                                    <BarChartToMap />
                                </div>
                                <div className=" p-2  rounded-lg ">
                                    <BarChartToMap />
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                </CardContent>

            </Card>
        </div>
    )
}
