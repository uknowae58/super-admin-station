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

export default function Page() {
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
              <BreadcrumbItem>
                <BreadcrumbPage>Tableau de bord</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Tableau de bord Super Admin</h1>
            <p className="text-muted-foreground">Gérez les entreprises et les stations</p>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="bg-card border rounded-xl p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Entreprises</h3>
                  <p className="text-sm text-muted-foreground">Gérer les entreprises</p>
                  <a 
                    href="/protected/companies" 
                    className="text-sm text-blue-500 hover:underline"
                  >
                    Voir tout →
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-card border rounded-xl p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Stations</h3>
                  <p className="text-sm text-muted-foreground">Gérer les stations</p>
                  <a 
                    href="/protected/stations" 
                    className="text-sm text-green-500 hover:underline"
                  >
                    Voir tout →
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-muted/50 min-h-[200px] flex-1 rounded-xl p-8 flex items-center justify-center">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Bienvenue sur Super Admin Station</h3>
              <p className="text-muted-foreground">Sélectionnez une option dans la barre latérale ou les cartes ci-dessus pour commencer.</p>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
