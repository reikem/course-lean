"use client"
import { Home, BookOpen, User, BarChart3, Settings, Star, Clock, TrendingUp, X, Bookmark, PlusCircle, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { useRouter, usePathname } from "next/navigation"

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

const navigation = [
  { name: "Inicio", href: "/inicio", icon: Home },
  { name: "Mis Cursos", href: "/cursos", icon: BookOpen },
  { name: "Perfil", href: "/perfil", icon: User },
  { name: "Estadísticas", href: "/estadisticas", icon: BarChart3 },
]

const quickAccess = [
  { name: "Cursos Favoritos", href: "/favoritos", icon: Star },
  { name: "Continuar Viendo", href: "/continuar-viendo", icon: Clock },
  { name: "Cursos Guardados", href: "/guardados", icon: Bookmark },
  { name: "Tendencias", href: "/inicio?filter=trending", icon: TrendingUp },
]

const createOptions = [
  { name: "Crear Curso", href: "/crear-curso", icon: PlusCircle },
  { name: "Subir Curso (CSV)", href: "/subir-curso", icon: Upload },
]

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const router = useRouter()
  const pathname = usePathname()

  const handleNavigation = (href: string) => {
    router.push(href)
    onClose()
  }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={onClose} />}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed left-0 top-16 z-50 h-[calc(100vh-4rem)] w-64 transform border-r bg-background transition-transform duration-200 ease-in-out md:relative md:top-0 md:h-[calc(100vh-4rem)] md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-full flex-col">
          {/* Mobile close button */}
          <div className="flex items-center justify-between p-4 md:hidden">
            <h2 className="text-lg font-semibold">Menú</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          <ScrollArea className="flex-1 px-4">
            <div className="space-y-2 py-4">
              <div className="px-3 py-2">
                <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Navegación</h2>
                <div className="space-y-1">
                  {navigation.map((item) => (
                    <Button
                      key={item.name}
                      variant={pathname === item.href ? "secondary" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => handleNavigation(item.href)}
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {item.name}
                    </Button>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="px-3 py-2">
                <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Acceso Rápido</h2>
                <div className="space-y-1">
                  {quickAccess.map((item) => (
                    <Button 
                      key={item.name} 
                      variant={pathname === item.href ? "secondary" : "ghost"} 
                      className="w-full justify-start"
                      onClick={() => handleNavigation(item.href)}
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {item.name}
                    </Button>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="px-3 py-2">
                <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Crear Contenido</h2>
                <div className="space-y-1">
                  {createOptions.map((item) => (
                    <Button 
                      key={item.name} 
                      variant={pathname === item.href ? "secondary" : "ghost"} 
                      className="w-full justify-start"
                      onClick={() => handleNavigation(item.href)}
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {item.name}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </ScrollArea>

          <div className="border-t p-4">
            <Button 
              variant={pathname === "/configuracion" ? "secondary" : "ghost"} 
              className="w-full justify-start"
              onClick={() => handleNavigation("/configuracion")}
            >
              <Settings className="mr-2 h-4 w-4" />
              Configuración
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
