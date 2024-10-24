'use client';

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  ClipboardList,
  Edit3,
  FileText,
  LayoutDashboardIcon,
  X,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Incident } from '@/lib/data';
import jsPDF from 'jspdf';
import UploadButton from '@/components/UploadButton';
import React from 'react';
import { Input } from '@/components/ui/input';
import { Feature, IncidentProperties } from '@/lib/mapUtils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import 'jspdf-autotable';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const router = useRouter();
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [stateFilter, setStateFilter] = React.useState<string | null>(null);

  //add action column

  const generatePDF = (
    incidentData: IncidentProperties,
    imageUrl: '/imgs/logo.png'
  ) => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    // Fuente personalizada y colores
    doc.setFont('helvetica', 'bold');
    const primaryColor: [number, number, number] = [63, 81, 181];
    const secondaryColor: [number, number, number] = [33, 150, 243];
    const textColor: [number, number, number] = [40, 40, 40];

    // Encabezado del documento
    doc.setTextColor(...primaryColor);
    doc.setFontSize(22);
    doc.text('Incident Report', 105, 20, undefined, null);

    doc.setFontSize(14);
    doc.setTextColor(...secondaryColor);
    doc.text('Geospatial Monitoring System', 105, 30, undefined, null);

    // Espacio debajo del encabezado
    doc.setDrawColor(...primaryColor);
    doc.setLineWidth(1);
    doc.line(15, 35, 195, 35);

    // Información del incidente
    doc.setTextColor(...textColor);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Incident Name: ${incidentData.nom_com}`, 15, 45);
    doc.text(`Region: ${incidentData.nom_pro}`, 15, 55);
    doc.text(`Date: ${incidentData.date}`, 15, 65);

    // Incluir imagen (si es necesario)
    if (imageUrl) {
      doc.addImage(imageUrl, 'JPEG', 140, 45, 50, 50);
    }

    // Sección de Detalles del Incidente
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Incident Details', 15, 80);

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Description: ${incidentData.date}`, 15, 90, {
      maxWidth: 180,
    });
    doc.text(`Type: ${incidentData.cu_evento}`, 15, 100);
    doc.text(`Status: ${incidentData.estado}`, 15, 110);

    // Tabla de información adicional
    const tableData = [
      ['Parameter', 'Value'],
      ['Incident ID', incidentData.id],
      ['Last Update', incidentData.date],
      ['Cause', incidentData.superf],
      ['Location', incidentData.id],
    ];

    // doc.autoTable({
    //   startY: 120,
    //   head: [['Field', 'Details']],
    //   body: tableData,
    //   theme: 'grid',
    //   headStyles: {
    //     fillColor: primaryColor,
    //     textColor: [255, 255, 255],
    //     fontSize: 12,
    //   },
    //   bodyStyles: {
    //     fontSize: 10,
    //   },
    // });

    // Pie de página
    const pageHeight = doc.internal.pageSize.height;
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text(
      'Report generated automatically by the Geospatial Monitoring System',
      105,
      pageHeight - 10,
      undefined,
      null
    );

    // Guardar el PDF
    doc.save(`Incident_Report_${incidentData.id}.pdf`);
  };

  if (!columns.find((column) => column.id === 'actions')) {
    columns.push({
      id: 'actions',
      header: () => <div className="text-center">Acciones</div>,
      cell: ({ row }) => {
        const incident = row.original as Feature;
        const state = incident.properties.estado === 'Activo';

        return (
          <div className="flex items-center justify-between space-x-2">
            {/* Icono para Editar */}
            <Button
              aria-label="Edit"
              className="p-2 hover:bg-gray-200 rounded"
              variant="outline"
              onClick={() => {
                router.push(
                  `/incidente?action=edit&incident=${incident.properties.id}`
                );
              }}
            >
              <Edit3 size={20} />
            </Button>
            {/* Icono para Ver Dashboard */}
            <Button
              aria-label={state ? 'View Dashboard' : 'View Report'}
              className="p-2 hover:bg-gray-200 rounded"
              variant="outline"
              onClick={() => {
                const page = state ? '/maplibre' : '/reporte';
                router.push(
                  `${page}?idEvent=${incident.properties.id_evento}&name=${incident.properties.nom_event}`
                );
              }}
            >
              {state ? (
                <LayoutDashboardIcon size={20} />
              ) : (
                <ClipboardList size={20} />
              )}
            </Button>
            {/* Icono para Cargar */}
            <UploadButton />
            {/* Icono para Descargar Reporte */}
            <Button
              aria-label="Download Report"
              className="p-2 hover:bg-gray-200 rounded"
              variant="outline"
              onClick={() => generatePDF(incident.properties, '/imgs/logo.png')}
            >
              <FileText size={20} />
            </Button>
          </div>
        );
      },
    });
  }

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
      pagination: {
        pageSize: 6,
      },
    },
    state: {
      columnFilters,
    },
  });

  const handleStateFilterChange = (value: string) => {
    if (value === '') {
      setStateFilter(null);
      table.getColumn('properties_estado')?.setFilterValue(undefined);
    } else {
      setStateFilter(value);
      table.getColumn('properties_estado')?.setFilterValue(value);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between py-4 gap-4">
        <div className="flex gap-2">
          <Input
            placeholder="Filtrar por nombre..."
            value={
              (table
                .getColumn('properties_nom_event')
                ?.getFilterValue() as string) ?? ''
            }
            onChange={(event) =>
              table
                .getColumn('properties_nom_event')
                ?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
          <div className="relative">
            <Select
              onValueChange={handleStateFilterChange}
              value={stateFilter || ''}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Activo">Activo</SelectItem>
                <SelectItem value="Apagado">Apagado</SelectItem>
              </SelectContent>
            </Select>
            {stateFilter && (
              <Button
                variant="outline"
                size="icon"
                className="absolute right-0 top-0 h-full "
                onClick={() => handleStateFilterChange('')}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
        <Button
          className="rounded-sm bg-blue-500 text-white hover:bg-blue-600 w-40 flex-initial"
          onClick={() => router.push('/incidente?action=create')}
        >
          <span>Ingresar Incidente</span>
        </Button>
      </div>
      <div className="w-full overflow-hidden rounded-lg border border-gray-200 shadow-md">
        <Table className="w-full">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="bg-gray-50">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, rowIndex) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className={`${
                    rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                  } hover:bg-gray-100 transition-colors`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center"
                >
                  No resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
