"use client"

import { useState } from "react"
import { ArrowLeft, Play, CheckCircle, Clock, Users, MessageSquare, BookOpen, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Lesson {
  id: string
  title: string
  duration: string
  completed: boolean
  type: "video" | "reading" | "quiz"
}

interface Section {
  id: string
  title: string
  lessons: Lesson[]
  progress: number
}

interface CourseDetailProps {
  course: {
    id: string
    title: string
    instructor: string
    duration: string
    students: number
    rating: number
    description: string
    thumbnail: string
  }
  onBack: () => void
}

const mockSections: Section[] = [
  {
    id: "1",
    title: "Sección 1 - Introducción",
    progress: 100,
    lessons: [
      { id: "1-1", title: "Introducción", duration: "3 MIN", completed: true, type: "video" },
      { id: "1-2", title: "¿Cómo funcionará el curso?", duration: "4 MIN", completed: true, type: "video" },
      { id: "1-3", title: "¿Cómo realizar preguntas?", duration: "2 MIN", completed: true, type: "video" },
      { id: "1-4", title: "Instalaciones recomendadas", duration: "6 MIN", completed: true, type: "video" },
      { id: "1-5", title: "Tutorial oficial de React Router", duration: "2 MIN", completed: true, type: "reading" },
    ],
  },
  {
    id: "2",
    title: "Sección 2 - React Router - Librería vs Framework",
    progress: 25,
    lessons: [
      { id: "2-1", title: "Introducción a React Router", duration: "5 MIN", completed: true, type: "video" },
      { id: "2-2", title: "Instalación y configuración", duration: "8 MIN", completed: false, type: "video" },
      { id: "2-3", title: "Rutas básicas", duration: "12 MIN", completed: false, type: "video" },
      { id: "2-4", title: "Navegación programática", duration: "7 MIN", completed: false, type: "video" },
    ],
  },
  {
    id: "3",
    title: "Sección 3 - Hooks Avanzados",
    progress: 0,
    lessons: [
      { id: "3-1", title: "useParams Hook", duration: "6 MIN", completed: false, type: "video" },
      { id: "3-2", title: "useNavigate Hook", duration: "4 MIN", completed: false, type: "video" },
      { id: "3-3", title: "useLocation Hook", duration: "5 MIN", completed: false, type: "video" },
    ],
  },
]

const mockComments = [
  {
    id: "1",
    user: "Ana Campos",
    avatar: "/placeholder.svg?height=32&width=32",
    message: "Excelente explicación sobre React Router. Me ayudó mucho a entender los conceptos.",
    time: "2 horas",
  },
  {
    id: "2",
    user: "Carlos Mora",
    avatar: "/placeholder.svg?height=32&width=32",
    message: "¿Podrían agregar más ejemplos prácticos en la siguiente sección?",
    time: "4 horas",
  },
  {
    id: "3",
    user: "Diego Chen",
    avatar: "/placeholder.svg?height=32&width=32",
    message: "El ritmo del curso es perfecto para principiantes.",
    time: "1 día",
  },
]

export function CourseDetailView({ course, onBack }: CourseDetailProps) {
  const [currentLesson, setCurrentLesson] = useState<string>("1-1")
  const [activeSection, setActiveSection] = useState<string>("1")

  const overallProgress = Math.round(
    mockSections.reduce((acc, section) => acc + section.progress, 0) / mockSections.length,
  )

  const getCurrentLesson = () => {
    for (const section of mockSections) {
      const lesson = section.lessons.find((l) => l.id === currentLesson)
      if (lesson) return lesson
    }
    return mockSections[0].lessons[0]
  }

  const currentLessonData = getCurrentLesson()

  return (
    <div className="flex h-screen bg-background">
      {/* Left Sidebar - Course Navigation */}
      <div className="w-80 border-r bg-card">
        <div className="p-4 border-b">
          <Button variant="ghost" size="sm" onClick={onBack} className="mb-3">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al panel de control
          </Button>
          <h2 className="font-bold text-lg mb-2">{course.title}</h2>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>{overallProgress}% completado</span>
              <span className="text-muted-foreground">{overallProgress}/100</span>
            </div>
            <Progress value={overallProgress} className="h-2" />
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-4 space-y-4">
            {mockSections.map((section) => (
              <div key={section.id} className="space-y-2">
                <Button
                  variant="ghost"
                  className="w-full justify-between p-2 h-auto"
                  onClick={() => setActiveSection(activeSection === section.id ? "" : section.id)}
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle
                      className={`h-4 w-4 ${section.progress === 100 ? "text-green-500" : "text-muted-foreground"}`}
                    />
                    <span className="font-medium text-left">{section.title}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {section.lessons.length}/{section.lessons.filter((l) => l.completed).length}
                  </span>
                </Button>

                {activeSection === section.id && (
                  <div className="ml-6 space-y-1">
                    {section.lessons.map((lesson) => (
                      <Button
                        key={lesson.id}
                        variant={currentLesson === lesson.id ? "secondary" : "ghost"}
                        size="sm"
                        className="w-full justify-start text-left h-auto p-2"
                        onClick={() => setCurrentLesson(lesson.id)}
                      >
                        <div className="flex items-center gap-2 w-full">
                          <CheckCircle
                            className={`h-3 w-3 ${lesson.completed ? "text-green-500" : "text-muted-foreground"}`}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium truncate">{lesson.title}</div>
                            <div className="text-xs text-muted-foreground flex items-center gap-1">
                              {lesson.type === "video" && <Play className="h-3 w-3" />}
                              {lesson.type === "reading" && <BookOpen className="h-3 w-3" />}
                              {lesson.duration}
                            </div>
                          </div>
                        </div>
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="p-4 border-t">
          <Button className="w-full">COMPLETAR Y CONTINUAR</Button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Video/Content Area */}
        <div className="flex-1 bg-black relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white">
              <Play className="h-16 w-16 mx-auto mb-4 opacity-80" />
              <h3 className="text-xl font-semibold mb-2">{currentLessonData.title}</h3>
              <p className="text-sm opacity-80">Duración: {currentLessonData.duration}</p>
            </div>
          </div>
        </div>

        {/* Content Description */}
        <div className="p-6 border-t">
          <div className="max-w-4xl">
            <h1 className="text-2xl font-bold mb-4">{currentLessonData.title}</h1>
            <div className="prose prose-sm max-w-none">
              <p className="text-muted-foreground mb-4">
                En esta lección aprenderás los conceptos fundamentales de React Router y cómo implementar navegación
                declarativa en tus aplicaciones React. Cubriremos desde la instalación básica hasta patrones avanzados
                de routing.
              </p>
              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Lo que aprenderás:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Configuración inicial de React Router</li>
                  <li>Creación de rutas básicas y anidadas</li>
                  <li>Navegación programática vs declarativa</li>
                  <li>Manejo de parámetros de URL</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar - Course Info & Chat */}
      <div className="w-80 border-l bg-card">
        <div className="p-4 border-b">
          <h3 className="font-semibold mb-3">Información del Curso</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg?height=32&width=32" />
                <AvatarFallback>IN</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{course.instructor}</p>
                <p className="text-xs text-muted-foreground">Instructor</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{course.duration}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>{course.students}</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-500" />
                <span>{course.rating}</span>
              </div>
              <div className="flex items-center gap-1">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
                <span>{mockSections.reduce((acc, s) => acc + s.lessons.length, 0)} lecciones</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border-b">
          <h4 className="font-semibold mb-3">Etiquetas</h4>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">React</Badge>
            <Badge variant="secondary">JavaScript</Badge>
            <Badge variant="secondary">Frontend</Badge>
            <Badge variant="secondary">SPA</Badge>
            <Badge variant="secondary">Routing</Badge>
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          <div className="p-4 border-b">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Comentarios
            </h4>
          </div>

          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {mockComments.map((comment) => (
                <div key={comment.id} className="space-y-2">
                  <div className="flex items-start gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={comment.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {comment.user
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium">{comment.user}</span>
                        <span className="text-xs text-muted-foreground">{comment.time}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{comment.message}</p>
                    </div>
                  </div>
                  <Separator />
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}
