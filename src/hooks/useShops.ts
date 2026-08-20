import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as shopsService from '../services/shops'
import type { CreateShopInput, ShopListParams, UpdateShopInput } from '../types/shops'

export function useShops() {
  return useQuery({
    queryKey: ['shops'],
    queryFn: () => shopsService.listActiveShops(),
    staleTime: Infinity,
  })
}

export function useShopsList(params: ShopListParams) {
  return useQuery({
    queryKey: ['shops', 'list', params],
    queryFn: () => shopsService.listShops(params),
    placeholderData: keepPreviousData,
  })
}

export function useCreateShop() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateShopInput) => shopsService.createShop(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shops'] })
    },
  })
}

export function useUpdateShop() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: UpdateShopInput) => shopsService.updateShop(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shops'] })
    },
  })
}