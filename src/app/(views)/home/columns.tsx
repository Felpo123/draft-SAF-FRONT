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
