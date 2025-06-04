import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

const API_BASE = import.meta.env.VITE_API_BASE_URL

export function RedirectPage() {
  const { shortUrl } = useParams<{ shortUrl: string }>()
  const [originalUrl, setOriginalUrl] = useState<string | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!shortUrl) return
    const url = `${API_BASE}/links/${shortUrl}`
    console.log('DEBUG shortUrl:', shortUrl)
    console.log('DEBUG fetch URL:', url)
    fetch(url)
      .then(res => {
        console.log('DEBUG response status:', res.status)
        if (res.ok) return res.json()
        return Promise.reject(res)
      })
      .then(data => {
        console.log('DEBUG response data:', data)
        setOriginalUrl(data.url)
        setTimeout(() => {
          window.location.href = data.url
        }, 2000)
      })
      .catch(err => {
        console.error('DEBUG fetch error:', err)
        setError(true)
      })
  }, [shortUrl])

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-200">
        <div className="bg-white border-2 border-blue-400 rounded-lg p-12 flex flex-col items-center w-full max-w-md mx-auto">
          <div className="mb-6 mt-2">
            <img src="/logo.png" alt="Logo" width={56} height={56} />
          </div>
          <h1 className="text-2xl font-bold text-center mb-2">Link não encontrado</h1>
          <p className="text-gray-500 text-center text-base mb-2">O link solicitado não existe ou expirou.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-200">
      <div className="bg-white border-2 border-blue-400 rounded-lg p-12 flex flex-col items-center w-full max-w-md mx-auto">
        <div className="mb-6 mt-2">
          <img src="/logo.png" alt="Logo" width={56} height={56} />
        </div>
        <h1 className="text-2xl font-bold text-center mb-2">Redirecionando...</h1>
        <p className="text-gray-500 text-center text-base mb-2">O link será aberto automaticamente em alguns instantes.</p>
        {originalUrl && (
          <p className="text-center text-base mt-2">
            Não foi redirecionado?{' '}
            <a href={originalUrl} className="text-blue-700 underline">Acesse aqui</a>
          </p>
        )}
      </div>
    </div>
  )
} 