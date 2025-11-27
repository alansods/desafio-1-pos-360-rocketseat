import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { api } from '../lib/api'
import { Copy, Trash2, Download } from 'lucide-react'
import { useState } from 'react'

const createLinkSchema = z.object({
  shortUrl: z.string().min(3, "Code must be at least 3 characters"),
  url: z.string().url("Invalid URL"),
})

type CreateLinkSchema = z.infer<typeof createLinkSchema>

interface Link {
  id: string
  shortUrl: string
  url: string
  accessCount: number
  createdAt: string
}

export function Home() {
  const queryClient = useQueryClient()
  const [copying, setCopying] = useState<string | null>(null)
  const [deleteConfirmationId, setDeleteConfirmationId] = useState<string | null>(null)

  const { data: links, isLoading } = useQuery<Link[]>({
    queryKey: ['links'],
    queryFn: async () => {
      const response = await api.get('/links')
      return response.data
    },
  })

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<CreateLinkSchema>({
    resolver: zodResolver(createLinkSchema),
  })

  const createLink = useMutation({
    mutationFn: async (data: CreateLinkSchema) => {
      await api.post('/links', data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['links'] })
      reset()
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || 'Failed to create link')
    }
  })

  const deleteLink = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/links/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['links'] })
    },
  })



  const exportCsv = async () => {
    try {
      const response = await api.get('/links/export/csv', {
        responseType: 'text',
        headers: {
          'Accept': 'text/csv',
        }
      })

      // Backend already adds BOM, so just create data URL
      const dataUrl = 'data:text/csv;charset=utf-8,' + encodeURIComponent(response.data);
      
      // Create download link
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = 'links.csv';
      link.style.display = 'none';
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error: any) {
      console.error('CSV Export Error:', error);
      alert(error.message || 'Failed to export CSV')
    }
  }

  const handleCopy = (url: string, id: string) => {
    navigator.clipboard.writeText(url)
    setCopying(id)
    setTimeout(() => setCopying(null), 2000)
  }

  const frontendUrl = import.meta.env.VITE_FRONTEND_URL || window.location.origin

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10 px-4 md:px-20">
      <div className="w-full max-w-6xl space-y-8">
        {/* Header */}
        <div className="flex items-center gap-2">
          <div className="bg-primary rounded-full p-1">
             <img src="/logo.svg" alt="brev.ly" className="h-8 w-8" onError={(e) => e.currentTarget.style.display = 'none'} /> 
             {/* Fallback if no logo image */}
             <div className="h-6 w-6 border-2 border-white rounded-full flex items-center justify-center">
                <div className="h-3 w-3 bg-white rounded-full"></div>
             </div>
          </div>
          <span className="text-2xl font-bold text-primary">brev.ly</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Left Column: Create Link */}
            <div className="bg-white rounded-xl p-8 shadow-sm space-y-6">
                <h2 className="text-2xl font-bold text-gray-600">Novo link</h2>
                
                <form onSubmit={handleSubmit((data) => createLink.mutate(data))} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase">Link Original</label>
                        <input 
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          placeholder="www.exemplo.com.br" 
                          {...register('url')} 
                        />
                        {errors.url && <span className="text-xs text-destructive">{errors.url.message}</span>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase">Link Encurtado</label>
                        <div className="relative flex items-center">
                            <span className="absolute left-3 text-sm text-gray-400 font-medium select-none">brev.ly/</span>
                            <input 
                              className="flex h-10 w-full rounded-md border border-input bg-background pl-[3.9rem] pr-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              placeholder="exemplo" 
                              {...register('shortUrl')} 
                            />
                        </div>
                        {errors.shortUrl && <span className="text-xs text-destructive">{errors.shortUrl.message}</span>}
                    </div>

                    <button 
                      type="submit" 
                      disabled={isSubmitting} 
                      className="inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 w-full h-12 text-base"
                    >
                        {isSubmitting ? 'Salvando...' : 'Salvar link'}
                    </button>
                </form>
            </div>

            {/* Right Column: My Links */}
            <div className="bg-white rounded-xl p-8 shadow-sm space-y-6">
                <div className="flex justify-between items-center border-b border-gray-200 pb-4">
                    <h2 className="text-2xl font-bold text-gray-600">Meus links</h2>
                    <button 
                        type="button"
                        onClick={exportCsv} 
                        disabled={!links || links.length === 0}
                        className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground hover:bg-secondary/80 h-9 px-3 gap-2 text-gray-500 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Download className="w-4 h-4" />
                        Baixar CSV
                    </button>
                </div>

                {isLoading ? (
                    <div className="text-center py-10 text-gray-400">Carregando...</div>
                ) : (
                    <div className="space-y-4">
                        {links?.map((link) => {
                            const shortUrl = `${frontendUrl}/${link.shortUrl}`
                            return (
                                <div key={link.id} className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0">
                                    <div className="flex-1 min-w-0 space-y-1">
                                        <a href={shortUrl} target="_blank" rel="noreferrer" className="font-bold text-primary hover:underline truncate block">
                                            brev.ly/{link.shortUrl}
                                        </a>
                                        <div className="flex items-center gap-2 text-sm text-gray-400">
                                            <p className="truncate max-w-[250px]" title={link.url}>
                                                {link.url}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between gap-4 text-sm text-gray-400">
                                        <div className="flex gap-2 items-center">
                                            <span className="whitespace-nowrap mr-2">{link.accessCount} acessos</span>

                                            <button 
                                              type="button"
                                              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground hover:bg-secondary/80 h-8 w-8 bg-gray-200 text-gray-600 hover:bg-gray-300" 
                                              onClick={() => handleCopy(shortUrl, link.id)}
                                            >
                                                {copying === link.id ? <span className="text-xs font-bold text-green-600">✓</span> : <Copy className="w-4 h-4" />}
                                            </button>
                                            
                                            <button 
                                              type="button"
                                              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground hover:bg-secondary/80 h-8 w-8 bg-gray-200 text-gray-600 hover:bg-gray-300"
                                              onClick={() => setDeleteConfirmationId(link.id)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                        {links?.length === 0 && (
                            <div className="text-center py-10 text-gray-400">
                                Nenhum link criado ainda.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmationId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="space-y-2">
              <h3 className="text-lg font-bold">Tem certeza?</h3>
              <p className="text-sm text-gray-500">
                Esta ação não pode ser desfeita. Isso excluirá permanentemente o link.
              </p>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteConfirmationId(null)}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  deleteLink.mutate(deleteConfirmationId)
                  setDeleteConfirmationId(null)
                }}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-destructive text-destructive-foreground hover:bg-destructive/90 h-10 px-4 py-2"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
