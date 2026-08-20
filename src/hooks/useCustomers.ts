import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as customersService from '../services/customers'
import type {
  CreateCustomerInput,
  CustomerListParams,
  UpdateCustomerInput,
} from '../types/customers'

export function useCustomersList(params: CustomerListParams) {
  return useQuery({
    queryKey: ['customers', 'list', params],
    queryFn: () => customersService.listCustomers(params),
    placeholderData: keepPreviousData,
  })
}

export function useCreateCustomer() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateCustomerInput) => customersService.createCustomer(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] })
    },
  })
}

export function useUpdateCustomer() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: UpdateCustomerInput) => customersService.updateCustomer(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] })
    },
  })
}

export function useDeleteCustomer() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (customerId: string) => customersService.softDeleteCustomer(customerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] })
    },
  })
}