import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api } from '../lib/api'
import { Link, CreateLinkSchema } from '../types/link'

export function useLinks() {
  const queryClient = useQueryClient()
  const [isExporting, setIsExporting] = useState(false)

  const { data: links, isLoading, refetch, error, isError } = useQuery<Link[]>({
    queryKey: ['links'],
    queryFn: async () => {
      console.log('[HOOK] Buscando links da API...')
      const response = await api.get('/links')
      console.log('[HOOK] Links recebidos:', response.data.length, 'links')
      return response.data
    },
    refetchOnWindowFocus: true,
    retry: 2,
  })

  // Tratamento de erro usando useEffect
  useEffect(() => {
    if (isError && error) {
      toast.error('Erro ao carregar links', {
        description: (error as any).response?.data?.message || 'Tente novamente mais tarde'
      })
    }
  }, [isError, error])

  const createLink = useMutation({
    mutationFn: async (data: CreateLinkSchema) => {
      await api.post('/links', data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['links'] })
    },
  })

  const deleteLink = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/links/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['links'] })
      toast.success('Link deletado com sucesso!')
    },
    onError: (error: any) => {
      toast.error('Erro ao deletar link', {
        description: error.response?.data?.message || 'Tente novamente'
      })
    },
  })

  const exportCsv = async () => {
    setIsExporting(true)
    const loadingToast = toast.loading('Exportando CSV...')

    try {
      const response = await api.get('/links/export/csv')

      // O backend agora retorna { url: "..." }
      if (response.data?.url) {
        window.open(response.data.url, '_blank')
        toast.success('CSV exportado com sucesso!', { id: loadingToast })
      } else {
        toast.error('URL de exportação não encontrada', { id: loadingToast })
      }
    } catch (error: any) {
      toast.error('Erro ao exportar CSV', {
        id: loadingToast,
        description: error.response?.data?.message || 'Tente novamente'
      })
      throw error;
    } finally {
      setIsExporting(false)
    }
  }

  return {
    links,
    isLoading,
    createLink,
    deleteLink,
    exportCsv,
    isExporting,
    refetch
  }
}
