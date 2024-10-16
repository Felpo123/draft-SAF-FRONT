"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit3, FileText, LayoutDashboardIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Incident } from "@/lib/data";
import jsPDF from "jspdf";
import UploadButton from "@/components/UploadButton";
import React from "react";
import { Input } from "@/components/ui/input";

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

  //add action column

  const generatePDF = async (incident: Incident) => {
    const doc = new jsPDF();
    doc.text("Este es un PDF generado en el frontend", 10, 10);
    doc.text(`Nombre: ${incident.nombre}`, 10, 20);
    doc.text(`Estado: ${incident.estado}`, 10, 30);
    doc.text(`Origen: ${incident.origen}`, 10, 40);
    doc.text(`Región: ${incident.region}`, 10, 50);
    doc.text(`Provincia: ${incident.provincia}`, 10, 60);
    doc.text(`Comuna: ${incident.comuna}`, 10, 70);
    doc.text(`Ciudad: ${incident.ciudad}`, 10, 80);
    doc.text(`Última Actualización: ${incident.ultima_actualizacion}`, 10, 90);

    doc.save(`${incident.nombre}.pdf`);
  };

  if (!columns.find((column) => column.id === "actions")) {
    columns.push({
      id: "actions",
      header: () => <div className="text-center">Acciones</div>,
      cell: ({ row }) => {
        const incident = row.original as Incident;
        return (
          <div className="flex items-center justify-between space-x-2">
            {/* Icono para Editar */}
            <Button
              aria-label="Edit"
              className="p-2 hover:bg-gray-200 rounded"
              variant="outline"
              onClick={() => {
                router.push(`/incidente?action=edit&incident=${incident.id}`);
              }}
            >
              <Edit3 size={20} />
            </Button>
            {/* Icono para Ver Dashboard */}
            <Button
              aria-label="View Dashboard"
              className="p-2 hover:bg-gray-200 rounded"
              variant="outline"
              onClick={() => {
                router.push(`/dashboard?incident=${incident.id}`);
              }}
            >
              <LayoutDashboardIcon size={20} />
            </Button>
            {/* Icono para Cargar */}
            <UploadButton />
            {/* Icono para Descargar Reporte */}
            <Button
              aria-label="Download Report"
              className="p-2 hover:bg-gray-200 rounded"
              variant="outline"
              onClick={() => generatePDF(incident)}
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

  return (
    <div>
      <div className="flex items-center justify-between py-4 gap-4">
        <Input
          placeholder="Filter names..."
          value={(table.getColumn("nombre")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("nombre")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />

        <Button
          className="rounded-sm bg-blue-500 text-white hover:bg-blue-600 w-40 flex-initial"
          onClick={() => router.push("/incidente?action=create")}
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
                  data-state={row.getIsSelected() && "selected"}
                  className={`${
                    rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"
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
                  No results.
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
