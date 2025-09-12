"use client"

import { useState, useEffect } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { DataTable } from "@/components/ui/data-table"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal, Plus } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { apiClient } from "@/lib/api"

type Station = {
  id: string
  name: string
  location: string
  companyId: string
  createdAt: string
}

const columns: ColumnDef<Station>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nom
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "location",
    header: "Localisation",
  },
  {
    accessorKey: "companyId",
    header: "ID Entreprise",
  },
  {
    accessorKey: "createdAt",
    header: "Créé le",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"))
      return date.toLocaleDateString()
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const station = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(station.id)}
            >
              Copier l'ID de la station
            </DropdownMenuItem>
            <DropdownMenuItem>Modifier la station</DropdownMenuItem>
            <DropdownMenuItem className="text-red-600">
              Supprimer la station
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export default function StationsPage() {
  const [stations, setStations] = useState<Station[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [newStation, setNewStation] = useState({ 
    name: "", 
    location: "", 
    companyId: "" 
  })

  useEffect(() => {
    fetchStations()
  }, [])

  const fetchStations = async () => {
    try {
      const data = await apiClient.getStations()
      setStations(data)
    } catch (error) {
      console.error("Error fetching stations:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateStation = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await apiClient.createStation(newStation)
      await fetchStations()
      setNewStation({ name: "", location: "", companyId: "" })
      setDialogOpen(false)
    } catch (error) {
      console.error("Error creating station:", error)
    }
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/protected/dashboard">
                  Dashboard
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Stations</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Stations</h1>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Ajouter une station
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Créer une nouvelle station</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreateStation} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nom</Label>
                    <Input
                      id="name"
                      value={newStation.name}
                      onChange={(e) =>
                        setNewStation({ ...newStation, name: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Localisation</Label>
                    <Input
                      id="location"
                      value={newStation.location}
                      onChange={(e) =>
                        setNewStation({ ...newStation, location: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="companyId">ID Entreprise</Label>
                    <Input
                      id="companyId"
                      value={newStation.companyId}
                      onChange={(e) =>
                        setNewStation({ ...newStation, companyId: e.target.value })
                      }
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Créer la station
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          
          {loading ? (
            <div className="text-center">Chargement...</div>
          ) : (
            <DataTable
              columns={columns}
              data={stations}
              searchKey="name"
              searchPlaceholder="Rechercher des stations..."
            />
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}