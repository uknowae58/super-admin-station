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
import { ArrowUpDown, MoreHorizontal, Plus, Copy } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { apiClient } from "@/lib/api"
import { toast } from "sonner"

type Company = {
  id: string
  name: string
  email: string
  createdAt: string
}

const columns: ColumnDef<Company>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => {
      const id = row.getValue("id") as string
      
      const copyToClipboard = async () => {
        try {
          await navigator.clipboard.writeText(id)
          toast.success("ID copié dans le presse-papiers !", {
            duration: 2000,
          })
        } catch (error) {
          toast.error("Erreur lors de la copie de l'ID", {
            duration: 2000,
          })
        }
      }

      return (
        <div className="flex items-center gap-2">
          <div className="font-mono text-sm max-w-[200px] truncate" title={id}>
            {id}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={copyToClipboard}
            className="h-6 w-6 p-0 opacity-60 hover:opacity-100"
            title="Copier l'ID"
          >
            <Copy className="h-3 w-3" />
          </Button>
        </div>
      )
    },
  },
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
    accessorKey: "email",
    header: "E-mail",
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
      const company = row.original

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
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(company.id)
                  toast.success("ID de l'Compagnie copié !", {
                    duration: 2000,
                  })
                } catch (error) {
                  toast.error("Erreur lors de la copie de l'ID", {
                    duration: 2000,
                  })
                }
              }}
            >
              Copier l'ID de l'Compagnie
            </DropdownMenuItem>
            <DropdownMenuItem>Modifier l'Compagnie</DropdownMenuItem>
            <DropdownMenuItem className="text-red-600">
              Supprimer l'Compagnie
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export default function CompagniesPage() {
  const [Compagnies, setCompagnies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [newCompany, setNewCompany] = useState({ name: "", email: "" })

  useEffect(() => {
    fetchCompagnies()
  }, [])

  const fetchCompagnies = async () => {
    try {
      const data = await apiClient.getCompanies()
      setCompagnies(data)
    } catch (error) {
      console.error("Error fetching Compagnies:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateCompany = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await apiClient.createCompany(newCompany)
      await fetchCompagnies()
      setNewCompany({ name: "", email: "" })
      setDialogOpen(false)
    } catch (error) {
      console.error("Error creating company:", error)
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
                  Tableau de bord
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Compagnies</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Compagnies</h1>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Ajouter une Compagnie
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Créer une nouvelle Compagnie</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreateCompany} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nom</Label>
                    <Input
                      id="name"
                      value={newCompany.name}
                      onChange={(e) =>
                        setNewCompany({ ...newCompany, name: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">E-mail</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newCompany.email}
                      onChange={(e) =>
                        setNewCompany({ ...newCompany, email: e.target.value })
                      }
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Créer l'Compagnie
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
              data={Compagnies}
              searchKey="name"
              searchPlaceholder="Rechercher des Compagnies..."
            />
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}