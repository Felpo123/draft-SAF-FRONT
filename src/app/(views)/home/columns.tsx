'use client'

import { Incident } from '@/lib/data'
import { ColumnDef } from '@tanstack/react-table'

export const columns: ColumnDef<Incident>[] = [
  {
    accessorKey: 'nombre',
    header: 'Nombre',
  },
  {
    accessorKey: 'estado',
    header: 'Estado',
  },
  {
    accessorKey: 'origen',
    header: 'Origen',
  },
  {
    accessorKey: 'region',
    header: 'Región',
  },
  {
    accessorKey: 'provincia',
    header: 'Provincia',
  },
  {
    accessorKey: 'comuna',
    header: 'Comuna',
  },
  {
    accessorKey: 'ciudad',
    header: 'Ciudad',
  },
  {
    accessorKey: 'ultima_actualizacion',
    header: 'Última Actualización',
  },
]
