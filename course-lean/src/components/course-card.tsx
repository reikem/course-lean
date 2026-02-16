"use client"

import { useState } from "react"
import { Clock, Users, Star, BookOpen, Heart, Play } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Course {
  id: string
  title: string
  instructor: string
  duration: string
  students: number
  rating: number
  thumbnail: string
  tags: string[]
  description: string
  level: "Principiante" | "Intermedio" | "Avanzado"
  progress?: number
}

interface CourseCardProps {
  course: Course
  onCourseClick: (course: Course) => void
}

export function CourseCard({ course, onCourseClick }: CourseCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)

  return (
    <Card
      className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onCourseClick(course)}
    >
      <div className="relative overflow-hidden rounded-t-lg">
        <img
          src={course.thumbnail || "/placeholder.svg"}
          alt={course.title}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <Play className="h-12 w-12 text-white" />
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 bg-white/80 hover:bg-white"
          onClick={(e) => {
            e.stopPropagation()
            setIsFavorite(!isFavorite)
          }}
        >
          <Heart className={`h-4 w-4 ${isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"}`} />
        </Button>
        {course.progress !== undefined && (
          <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-2">
            Progreso: {course.progress}%
            <div className="w-full bg-white/20 rounded-full h-1 mt-1">
              <div
                className="bg-white h-1 rounded-full transition-all duration-300"
                style={{ width: `${course.progress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      <CardContent className="p-4">
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
              {course.title}
            </h3>
            <div className="flex items-center gap-2 mt-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src="/placeholder.svg?height=24&width=24" />
                <AvatarFallback className="text-xs">
                  {course.instructor
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm text-muted-foreground">{course.instructor}</span>
            </div>
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2">{course.description}</p>

          <div className="flex flex-wrap gap-1">
            {course.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {course.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{course.tags.length - 3}
              </Badge>
            )}
          </div>

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{course.duration}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{course.students}</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{course.rating}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Badge
              variant={
                course.level === "Principiante"
                  ? "default"
                  : course.level === "Intermedio"
                    ? "secondary"
                    : "destructive"
              }
            >
              {course.level}
            </Badge>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <BookOpen className="h-4 w-4" />
              <span>12 lecciones</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
