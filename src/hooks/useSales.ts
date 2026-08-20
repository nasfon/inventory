import { useMutation, useQueryClient } from '@tanstack/react-query'
import * as salesService from '../services/sales'
import type { CreateSaleInput } from '../types/sales'

export function useCreateSale() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateSaleInput) => salesService.createSale(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: ['customers'] })
    },
  })
}