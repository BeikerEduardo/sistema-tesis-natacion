import { Link, useNavigate } from "react-router-dom"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Home, Users, Calendar, LogOut, UserPlus, PlusCircle, WavesIcon as WavesLadder } from "lucide-react"
import { Button } from "../ui/button"
import { useAuthContext } from "@/context/AuthProvider"
import toast from "react-hot-toast"

const navItems = [
  {
    title: "Inicio",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "Atletas",
    href: "/athletes",
    icon: Users,
  },
  {
    title: "Entrenamientos",
    href: "/trainings",
    icon: Calendar,
  },
]

const MainNav = () => {
  const { user, logout } = useAuthContext()

  const navigate = useNavigate();

  const handleLogout = () => {
    try {
      logout();
      toast.success("Sesión cerrada exitosamente");
      navigate('/login');
    } catch (error) {
      console.log(error)
      toast.error("Error al cerrar sesión");
    }
  }

  return (
    <Sidebar className="border-r border-gray-200/80">
      <SidebarHeader className="bg-gradient-to-b from-gray-50 to-white border-b border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-2.5 shadow-lg">
            <WavesLadder className="h-7 w-7 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-base font-semibold text-gray-900 leading-tight">Sistema de Gestión</h1>
            <h2 className="text-base font-semibold text-gray-900 leading-tight">de Entrenamientos</h2>
          </div>
        </div>
        <div className="bg-gray-100/60 rounded-lg px-3 py-2">
          <p className="text-xs font-medium text-gray-600">
            Plataforma para {user?.role === "coach" ? "Entrenadores" : "Administradores"}
          </p>
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-white">
        <SidebarGroup className="px-4 py-6">
          <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Navegación Principal
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className="group relative h-11 px-3 rounded-lg transition-all duration-200 hover:bg-gray-50 hover:shadow-sm active:scale-[0.98] data-[active=true]:bg-gray-100 data-[active=true]:shadow-sm"
                  >
                    <Link to={item.href} className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-md bg-gray-100 group-hover:bg-gray-200 transition-colors duration-200">
                        <item.icon className="h-4 w-4 text-gray-600 group-hover:text-gray-700" />
                      </div>
                      <span className="font-medium text-gray-700 group-hover:text-gray-900">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="mx-4 border-t border-gray-100"></div>

        <SidebarGroup className="px-4 py-6">
          <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Acciones Rápidas
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/athletes/new">
                    <Button className="w-full">
                        <UserPlus className="h-4 w-4 text-white " />
                      <span className="font-medium">Añadir atleta</span>
                    </Button>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/trainings/new">
                    <Button className="w-full">
                        <PlusCircle className="h-4 w-4 text-white" />
                      <span className="font-medium">Añadir entrenamiento</span>
                    </Button>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="bg-gradient-to-t from-gray-50 to-white border-t border-gray-100 p-4">
        <Button
        onClick={handleLogout}
          variant="outline"
          className="w-full justify-start h-11 border-gray-200 hover:bg-red-50 hover:border-red-200 hover:text-red-700 transition-all duration-200 group bg-transparent"
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-md bg-gray-100 group-hover:bg-red-100 transition-colors duration-200 mr-3">
            <LogOut className="h-4 w-4 text-gray-600 group-hover:text-red-600" />
          </div>
          <span className="font-medium">Cerrar sesión</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}

export default MainNav
