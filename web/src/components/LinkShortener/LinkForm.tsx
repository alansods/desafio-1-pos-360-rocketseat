import { useState } from 'react'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'

export function LinkForm({ onSave }: { onSave: (original: string, short: string) => void }) {
  const [original, setOriginal] = useState('')
  const [short, setShort] = useState('')
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!original) {
      setError('O link original é obrigatório')
      return
    }
    setError(null)
    onSave(original, short)
    setOriginal('')
    setShort('')
  }

  return (
    <form className="flex flex-col gap-5 w-full" onSubmit={handleSubmit}>
      <h2 className="text-2xl text-gray-600 font-bold mb-4">Novo link</h2>
      <Input
        label="LINK ORIGINAL"
        placeholder="www.exemplo.com.br"
        value={original}
        onChange={e => setOriginal(e.target.value)}
        error={error || undefined}
      />
      <Input
        label="LINK ENCURTADO"
        placeholder="brev.ly/"
        value={short}
        onChange={e => setShort(e.target.value)}
      />
      <Button type="submit" variant="primary" className="mt-6 h-12 text-base font-semibold" disabled={!original}>Salvar link</Button>
    </form>
  )
} 