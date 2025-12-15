import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api } from '../lib/api'
import { Link, CreateLinkSchema } from '../types/link'

export function useLinks() {
  const queryClient = useQueryClient()
  const [isExporting, setIsExporting] = useState(false)

  const { data: links, isLoading, error, isError } = useQuery<Link[]>({
    queryKey: ['links'],
    queryFn: async () => {
      const response = await api.get('/links')
      return response.data
    },
    refetchOnWindowFocus: true,
    refetchInterval: 10000, // Refetch a cada 10 segundos
    staleTime: 0, // Dados sempre considerados velhos
    gcTime: 0, // Não manter cache
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
      const response = await api.get('/links/export/csv', {
        responseType: 'blob', // Recebe como Blob para poder detectar o tipo
      })

      // Verificar Content-Type do header
      const contentType = response.headers['content-type'] || ''
      
      if (contentType.includes('text/csv')) {
        // Modo local: resposta é CSV direto
        const csvContent = await response.data.text()
        
        // Criar Blob e fazer download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', 'links.csv')
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
        
        toast.success('CSV exportado com sucesso!', { id: loadingToast })
      } else {
        // Modo produção: resposta é JSON com URL do Cloudflare R2
        // Converter Blob para texto e parsear JSON
        const jsonText = await response.data.text()
        const jsonData = JSON.parse(jsonText)
        
        if (jsonData?.url) {
          window.open(jsonData.url, '_blank')
          toast.success('CSV exportado com sucesso!', { id: loadingToast })
        } else {
          toast.error('URL de exportação não encontrada', { id: loadingToast })
        }
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
  }
}
