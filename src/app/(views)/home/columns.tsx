'use client'

import { Incident } from '@/lib/data'
import { Feature, Geojson } from '@/lib/mapUtils'
import { ColumnDef } from '@tanstack/react-table'

export const columns: ColumnDef<Feature>[] = [
  {
    accessorKey: 'properties.nom_event',
    header: 'Nombre',
  },
  {
    accessorKey: 'properties.estado',
    header: 'Estado',
    cell: (row) => {
      const value = row.getValue() as string;
      if (value === 'Activo') {
        return <span className="px-2 py-1 rounded-full bg-green-100 text-green-800">{value}</span>;
      } else {
        return <span className="px-2 py-1 rounded-full bg-yellow-100 text-yellow-800">{value}</span>;
      }
    }
  },
  {
    accessorKey: 'properties.tipo_event',
    header: 'Origen',
  },
  {
    accessorKey: 'properties.nom_reg',
    header: 'Región',
  },
  {
    accessorKey: 'properties.nom_pro',
    header: 'Provincia',
  },
  {
    accessorKey: 'properties.nom_com',
    header: 'Comuna',
  },
  {
    accessorKey: 'properties.superf',
    header: 'Última Actualización',
  },
]
