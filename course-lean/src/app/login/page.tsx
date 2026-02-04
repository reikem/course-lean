"use client"

import type React from "react"
import { useState, useCallback } from "react"
import { Eye, EyeOff, Mail, Lock, ArrowRight, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const router = useRouter()

  // Optimización con useCallback para evitar re-renderizados innecesarios en componentes hijos
  const handleInputChange = useCallback((field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => {
      if (prev[field] || prev.general) {
        const newErrors = { ...prev }
        delete newErrors[field]
        delete newErrors.general
        return newErrors
      }
      return prev
    })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors({})

    // Validación básica optimizada
    const newErrors: Record<string, string> = {}
    if (!formData.email) newErrors.email = "El email es requerido"
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email inválido"
    
    if (!formData.password) newErrors.password = "La contraseña es requerida"

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setIsLoading(false)
      return
    }

    try {
      // Simulación de API (Reemplazar con tu lógica de Auth)
      await new Promise((resolve) => setTimeout(resolve, 1500))
      console.log("Login exitoso:", formData)
      router.push("/")
    } catch (error) {
      setErrors({ general: "Credenciales incorrectas. Inténtalo de nuevo." })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex w-full">
      {/* Sección Izquierda: Branding (Oculta en móvil) */}
      <section 
        className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-700 via-indigo-600 to-emerald-500 relative flex-col justify-center items-center p-12 text-white"
        aria-hidden="true"
      >
        <div className="max-w-md text-center z-10">
          <h1 className="text-5xl font-extrabold tracking-tight mb-6">LearnHub</h1>
          <p className="text-lg opacity-90 mb-10">
            La plataforma líder en capacitación empresarial. Potencia el talento de tu equipo hoy mismo.
          </p>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
              <span className="text-3xl font-bold block">150+</span>
              <span className="text-sm opacity-80 uppercase tracking-wider">Cursos</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
              <span className="text-3xl font-bold block">2.5k+</span>
              <span className="text-sm opacity-80 uppercase tracking-wider">Alumnos</span>
            </div>
          </div>
        </div>
        {/* Decoración abstracta */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
      </section>

      {/* Sección Derecha: Formulario */}
      <section className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-background">
        <div className="w-full max-w-[400px] space-y-8">
          <header className="text-center">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground mb-4">
              <span className="text-xl font-bold">L</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight">Bienvenido de nuevo</h2>
            <p className="text-muted-foreground mt-2">Ingresa tus datos para acceder</p>
          </header>

          <Card className="border-none shadow-none lg:border lg:shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="sr-only">Formulario de Inicio de Sesión</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Alerta de Error General */}
                {errors.general && (
                  <div 
                    role="alert" 
                    className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 text-sm text-destructive animate-in fade-in duration-300"
                  >
                    {errors.general}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Correo Electrónico</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="nombre@empresa.com"
                      autoComplete="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className={`pl-10 ${errors.email ? "border-destructive ring-destructive" : ""}`}
                      disabled={isLoading}
                      required
                    />
                  </div>
                  {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="password">Contraseña</Label>
                    <Link href="/forgot-password" size="sm" className="text-xs text-primary hover:underline">
                      ¿Olvidaste tu contraseña?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      autoComplete="current-password"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      className={`pl-10 pr-10 ${errors.password ? "border-destructive ring-destructive" : ""}`}
                      disabled={isLoading}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                      aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  {errors.password && <p className="text-xs text-destructive mt-1">{errors.password}</p>}
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={formData.rememberMe}
                    onCheckedChange={(checked) => handleInputChange("rememberMe", !!checked)}
                    disabled={isLoading}
                  />
                  <Label htmlFor="remember" className="text-sm font-medium leading-none cursor-pointer">
                    Mantener sesión iniciada
                  </Label>
                </div>

                <Button type="submit" className="w-full h-11" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Autenticando...
                    </>
                  ) : (
                    <>
                      Entrar
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>

              <footer className="mt-8 text-center border-t pt-6">
                <p className="text-sm text-muted-foreground">
                  ¿Nuevo en la empresa?{" "}
                  <Link href="/register" className="text-primary font-semibold hover:underline">
                    Solicita acceso
                  </Link>
                </p>
              </footer>
            </CardContent>
          </Card>
          
          <p className="text-center text-[10px] text-muted-foreground uppercase tracking-widest">
            © 2026 LearnHub Enterprise Solutions
          </p>
        </div>
      </section>
    </main>
  )
}