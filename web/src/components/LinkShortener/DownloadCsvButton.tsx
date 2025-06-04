import { Button } from '../ui/Button'
import { DownloadSimple, Spinner } from 'phosphor-react'
import { useState } from 'react'

export type CsvLink = {
  url: string
  shortUrl: string
  createdAt: string
  accessCount: number
}

type Props = {
  links: CsvLink[]
  disabled?: boolean
}

function toCsv(links: CsvLink[]): string {
  const header = ['URL Original', 'URL Encurtada', 'Data de Criação', 'Contagem de Acessos']
  const rows = links.map(link => [
    link.url,
    link.shortUrl,
    link.createdAt,
    link.accessCount.toString()
  ])
  return [header, ...rows].map(row => row.map(field => `"${field.replace(/"/g, '""')}"`).join(',')).join('\n')
}

export function DownloadCsvButton({ links, disabled }: Props) {
  const [loading, setLoading] = useState(false)

  function handleDownload() {
    if (!links.length) return
    setLoading(true)
    setTimeout(() => {
      const csv = toCsv(links)
      const blob = new Blob([csv], { type: 'text/csv' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'links.csv'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      setLoading(false)
    }, 300) // Simula um pequeno delay para mostrar o loading
  }
  return (
    <Button
      type="button"
      variant="secondary"
      disabled={disabled || !links.length || loading}
      leftIcon={loading ? <Spinner size={16} weight="bold" className="animate-spin" /> : <DownloadSimple size={12} weight="regular" />}
      className="w-[120px] h-[32px] px-2 text-xs gap-1 whitespace-nowrap"
      onClick={handleDownload}
    >
      Baixar CSV
    </Button>
  )
} 