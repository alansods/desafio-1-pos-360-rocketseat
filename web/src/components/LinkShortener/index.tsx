import { useState } from 'react'
import { LinkForm } from './LinkForm'
import { LinkList, Link } from './LinkList'

export function LinkShortener() {
  const [links, setLinks] = useState<Link[]>([
    {
      original: 'https://www.teste.com',
      short: 'https://brev.ly/abc123',
      visits: 42
    }
  ])

  function handleSaveLink(original: string, short: string) {
    setLinks(prev => [
      { original, short, visits: 0 },
      ...prev,
    ])
  }

  function handleCopyLink(short: string) {
    if (navigator && navigator.clipboard) {
      navigator.clipboard.writeText(short)
    } else {
      // fallback
      const textarea = document.createElement('textarea')
      textarea.value = short
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
    }
  }

  function handleDeleteLink(short: string) {
    setLinks(prev => prev.filter(link => link.short !== short))
  }

  return (
    <div className="flex flex-col md:flex-row justify-center items-start gap-y-8 md:gap-y-0 md:gap-x-5 w-full mx-auto">
      <div className="w-full md:w-[380px] bg-white rounded-lg p-8">
        <LinkForm onSave={handleSaveLink} />
      </div>
      <div className="w-full md:w-[580px] min-h-[234px] bg-white rounded-lg p-8">
        <LinkList links={links} onCopy={handleCopyLink} onDelete={handleDeleteLink} />
      </div>
    </div>
  )
} 