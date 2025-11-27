import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createLinkSchema, CreateLinkSchema } from '../../../types/link'
import { useLinks } from '../../../hooks/useLinks'
import { Button } from '../../ui/Button'
import { Input } from '../../ui/Input'

export function CreateLinkForm() {
  const { createLink } = useLinks()
  
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<CreateLinkSchema>({
    resolver: zodResolver(createLinkSchema),
  })

  const onSubmit = (data: CreateLinkSchema) => {
    createLink.mutate(data, {
      onSuccess: () => reset(),
      onError: (error: any) => {
        alert(error.response?.data?.message || 'Failed to create link')
      }
    })
  }

  return (
    <div className="bg-white rounded-xl p-8 shadow-sm space-y-6">
      <h2 className="text-2xl font-bold text-gray-600">Novo link</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Input 
          label="Link Original"
          placeholder="www.exemplo.com.br"
          error={errors.url?.message}
          {...register('url')}
        />

        <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase">Link Encurtado</label>
            <div className="relative flex items-center">
                <span className="absolute left-3 text-sm text-gray-400 font-medium select-none">brev.ly/</span>
                <input 
                  className="flex h-10 w-full rounded-md border border-input bg-background pl-[3.9rem] pr-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="exemplo" 
                  {...register('code')} 
                />
            </div>
            {errors.code && <span className="text-xs text-destructive">{errors.code.message}</span>}
        </div>

        <Button 
          type="submit" 
          disabled={isSubmitting} 
          className="w-full h-12 text-base"
        >
          {isSubmitting ? 'Salvando...' : 'Salvar link'}
        </Button>
      </form>
    </div>
  )
}
