import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as salesService from '../services/sales'
import type { CreateSaleInput, SaleListParams } from '../types/sales'

export function useCreateSale() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateSaleInput) => salesService.createSale(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: ['customers'] })
      queryClient.invalidateQueries({ queryKey: ['sales'] })
    },
  })
}

export function useSalesList(params: SaleListParams) {
  return useQuery({
    queryKey: ['sales', 'list', params],
    queryFn: () => salesService.listSales(params),
    placeholderData: keepPreviousData,
  })
}

export function useSaleDetail(saleId: string | null) {
  return useQuery({
    queryKey: ['sales', 'detail', saleId],
    queryFn: () => salesService.getSale(saleId as string),
    enabled: Boolean(saleId),
  })
}