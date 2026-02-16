"use client"

import { useState } from "react"
import { Camera, Edit, Mail, MapPin, Calendar, Award, BookOpen, Clock, Star, CheckCircle, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { MainNav } from "@/components/main-nav"
import { Sidebar } from "@/components/sidebar"

const userProfile = {
  name: "María González",
  email: "maria.gonzalez@empresa.com",
  role: "Desarrolladora Frontend",
  department: "Tecnología",
  location: "Madrid, España",
  joinDate: "Enero 2023",
  avatar: "/placeholder.svg?height=120&width=120",
  bio: "Desarrolladora frontend apasionada por crear experiencias de usuario excepcionales. Especializada en React y tecnologías modernas de desarrollo web.",
}

const achievements = [
  {
    id: "1",
    title: "Completador de Cursos",
    description: "Completó 5 cursos en un mes",
    icon: "🏆",
    date: "Diciembre 2024",
  },
  {
    id: "2",
    title: "Estudiante Dedicado",
    description: "100 horas de estudio completadas",
    icon: "📚",
    date: "Noviembre 2024",
  },
  {
    id: "3",
    title: "Experto en React",
    description: "Completó la ruta de React",
    icon: "⚛️",
    date: "Octubre 2024",
  },
]

const recentActivity = [
  {
    id: "1",
    type: "course_completed",
    title: "Completó Python para Ciencia de Datos",
    date: "Hace 2 días",
    icon: CheckCircle,
  },
  {
    id: "2",
    type: "lesson_completed",
    title: "Terminó la lección: Hooks Avanzados en React",
    date: "Hace 3 días",
    icon: BookOpen,
  },
  {
    id: "3",
    type: "course_started",
    title: "Comenzó Desarrollo Web Full Stack",
    date: "Hace 1 semana",
    icon: Play,
  },
]

const skills = [
  { name: "React", level: 90 },
  { name: "JavaScript", level: 85 },
  { name: "TypeScript", level: 75 },
  { name: "Python", level: 70 },
  { name: "CSS/SCSS", level: 80 },
  { name: "Node.js", level: 65 },
]

export default function PerfilPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editedProfile, setEditedProfile] = useState(userProfile)

  const handleSave = () => {
    // Aquí iría la lógica para guardar los cambios
    setIsEditing(false)
  }

  return (
    <div className="min-h-screen bg-background">
      <MainNav onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main className="flex-1 p-6">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Mi Perfil</h1>
              <p className="text-muted-foreground">Gestiona tu información personal y revisa tu progreso</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Profile Card */}
              <div className="lg:col-span-1">
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center">
                      <div className="relative inline-block mb-4">
                        <Avatar className="h-24 w-24">
                          <AvatarImage src={userProfile.avatar || "/placeholder.svg"} alt={userProfile.name} />
                          <AvatarFallback className="text-2xl">
                            {userProfile.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <Button
                          size="icon"
                          variant="secondary"
                          className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full"
                        >
                          <Camera className="h-4 w-4" />
                        </Button>
                      </div>

                      <h2 className="text-xl font-semibold mb-1">{userProfile.name}</h2>
                      <p className="text-muted-foreground mb-2">{userProfile.role}</p>
                      <Badge variant="secondary" className="mb-4">
                        {userProfile.department}
                      </Badge>

                      <div className="space-y-2 text-sm text-muted-foreground">
                        <div className="flex items-center justify-center gap-2">
                          <Mail className="h-4 w-4" />
                          <span>{userProfile.email}</span>
                        </div>
                        <div className="flex items-center justify-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span>{userProfile.location}</span>
                        </div>
                        <div className="flex items-center justify-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>Miembro desde {userProfile.joinDate}</span>
                        </div>
                      </div>

                      <Button variant="outline" className="w-full mt-4" onClick={() => setIsEditing(!isEditing)}>
                        <Edit className="h-4 w-4 mr-2" />
                        {isEditing ? "Cancelar" : "Editar Perfil"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Stats */}
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="text-lg">Estadísticas Rápidas</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-blue-600" />
                        <span className="text-sm">Cursos Completados</span>
                      </div>
                      <span className="font-semibold">12</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-green-600" />
                        <span className="text-sm">Horas de Estudio</span>
                      </div>
                      <span className="font-semibold">156h</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Award className="h-4 w-4 text-yellow-600" />
                        <span className="text-sm">Certificados</span>
                      </div>
                      <span className="font-semibold">8</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-purple-600" />
                        <span className="text-sm">Puntuación Media</span>
                      </div>
                      <span className="font-semibold">4.8</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Main Content */}
              <div className="lg:col-span-2">
                <Tabs defaultValue="overview" className="space-y-6">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="overview">Resumen</TabsTrigger>
                    <TabsTrigger value="skills">Habilidades</TabsTrigger>
                    <TabsTrigger value="achievements">Logros</TabsTrigger>
                    <TabsTrigger value="settings">Configuración</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-6">
                    {/* Bio */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Acerca de mí</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {isEditing ? (
                          <Textarea
                            value={editedProfile.bio}
                            onChange={(e) => setEditedProfile({ ...editedProfile, bio: e.target.value })}
                            className="min-h-[100px]"
                          />
                        ) : (
                          <p className="text-muted-foreground">{userProfile.bio}</p>
                        )}
                      </CardContent>
                    </Card>

                    {/* Recent Activity */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Actividad Reciente</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {recentActivity.map((activity) => (
                            <div key={activity.id} className="flex items-center gap-3">
                              <div className="p-2 bg-muted rounded-lg">
                                <activity.icon className="h-4 w-4" />
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-medium">{activity.title}</p>
                                <p className="text-xs text-muted-foreground">{activity.date}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="skills" className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Habilidades Técnicas</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {skills.map((skill) => (
                            <div key={skill.name} className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">{skill.name}</span>
                                <span className="text-sm text-muted-foreground">{skill.level}%</span>
                              </div>
                              <Progress value={skill.level} className="h-2" />
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="achievements" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {achievements.map((achievement) => (
                        <Card key={achievement.id}>
                          <CardContent className="p-6">
                            <div className="flex items-start gap-4">
                              <div className="text-3xl">{achievement.icon}</div>
                              <div className="flex-1">
                                <h3 className="font-semibold mb-1">{achievement.title}</h3>
                                <p className="text-sm text-muted-foreground mb-2">{achievement.description}</p>
                                <p className="text-xs text-muted-foreground">{achievement.date}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="settings" className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Información Personal</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="name">Nombre completo</Label>
                            <Input
                              id="name"
                              value={isEditing ? editedProfile.name : userProfile.name}
                              onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
                              disabled={!isEditing}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                              id="email"
                              value={isEditing ? editedProfile.email : userProfile.email}
                              onChange={(e) => setEditedProfile({ ...editedProfile, email: e.target.value })}
                              disabled={!isEditing}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="role">Cargo</Label>
                            <Input
                              id="role"
                              value={isEditing ? editedProfile.role : userProfile.role}
                              onChange={(e) => setEditedProfile({ ...editedProfile, role: e.target.value })}
                              disabled={!isEditing}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="location">Ubicación</Label>
                            <Input
                              id="location"
                              value={isEditing ? editedProfile.location : userProfile.location}
                              onChange={(e) => setEditedProfile({ ...editedProfile, location: e.target.value })}
                              disabled={!isEditing}
                            />
                          </div>
                        </div>

                        {isEditing && (
                          <div className="flex gap-2 pt-4">
                            <Button onClick={handleSave}>Guardar Cambios</Button>
                            <Button variant="outline" onClick={() => setIsEditing(false)}>
                              Cancelar
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
