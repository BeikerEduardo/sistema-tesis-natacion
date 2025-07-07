import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  SortingState,
  getSortedRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Eye, Pencil, Trash2, Loader2, Calendar, Clock, Check, X } from 'lucide-react'
import { toast } from 'sonner'
import type { Training, TrainingType } from '@/types/training'

interface TrainingsTableProps {
  data: Training[]
  isDeleting: boolean
  deleteTraining: (id: number) => Promise<void>
}

export function TrainingsTable({ data, isDeleting, deleteTraining }: TrainingsTableProps) {


  /*const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<TrainingType | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
*/
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [deletingId, setDeletingId] = useState<number | null>(null)

  // Función para formatear la fecha
  const formatDate = (dateString: string | Date) => {
    if (!dateString) return 'Sin fecha'
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  // Función para obtener el texto del tipo de entrenamiento
  const getTrainingTypeText = (type: TrainingType) => {
    const types: Record<TrainingType, string> = {
      resistance: 'Resistencia',
      speed: 'Velocidad',
      technique: 'Técnica',
      mixed: 'Mixto',
      other: 'Otro'
    }
    return types[type] || type
  }

  // Función para obtener el estilo del estado
  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { text: string; variant: string }> = {
      'scheduled': { text: 'Programado', variant: 'bg-blue-100 text-blue-800' },
      'in-progress': { text: 'En progreso', variant: 'bg-yellow-100 text-yellow-800' },
      'completed': { text: 'Completado', variant: 'bg-green-100 text-green-800' },
      'cancelled': { text: 'Cancelado', variant: 'bg-red-100 text-red-800' }
    }

    const statusInfo = statusMap[status] || { text: status, variant: 'bg-gray-100 text-gray-800' }
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.variant}`}>
        {status === 'scheduled' && <Calendar className="mr-1 h-3 w-3" />}
        {status === 'in-progress' && <Clock className="mr-1 h-3 w-3" />}
        {status === 'completed' && <Check className="mr-1 h-3 w-3" />}
        {status === 'cancelled' && <X className="mr-1 h-3 w-3" />}
        {statusInfo.text}
      </span>
    )
  }

  const columns: ColumnDef<Training>[] = [
    {
      accessorKey: "date",
      header: "Fecha",
      cell: ({ row }) => {
        const training = row.original
        return (
          <div>
            <div className="font-medium">
              {formatDate(training.date)}
            </div>
            {training.startTime && training.endTime && (
              <div className="text-sm text-muted-foreground">
                {training.startTime} - {training.endTime}
              </div>
            )}
          </div>
        )
      },
    },
    {
      accessorKey: "title",
      header: "Titulo",
      cell: ({ row }) => row.original.title,
    },
    {
      accessorKey: "trainingType",
      header: "Tipo",
      cell: ({ row }) => getTrainingTypeText(row.original.trainingType),
    },
    {
      accessorKey: "athlete",
      header: "Atleta",
      cell: ({ row }) => `${row.original.athlete?.firstName || ''} ${row.original.athlete?.lastName || ''}`,
    },
    {
      accessorKey: "durationMinutes",
      header: "Duración",
      cell: ({ row }) => `${row.original.durationMinutes} min`,
    },
    {
      accessorKey: "status",
      header: "Estado",
      cell: ({ row }) => getStatusBadge(row.original.status || 'scheduled'),
    },
    {
      id: "actions",
      header: () => <div className="text-right">Acciones</div>,
      cell: ({ row }) => {
        const training = row.original

        return (
          <div className="flex justify-end gap-1">
            <Button
              variant="ghost"
              size="icon"
              asChild
              disabled={isDeleting && deletingId === training.id}
            >
              <Link to={`/trainings/${training.id}`}>
                <Eye className="h-4 w-4" />
                <span className="sr-only">Ver detalles</span>
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              asChild
              disabled={isDeleting && deletingId === training.id}
            >
              <Link to={`/trainings/${training.id}/edit`}>
                <Pencil className="h-4 w-4" />
                <span className="sr-only">Editar</span>
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-destructive hover:text-destructive/80 hover:bg-destructive/10"
              disabled={isDeleting}
              onClick={async () => {
                if (window.confirm(`¿Estás seguro de que deseas eliminar el entrenamiento del ${formatDate(training.date)}?`)) {
                  try {
                    const trainingId = String(training.id)
                    if (!trainingId) {
                      toast.error('ID de entrenamiento no válido')
                      return
                    }

                    setDeletingId(training.id)
                    await deleteTraining(training.id)
                    toast.success('Entrenamiento eliminado con éxito')
                  } catch (error) {
                    toast.error(`Error al eliminar el entrenamiento: ${error instanceof Error ? error.message : 'Error desconocido'}`)
                    console.error('Error deleting training:', error)
                  } finally {
                    setDeletingId(null)
                  }
                }
              }}
            >
              {isDeleting && deletingId === training.id ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
              <span className="sr-only">Eliminar</span>
            </Button>
          </div>
        )
      },
    },
  ]

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  })

  return (
    <div>
      <div className="flex items-center py-4">
        <Input
          placeholder="Buscar entrenamientos..."
          value={(table.getColumn("athlete")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("athlete")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <div className="ml-auto flex items-center gap-2">
          <select
            className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={(table.getColumn("trainingType")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("trainingType")?.setFilterValue(
                event.target.value === "" ? undefined : event.target.value
              )
            }
          >
            <option value="">Todos los tipos</option>
            <option value="resistance">Resistencia</option>
            <option value="speed">Velocidad</option>
            <option value="technique">Técnica</option>
            <option value="mixed">Mixto</option>
            <option value="other">Otro</option>
          </select>
          <select
            className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={(table.getColumn("status")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("status")?.setFilterValue(
                event.target.value === "" ? undefined : event.target.value
              )
            }
          >
            <option value="">Todos los estados</option>
            <option value="scheduled">Programado</option>
            <option value="in-progress">En progreso</option>
            <option value="completed">Completado</option>
            <option value="cancelled">Cancelado</option>
          </select>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  {columnFilters.length > 0 ? (
                    <div className="flex flex-col items-center gap-2">
                      <p>No se encontraron entrenamientos que coincidan con los filtros</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setColumnFilters([])}
                      >
                        Limpiar filtros
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-4">
                      <p>No hay entrenamientos registrados</p>
                      <Button asChild>
                        <Link to="/trainings/new">
                          Crear primer entrenamiento
                        </Link>
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredRowModel().rows.length} entrenamiento(s) encontrado(s)
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  )
}
