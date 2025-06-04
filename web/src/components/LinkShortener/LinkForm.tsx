import { useState } from 'react'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'

export function LinkForm({ onSave }: { onSave: (original: string, short: string) => void }) {
  const [original, setOriginal] = useState('')
  const [shortSuffix, setShortSuffix] = useState('')
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!original) {
      setError('O link original é obrigatório')
      return
    }
    setError(null)
    onSave(original, shortSuffix)
    setOriginal('')
    setShortSuffix('')
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
      <div className="flex flex-col gap-1">
        <label className="block text-xs font-semibold mb-1 text-gray-500">LINK ENCURTADO</label>
        <div className="relative w-full">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none select-none">brev.ly/</span>
          <input
            className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-600 focus:outline-none transition-colors text-base pl-[71px]"
            type="text"
            value={shortSuffix}
            onChange={e => setShortSuffix(e.target.value)}
            style={{ minWidth: '0' }}
          />
        </div>
      </div>
      <Button type="submit" variant="primary" className="mt-6 h-12 text-base font-semibold" disabled={!original}>Salvar link</Button>
    </form>
  )
} 