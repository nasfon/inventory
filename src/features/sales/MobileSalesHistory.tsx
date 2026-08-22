import { useCallback, useEffect, useMemo, useState } from 'react'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import MenuItem from '@mui/material/MenuItem'
import Select, { type SelectChangeEvent } from '@mui/material/Select'
import Skeleton from '@mui/material/Skeleton'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Visibility from '@mui/icons-material/Visibility'
import {
  FilterChips,
  MobileRow,
  SearchBar,
  SwipeableRow,
  type SwipeAction,
} from '../../components/mobile'
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll'
import { useMobileNav } from '../../layouts/mobile/mobileNav'
import { useAuth } from '../../hooks/useAuth'
import { useShops } from '../../hooks/useShops'
import { useInfiniteSalesList } from '../../hooks/useSales'
import { formatCurrency, formatDate } from '../../lib/utils'
import { PAYMENT_METHOD_LABELS, type SaleListRow, type SaleStatus } from '../../types/sales'
import SaleDetailsDialog from './SaleDetailsDialog'

type StatusFilter = 'all' | SaleStatus

const FILTER_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'completed', label: 'Completed' },
  { value: 'corrected', label: 'Corrected' },
  { value: 'reversed', label: 'Reversed' },
]

function statusColor(status: SaleStatus) {
  return status === 'completed' ? 'success' : status === 'corrected' ? 'warning' : 'error'
}

function matchesFilter(row: SaleListRow, filter: StatusFilter): boolean {
  if (filter === 'all') return true
  return row.status === filter
}

export default function MobileSalesHistory() {
  const { profile } = useAuth()
  const mobileNav = useMobileNav()
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<StatusFilter>('all')
  const [shopId, setShopId] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const isSuperAdmin = profile?.role === 'super_admin'
  const effectiveShopId = isSuperAdmin ? shopId : (profile?.shop_id ?? '')

  const shopsQuery = useShops()
  const shops = shopsQuery.data ?? []

  const query = useInfiniteSalesList({
    search,
    shopId: effectiveShopId,
    status: filter === 'all' ? '' : filter,
  })
  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage, refetch } = query

  const rows = useMemo(() => (data?.pages ?? []).flatMap((page) => page.rows), [data])
  const filteredRows = useMemo(() => rows.filter((row) => matchesFilter(row, filter)), [rows, filter])

  useEffect(() => {
    const timer = setTimeout(() => setSearch(searchInput.trim()), 300)
    return () => clearTimeout(timer)
  }, [searchInput])

  useEffect(() => {
    mobileNav.setRefresh(() => refetch())
    return () => mobileNav.setRefresh(null)
  }, [mobileNav, refetch])

  const sentinelRef = useInfiniteScroll(
    () => {
      if (hasNextPage && !isFetchingNextPage) fetchNextPage()
    },
    hasNextPage && !isFetchingNextPage,
  )

  const getActions = useCallback(
    (row: SaleListRow): SwipeAction[] => [
      {
        key: 'view',
        label: 'View',
        icon: Visibility,
        color: 'primary',
        onClick: () => setSelectedId(row.id),
      },
    ],
    [],
  )

  return (
    <Box>
      <Box sx={{ mb: 1.5 }}>
        <SearchBar value={searchInput} onChange={setSearchInput} placeholder="Search receipt or customer" />
      </Box>
      <Box sx={{ mb: 1.5 }}>
        <FilterChips options={FILTER_OPTIONS} value={filter} onChange={setFilter} />
      </Box>
      {isSuperAdmin && (
        <Select
          value={shopId}
          onChange={(event: SelectChangeEvent<string>) => setShopId(event.target.value)}
          displayEmpty
          size="small"
          fullWidth
          sx={{ mb: 1.5 }}
        >
          <MenuItem value="">All shops</MenuItem>
          {shops.map((shop) => (
            <MenuItem key={shop.id} value={shop.id}>
              {shop.name}
            </MenuItem>
          ))}
        </Select>
      )}

      {isLoading ? (
        <Stack spacing={1.5}>
          {Array.from({ length: 6 }).map((_, i) => (
            <Box key={i} sx={{ px: 2, py: 1.5, border: 1, borderColor: 'divider', borderRadius: 1.5 }}>
              <Skeleton width="60%" height={20} />
              <Skeleton width="40%" height={16} />
            </Box>
          ))}
        </Stack>
      ) : filteredRows.length === 0 ? (
        <Box sx={{ py: 8, textAlign: 'center' }}>
          <Typography variant="h6">No sales found</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Try adjusting your search or filters.
          </Typography>
        </Box>
      ) : (
        <Box>
          {filteredRows.map((row) => (
            <SwipeableRow
              key={row.id}
              actions={getActions(row)}
              onClick={() => setSelectedId(row.id)}
            >
              <MobileRow
                accent={statusColor(row.status)}
                primary={row.receipt_number}
                secondary={`${row.customer_name ?? 'Walk-in'} · ${formatDate(row.created_at)}`}
                trailing={
                  <Stack>
                    <Typography variant="body1" sx={{ fontWeight: 700 }}>
                      {formatCurrency(row.total)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {PAYMENT_METHOD_LABELS[row.payment_method]}
                    </Typography>
                  </Stack>
                }
              />
            </SwipeableRow>
          ))}
          {hasNextPage && (
            <Box ref={sentinelRef} sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
              {isFetchingNextPage ? <CircularProgress size={24} /> : null}
            </Box>
          )}
        </Box>
      )}

      <SaleDetailsDialog saleId={selectedId} onClose={() => setSelectedId(null)} />
    </Box>
  )
}
