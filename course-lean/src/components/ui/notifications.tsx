"use client"

import { useState, useEffect, useCallback } from "react"
import { Bell, Check, CheckCheck, Trash2, BookOpen, Award, MessageSquare, Users, Settings, X, Clock, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import useSWR, { mutate } from "swr"

interface Notification {
  id: string
  type: "course" | "achievement" | "comment" | "system" | "user" | "reminder"
  title: string
  message: string
  time: string
  read: boolean
  link?: string
  created_at?: string
  is_read?: boolean
  course_title?: string
  course_slug?: string
}

// Datos de demostración para cuando no hay conexión a la base de datos
const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "course",
    title: "Nuevo curso disponible",
    message: "Se ha publicado el curso 'React Avanzado 2024'",
    time: "Hace 5 minutos",
    read: false,
    link: "/cursos/react-avanzado",
  },
  {
    id: "2",
    type: "achievement",
    title: "Logro desbloqueado",
    message: "Has completado tu primer curso. ¡Felicitaciones!",
    time: "Hace 1 hora",
    read: false,
  },
  {
    id: "3",
    type: "comment",
    title: "Nuevo comentario",
    message: "María García respondió a tu pregunta en 'TypeScript Básico'",
    time: "Hace 2 horas",
    read: false,
    link: "/cursos/typescript-basico",
  },
  {
    id: "4",
    type: "system",
    title: "Actualización del sistema",
    message: "Se han añadido nuevas funcionalidades a la plataforma",
    time: "Hace 1 día",
    read: true,
  },
  {
    id: "5",
    type: "user",
    title: "Nuevo seguidor",
    message: "Carlos López ha comenzado a seguirte",
    time: "Hace 2 días",
    read: true,
  },
  {
    id: "6",
    type: "course",
    title: "Recordatorio",
    message: "No has completado el curso 'Node.js Fundamentals' - ¡Continúa aprendiendo!",
    time: "Hace 3 días",
    read: true,
  },
]

// Función para calcular tiempo relativo
function getRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) return "Hace un momento"
  if (diffInSeconds < 3600) return `Hace ${Math.floor(diffInSeconds / 60)} minutos`
  if (diffInSeconds < 86400) return `Hace ${Math.floor(diffInSeconds / 3600)} horas`
  if (diffInSeconds < 604800) return `Hace ${Math.floor(diffInSeconds / 86400)} días`
  return `Hace ${Math.floor(diffInSeconds / 604800)} semanas`
}

// Fetcher para SWR
const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) throw new Error("Error al cargar notificaciones")
  return res.json()
}

const getNotificationIcon = (type: Notification["type"]) => {
  switch (type) {
    case "course":
      return <BookOpen className="h-4 w-4" />
    case "achievement":
      return <Award className="h-4 w-4" />
    case "comment":
      return <MessageSquare className="h-4 w-4" />
    case "system":
      return <Settings className="h-4 w-4" />
    case "user":
      return <Users className="h-4 w-4" />
    case "reminder":
      return <Clock className="h-4 w-4" />
    default:
      return <Bell className="h-4 w-4" />
  }
}

const getNotificationColor = (type: Notification["type"]) => {
  switch (type) {
    case "course":
      return "bg-blue-500/10 text-blue-500"
    case "achievement":
      return "bg-yellow-500/10 text-yellow-500"
    case "comment":
      return "bg-green-500/10 text-green-500"
    case "system":
      return "bg-purple-500/10 text-purple-500"
    case "user":
      return "bg-pink-500/10 text-pink-500"
    case "reminder":
      return "bg-orange-500/10 text-orange-500"
    default:
      return "bg-muted text-muted-foreground"
  }
}

interface NotificationsProps {
  userId?: string
}

