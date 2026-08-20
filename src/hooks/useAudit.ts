import { keepPreviousData, useQuery } from '@tanstack/react-query'
import * as auditService from '../services/audit'
import type { AuditLogListParams } from '../types/audit'

export function useAuditLogs(params: AuditLogListParams) {
  return useQuery({
    queryKey: ['audit-logs', 'list', params],
    queryFn: () => auditService.listAuditLogs(params),
    placeholderData: keepPreviousData,
  })
}