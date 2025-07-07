import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
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
import { Eye, Pencil, Trash2, Loader2 } from 'lucide-react'
import toast from "react-hot-toast";
import { Athlete } from '@/types/athlete';
import DeleteAthleteDialog from './DeleteAthleteDialog'
interface AthletesTableProps {
  data: Athlete[]
  isDeleting: boolean
  deleteAthlete: (id: number) => Promise<void>
}

export function AthletesTable({ data, isDeleting, deleteAthlete }: AthletesTableProps) {
  const navigate = useNavigate()
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [deletingId, setDeletingId] = useState<number | null>(null)


  const handleDeleteAthlete = async (id: number) => {
    try {
      setDeletingId(id);
      await deleteAthlete(id);
      toast.success('Atleta eliminado correctamente');
    } catch (error) {
      toast.error('Error al eliminar el atleta');
      console.error('Error deleting athlete:', error);
    } finally {
      setDeletingId(null);
    }
  };


  const columns: ColumnDef<Athlete>[] = [
    {
      accessorKey: "name",
      header: "Nombre",
      cell: ({ row }) => {
        const athlete = row.original
        return (
          <Link to={`/athletes/${athlete.id}`} className="hover:underline font-medium">
            {athlete.firstName} {athlete.lastName}
          </Link>
        )
      },
    },
    {
      accessorKey: "category",
      header: "Categoría",
      cell: ({ row }) => {
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
            {row.original.category}
          </span>
        )
      },
    },
    {
      accessorKey: "dateOfBirth",
      header: "Edad",
      cell: ({ row }) => {
        const birthDate = new Date(row.original.dateOfBirth);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        
        return `${age} años`;
      },
    },
    {
      accessorKey: "gender",
      header: "Género",
      cell: ({ row }) => row.original.gender === 'male' ? 'Masculino' : 'Femenino',
    },
    {
      accessorKey: "phone",
      header: "Teléfono",
    },
    {
      id: "actions",
      header: () => <div className="text-right">Acciones</div>,
      cell: ({ row }) => {
        const athlete = row.original
        
        return (
          <div className="flex justify-end gap-1">
            <Button 
              variant="outline" 
              size="icon" 
              className='text-green-500'
              asChild
              disabled={!!deletingId}
            >
              <Link to={`/athletes/${athlete.id}`}>
                <Eye className="h-4 w-4" />
                <span className="sr-only">Ver detalles</span>
              </Link>
            </Button>
            <Button 
              variant="outline" 
              size="icon"
              className='text-blue-500' 
              onClick={() => navigate(`/athletes/${athlete.id}/edit`)}
              disabled={!!deletingId}
            >
              <Pencil className="h-4 w-4" />
              <span className="sr-only">Editar</span>
            </Button>

            <DeleteAthleteDialog athleteId={athlete.id} handleDeleteAthlete={handleDeleteAthlete}/>
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
          placeholder="Buscar atletas..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
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
                  No se encontraron atletas.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredRowModel().rows.length} atleta(s) encontrado(s)
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