export function Notifications({ userId }: NotificationsProps) {
  const [localNotifications, setLocalNotifications] = useState<Notification[]>(mockNotifications)
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Usar SWR para obtener notificaciones de la API si hay userId
  const { data, error, isValidating } = useSWR(
    userId ? `/api/notifications?userId=${userId}&limit=10` : null,
    fetcher,
    {
      refreshInterval: 30000, // Refrescar cada 30 segundos
      revalidateOnFocus: true,
    }
  )

  // Transformar datos de la API al formato del componente
  const transformApiNotification = useCallback((n: Record<string, unknown>): Notification => ({
    id: n.id as string,
    type: (n.type as string || "system") as Notification["type"],
    title: n.title as string,
    message: n.message as string || "",
    time: n.created_at ? getRelativeTime(n.created_at as string) : "Ahora",
    read: n.is_read as boolean || false,
    link: n.course_slug ? `/cursos/${n.course_slug}` : undefined,
    course_title: n.course_title as string | undefined,
  }), [])

  // Usar datos de la API si están disponibles, sino usar datos locales
  const notifications = data?.notifications 
    ? data.notifications.map(transformApiNotification)
    : localNotifications

  const unreadCount = userId && data 
    ? data.unreadCount 
    : notifications.filter((n) => !n.read).length
    
  const unreadNotifications = notifications.filter((n) => !n.read)
  const readNotifications = notifications.filter((n) => n.read)

  const markAsRead = async (id: string) => {
    if (userId) {
      try {
        await fetch(`/api/notifications/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isRead: true }),
        })
        mutate(`/api/notifications?userId=${userId}&limit=10`)
      } catch (err) {
        console.error("Error marking notification as read:", err)
      }
    } else {
      setLocalNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      )
    }
  }

  const markAllAsRead = async () => {
    setIsLoading(true)
    if (userId) {
      try {
        await fetch("/api/notifications/mark-read", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, markAll: true, isRead: true }),
        })
        mutate(`/api/notifications?userId=${userId}&limit=10`)
      } catch (err) {
        console.error("Error marking all as read:", err)
      }
    } else {
      setLocalNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    }
    setIsLoading(false)
  }

  const deleteNotification = async (id: string) => {
    if (userId) {
      try {
        await fetch(`/api/notifications/${id}`, {
          method: "DELETE",
        })
        mutate(`/api/notifications?userId=${userId}&limit=10`)
      } catch (err) {
        console.error("Error deleting notification:", err)
      }
    } else {
      setLocalNotifications((prev) => prev.filter((n) => n.id !== id))
    }
  }

  const clearAllNotifications = async () => {
    setIsLoading(true)
    if (userId) {
      try {
        await fetch("/api/notifications", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, deleteAll: true }),
        })
        mutate(`/api/notifications?userId=${userId}&limit=10`)
      } catch (err) {
        console.error("Error clearing notifications:", err)
      }
    } else {
      setLocalNotifications([])
    }
    setIsLoading(false)
  }

  const NotificationItem = ({ notification }: { notification: Notification }) => (
    <div
      className={cn(
        "group relative flex items-start gap-3 rounded-lg p-3 transition-colors hover:bg-muted/50",
        !notification.read && "bg-muted/30"
      )}
    >
      <div
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
          getNotificationColor(notification.type)
        )}
      >
        {getNotificationIcon(notification.type)}
      </div>
      <div className="flex-1 space-y-1 overflow-hidden">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-sm font-medium leading-none">
            {notification.title}
          </p>
          {!notification.read && (
            <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />
          )}
        </div>
        <p className="line-clamp-2 text-xs text-muted-foreground">
          {notification.message}
        </p>
        <p className="text-xs text-muted-foreground/70">{notification.time}</p>
      </div>
      <div className="absolute right-2 top-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        {!notification.read && (
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={(e) => {
              e.stopPropagation()
              markAsRead(notification.id)
            }}
            title="Marcar como leída"
          >
            <Check className="h-3 w-3" />
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-destructive hover:text-destructive"
          onClick={(e) => {
            e.stopPropagation()
            deleteNotification(notification.id)
          }}
          title="Eliminar"
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
    </div>
  )

  const EmptyState = ({ message }: { message: string }) => (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
        <Bell className="h-6 w-6 text-muted-foreground" />
      </div>
      <p className="mt-3 text-sm text-muted-foreground">{message}</p>
    </div>
  )

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full p-0 text-xs">
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="end">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold">Notificaciones</h4>
            {unreadCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                {unreadCount} sin leer
              </Badge>
            )}
          </div>
          <div className="flex gap-1">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 text-xs"
                onClick={markAllAsRead}
              >
                <CheckCheck className="mr-1 h-3 w-3" />
                Marcar todas
              </Button>
            )}
            {notifications.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 text-xs text-destructive hover:text-destructive"
                onClick={clearAllNotifications}
              >
                <Trash2 className="mr-1 h-3 w-3" />
                Limpiar
              </Button>
            )}
          </div>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-3 rounded-none border-b bg-transparent p-0">
            <TabsTrigger
              value="all"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              Todas
            </TabsTrigger>
            <TabsTrigger
              value="unread"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              Sin leer
            </TabsTrigger>
            <TabsTrigger
              value="read"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              Leídas
            </TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[400px]">
            <TabsContent value="all" className="m-0">
              {notifications.length > 0 ? (
                <div className="divide-y">
                  {notifications.map((notification) => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState message="No tienes notificaciones" />
              )}
            </TabsContent>

            <TabsContent value="unread" className="m-0">
              {unreadNotifications.length > 0 ? (
                <div className="divide-y">
                  {unreadNotifications.map((notification) => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState message="No tienes notificaciones sin leer" />
              )}
            </TabsContent>

            <TabsContent value="read" className="m-0">
              {readNotifications.length > 0 ? (
                <div className="divide-y">
                  {readNotifications.map((notification) => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState message="No tienes notificaciones leídas" />
              )}
            </TabsContent>
          </ScrollArea>
        </Tabs>

        <Separator />
        <div className="p-2">
          <Button variant="ghost" className="w-full justify-center text-sm" asChild>
            <a href="/notificaciones">Ver todas las notificaciones</a>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
