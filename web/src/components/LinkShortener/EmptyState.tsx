import { LinkSimple } from 'phosphor-react'

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <LinkSimple size={28} weight="regular" className="mb-6 text-gray-400" style={{ width: 28, height: 24 }} />
      <span className="text-gray-500 text-lg font-medium">AINDA NÃO EXISTEM LINKS CADASTRADOS</span>
    </div>
  )
} 