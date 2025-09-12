"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { MagicCard } from "@/components/magicui/magic-card"
import { Loader2, Shield } from "lucide-react"
import { authManager, LoginCredentials } from "@/lib/auth"

export default function LoginPage() {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: "",
    password: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  useEffect(() => {
    // Redirect if already authenticated
    if (authManager.isAuthenticated()) {
      router.push("/protected/dashboard")
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      await authManager.login(credentials)
      router.push("/protected/dashboard")
    } catch (error) {
      setError("Email ou mot de passe invalide. Veuillez réessayer.")
      console.error("Login error:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof LoginCredentials) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCredentials(prev => ({
      ...prev,
      [field]: e.target.value,
    }))
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <MagicCard className="w-full max-w-md">
        <div className="p-8">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-4">
              <Shield className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold">
              Super Admin
            </h1>
            <p className="text-muted-foreground mt-2">
              Connectez-vous pour accéder au panneau d'administration
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">
                Adresse email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@exemple.com"
                value={credentials.email}
                onChange={handleInputChange("email")}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">
                Mot de passe
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Entrez votre mot de passe"
                value={credentials.password}
                onChange={handleInputChange("password")}
                required
                disabled={loading}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? "Connexion en cours..." : "Se connecter"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-muted-foreground">
              Panneau d'administration sécurisé
            </p>
          </div>
        </div>
      </MagicCard>
    </div>
  )
}