import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api } from '../lib/api'
import { CreateLinkSchema, PaginatedLinksResponse, Pagination } from '../types/link'

const DEFAULT_PAGE_SIZE = 5

export function useLinks(initialPage: number = 1, initialPageSize: number = DEFAULT_PAGE_SIZE) {
  const queryClient = useQueryClient()
  const [isExporting, setIsExporting] = useState(false)
  const [page, setPage] = useState(initialPage)
  const [pageSize, setPageSize] = useState(initialPageSize)

  const { data, isLoading, error, isError, isFetching } = useQuery<PaginatedLinksResponse>({
    queryKey: ['links', page, pageSize],
    queryFn: async () => {
      const response = await api.get('/links', {
        params: { page, pageSize }
      })
      return response.data
    },
    refetchOnWindowFocus: true,
    staleTime: 0,
    gcTime: 0,
    retry: 2,
    placeholderData: (previousData) => previousData,
  })

  const links = data?.data ?? []
  const pagination: Pagination = data?.pagination ?? {
    page: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    total: 0,
    totalPages: 1
  }

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
      setPage(1) // Voltar para primeira página para ver o novo link
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

  const goToPage = (newPage: number) => {
    const maxPage = pagination.totalPages || 1
    if (newPage >= 1 && newPage <= maxPage) {
      setPage(newPage)
    }
  }

  const changePageSize = (newPageSize: number) => {
    setPageSize(newPageSize)
    setPage(1) // Voltar para primeira página ao mudar o tamanho
  }

  // Voltar para primeira página quando criar ou deletar
  const resetToFirstPage = () => {
    setPage(1)
  }

  return {
    links,
    isLoading,
    isFetching,
    createLink,
    deleteLink,
    exportCsv,
    isExporting,
    pagination,
    currentPage: page,
    pageSize,
    goToPage,
    changePageSize,
    resetToFirstPage,
  }
}
