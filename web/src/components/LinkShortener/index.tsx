import { useState, useEffect } from 'react'
import { LinkForm } from './LinkForm'
import { LinkList, Link } from './LinkList'

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export function LinkShortener() {
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/links`)
      .then(res => res.json())
      .then((data: any[]) => {
        setLinks(data.map(link => ({
          id: link.id,
          url: link.url,
          shortUrl: link.shortUrl,
          shortUrlFull: `${API_BASE.replace(/\\?\/links$/, '')}/${link.shortUrl}`,
          createdAt: link.createdAt,
          accessCount: link.accessCount
        })))
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  // Atualização automática da lista de links a cada 5 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      fetch(`${API_BASE}/links`)
        .then(res => res.json())
        .then((data: any[]) => {
          setLinks(data.map(link => ({
            id: link.id,
            url: link.url,
            shortUrl: link.shortUrl,
            shortUrlFull: `${API_BASE.replace(/\\?\/links$/, '')}/${link.shortUrl}`,
            createdAt: link.createdAt,
            accessCount: link.accessCount
          })))
        })
        .catch(() => {})
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  function handleSaveLink(original: string, short: string) {
    fetch(`${API_BASE}/links`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: original, shortUrl: short || undefined })
    })
      .then(res => res.json())
      .then(link => {
        setLinks(prev => [
          {
            id: link.id,
            url: link.url,
            shortUrl: link.shortUrl,
            shortUrlFull: `${API_BASE.replace(/\\?\/links$/, '')}/${link.shortUrl}`,
            createdAt: link.createdAt,
            accessCount: link.accessCount
          },
          ...prev,
        ])
      })
  }

  function handleCopyLink(shortUrlFull: string) {
    if (navigator && navigator.clipboard) {
      navigator.clipboard.writeText(shortUrlFull)
    } else {
      // fallback
      const textarea = document.createElement('textarea')
      textarea.value = shortUrlFull
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
    }
  }

  function handleDeleteLink(id: string) {
    fetch(`${API_BASE}/links/${id}`, { method: 'DELETE' })
      .then(res => {
        if (res.ok) {
          setLinks(prev => prev.filter(link => link.id !== id))
        }
      })
  }

  function handleVisitLink() {
    // Força o refresh imediato dos links após o clique
    fetch(`${API_BASE}/links`)
      .then(res => res.json())
      .then((data: any[]) => {
        setLinks(data.map(link => ({
          id: link.id,
          url: link.url,
          shortUrl: link.shortUrl,
          shortUrlFull: `${API_BASE.replace(/\\?\/links$/, '')}/${link.shortUrl}`,
          createdAt: link.createdAt,
          accessCount: link.accessCount
        })))
      })
      .catch(() => {})
  }

  return (
    <div className="flex flex-col md:flex-row justify-center items-start gap-y-8 md:gap-y-0 md:gap-x-5 w-full mx-auto">
      <div className="w-full md:w-[380px] bg-white rounded-lg p-8">
        <LinkForm onSave={handleSaveLink} />
      </div>
      <div className="w-full md:w-[580px] min-h-[234px] bg-white rounded-lg p-8">
        {loading ? <div>Carregando...</div> : <LinkList links={links} onCopy={handleCopyLink} onDelete={handleDeleteLink} onVisit={handleVisitLink} />}
      </div>
    </div>
  )
} 