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
      const response = await api.get('/links/export/csv', {
        responseType: 'text',
        headers: {
          'Accept': 'text/csv',
        }
      })

      const dataUrl = 'data:text/csv;charset=utf-8,' + encodeURIComponent(response.data);
      
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = 'links.csv';
      link.style.display = 'none';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
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
