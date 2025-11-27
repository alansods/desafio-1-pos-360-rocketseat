import { useEffect } from 'react'
import { useParams } from 'react-router-dom'

export function Redirect() {
  const { code } = useParams()

  useEffect(() => {
    if (code) {
      // Redirect to the backend endpoint which handles the actual redirection and analytics
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3333'
      window.location.href = `${backendUrl}/${code}`
    }
  }, [code])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <p className="text-xl text-muted-foreground animate-pulse">Redirecting...</p>
    </div>
  )
}
