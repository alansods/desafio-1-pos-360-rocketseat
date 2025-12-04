import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../lib/api'
import { Link, CreateLinkSchema } from '../types/link'

export function useLinks() {
  const queryClient = useQueryClient()

  const { data: links, isLoading, refetch } = useQuery<Link[]>({
    queryKey: ['links'],
    queryFn: async () => {
      console.log('[HOOK] Buscando links da API...')
      const response = await api.get('/links')
      console.log('[HOOK] Links recebidos:', response.data.length, 'links')
      return response.data
    },
    refetchOnWindowFocus: true,
  })

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
    },
  })

  const exportCsv = async () => {
    try {
      const response = await api.get('/links/export/csv')
      
      // O backend agora retorna { url: "..." }
      if (response.data?.url) {
        window.open(response.data.url, '_blank')
      } else {
        console.error('URL de exportação não encontrada')
      }
    } catch (error: any) {
      console.error('CSV Export Error:', error);
      throw error;
    }
  }

  return {
    links,
    isLoading,
    createLink,
    deleteLink,
    exportCsv,
    refetch
  }
}
