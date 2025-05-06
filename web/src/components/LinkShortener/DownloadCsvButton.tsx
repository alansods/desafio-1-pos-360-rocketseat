import { Button } from '../ui/Button'
import { DownloadSimple } from 'phosphor-react'

type Props = {
  disabled?: boolean
}

export function DownloadCsvButton({ disabled }: Props) {
  return (
    <Button
      type="button"
      variant="secondary"
      disabled={disabled}
      leftIcon={<DownloadSimple size={12} weight="regular" />}
      className="w-[100px] h-[32px] px-2 text-xs gap-1 whitespace-nowrap"
    >
      Baixar CSV
    </Button>
  )
} 