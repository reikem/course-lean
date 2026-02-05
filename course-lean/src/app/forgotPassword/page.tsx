"use client"

import type React from "react"

import { useState } from "react"
import { Mail, ArrowLeft, CheckCircle, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<"email" | "code" | "success">("email")
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [code, setCode] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [countdown, setCountdown] = useState(0)

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors({})

    if (!email) {
      setErrors({ email: "El email es requerido" })
      setIsLoading(false)
      return
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setErrors({ email: "Email inválido" })
      setIsLoading(false)
      return
    }

    try {
      // Simular envío de código
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Aquí iría la lógica real para enviar el código
      console.log("Sending reset code to:", email)

      setStep("code")
      setCountdown(60)

      // Iniciar countdown
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } catch (error) {
      setErrors({ general: "Error al enviar el código. Inténtalo de nuevo." })
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors({})

    const newErrors: Record<string, string> = {}

    if (!code || code.length !== 6) {
      newErrors.code = "El código debe tener 6 dígitos"
    }
    if (!newPassword || newPassword.length < 8) {
      newErrors.newPassword = "La contraseña debe tener al menos 8 caracteres"
    }
    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setIsLoading(false)
      return
    }

    try {
      // Simular verificación y cambio de contraseña
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Aquí iría la lógica real para verificar el código y cambiar la contraseña
      console.log("Verifying code and changing password:", { email, code, newPassword })

      setStep("success")
    } catch (error) {
      setErrors({ general: "Código inválido o expirado. Inténtalo de nuevo." })
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendCode = async () => {
    if (countdown > 0) return

    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      console.log("Resending code to:", email)

      setCountdown(60)
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } catch (error) {
      setErrors({ general: "Error al reenviar el código" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al login
          </Link>
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <span className="text-lg font-bold">L</span>
            </div>
            <span className="text-2xl font-bold">LearnHub</span>
          </div>
        </div>

        <Card>
          <CardHeader className="text-center">
            {step === "email" && (
              <>
                <CardTitle className="text-2xl">¿Olvidaste tu contraseña?</CardTitle>
                <CardDescription>
                  Ingresa tu email y te enviaremos un código para restablecer tu contraseña
                </CardDescription>
              </>
            )}
            {step === "code" && (
              <>
                <CardTitle className="text-2xl">Verificar código</CardTitle>
                <CardDescription>
                  Hemos enviado un código de 6 dígitos a <strong>{email}</strong>
                </CardDescription>
              </>
            )}
            {step === "success" && (
              <>
                <div className="mx-auto w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle className="text-2xl">¡Contraseña actualizada!</CardTitle>
                <CardDescription>Tu contraseña ha sido cambiada exitosamente</CardDescription>
              </>
            )}
          </CardHeader>
          <CardContent>
            {step === "email" && (
              <form onSubmit={handleSendCode} className="space-y-4">
                {errors.general && (
                  <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                    <p className="text-sm text-destructive">{errors.general}</p>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="tu@empresa.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`pl-10 ${errors.email ? "border-destructive" : ""}`}
                      disabled={isLoading}
                    />
                  </div>
                  {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Enviando código...
                    </div>
                  ) : (
                    "Enviar código"
                  )}
                </Button>
              </form>
            )}

            {step === "code" && (
              <form onSubmit={handleVerifyCode} className="space-y-4">
                {errors.general && (
                  <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                    <p className="text-sm text-destructive">{errors.general}</p>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="code">Código de verificación</Label>
                  <Input
                    id="code"
                    type="text"
                    placeholder="123456"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    className={`text-center text-lg tracking-widest ${errors.code ? "border-destructive" : ""}`}
                    disabled={isLoading}
                    maxLength={6}
                  />
                  {errors.code && <p className="text-sm text-destructive">{errors.code}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">Nueva contraseña</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className={errors.newPassword ? "border-destructive" : ""}
                    disabled={isLoading}
                  />
                  {errors.newPassword && <p className="text-sm text-destructive">{errors.newPassword}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={errors.confirmPassword ? "border-destructive" : ""}
                    disabled={isLoading}
                  />
                  {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword}</p>}
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Cambiando contraseña...
                    </div>
                  ) : (
                    "Cambiar contraseña"
                  )}
                </Button>

                <div className="text-center">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleResendCode}
                    disabled={countdown > 0 || isLoading}
                    className="text-sm"
                  >
                    {countdown > 0 ? (
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Reenviar en {countdown}s
                      </div>
                    ) : (
                      "Reenviar código"
                    )}
                  </Button>
                </div>
              </form>
            )}

            {step === "success" && (
              <div className="space-y-4">
                <div className="text-center text-sm text-muted-foreground">
                  Ya puedes iniciar sesión con tu nueva contraseña
                </div>
                <Link href="/login">
                  <Button className="w-full">Ir al login</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
