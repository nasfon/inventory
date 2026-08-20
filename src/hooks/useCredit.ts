import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as creditService from '../services/credit'
import type {
  CreditCustomerParams,
  CreditPaymentParams,
  RecordCreditPaymentInput,
} from '../types/credit'

export function useCustomersWithCredit(params: CreditCustomerParams) {
  return useQuery({
    queryKey: ['credit', 'customers', params],
    queryFn: () => creditService.listCustomersWithCredit(params),
    placeholderData: keepPreviousData,
  })
}

export function useCustomerPayments(customerId: string, params: CreditPaymentParams) {
  return useQuery({
    queryKey: ['credit', 'payments', customerId, params],
    queryFn: () => creditService.listCustomerPayments(customerId, params),
    placeholderData: keepPreviousData,
  })
}

export function useCreditSummary(shopId: string) {
  return useQuery({
    queryKey: ['credit', 'summary', shopId],
    queryFn: () => creditService.getCreditSummary(shopId || undefined),
    staleTime: 30_000,
  })
}

export function useRecordCreditPayment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: RecordCreditPaymentInput) => creditService.recordCreditPayment(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['credit'] })
      queryClient.invalidateQueries({ queryKey: ['customers'] })
    },
  })
}