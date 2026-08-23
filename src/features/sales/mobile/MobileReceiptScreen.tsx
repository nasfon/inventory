import { useState, type ReactNode } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import Print from '@mui/icons-material/Print'
import Image from '@mui/icons-material/Image'
import PictureAsPdf from '@mui/icons-material/PictureAsPdf'
import Loading from '../../../components/feedback/Loading'
import { useMobileNav } from '../../../layouts/mobile/mobileNav'
import { useSaleDetail } from '../../../hooks/useSales'
import { useShopDetail } from '../../../hooks/useShops'
import { downloadReceiptImage } from '../../../lib/receiptImage'
import { downloadReceiptPdf } from '../../../lib/receiptPdf'
import { formatCurrency, formatDateTime } from '../../../lib/utils'
import { PAYMENT_METHOD_LABELS, type SaleDetail } from '../../../types/sales'
import type { ShopRecord } from '../../../types/shops'
import ReceiptSheet from '../ReceiptSheet'

function TicketRow({ label, value, bold }: { label: string; value: ReactNode; bold?: boolean }) {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        gap: 2,
        py: 0.5,
      }}
    >
      <Typography variant="body2" color={bold ? 'text.primary' : 'text.secondary'} sx={{ fontWeight: bold ? 600 : 400 }}>
        {label}
      </Typography>
      <Typography variant="body2" sx={{ fontWeight: bold ? 700 : 600, textAlign: 'right' }}>
        {value}
      </Typography>
    </Box>
  )
}

function TicketContent({ sale, shop }: { sale: SaleDetail; shop: ShopRecord | null }) {
  const contact = [shop?.phone, shop?.email].filter(Boolean).join('  •  ')
  const totalUnits = sale.items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <Box sx={{ color: '#0f172a', fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif' }}>
      <Box sx={{ textAlign: 'center', pb: 1.5, borderBottom: '2px solid #0f172a' }}>
        <Typography sx={{ fontSize: 20, fontWeight: 700, letterSpacing: 0.4 }}>{shop?.name ?? 'Business'}</Typography>
        {contact && <Typography variant="caption" sx={{ color: '#475569', display: 'block', mt: 0.5 }}>{contact}</Typography>}
        {shop?.address && <Typography variant="caption" sx={{ color: '#475569', display: 'block' }}>{shop.address}</Typography>}
      </Box>

      <Box sx={{ textAlign: 'center', py: 1 }}>
        <Typography sx={{ fontSize: 12, fontWeight: 600, letterSpacing: 4, color: '#475569' }}>SALES RECEIPT</Typography>
      </Box>

      <Box sx={{ borderTop: '1px dashed #cbd5e1', my: 1 }} />

      <TicketRow label="Receipt No." value={sale.receipt_number} />
      <TicketRow label="Date & Time" value={formatDateTime(sale.created_at)} />
      <TicketRow label="Payment Method" value={PAYMENT_METHOD_LABELS[sale.payment_method]} />
      <TicketRow label="Customer" value={sale.customer_name ?? (sale.customer_id ? 'Customer on file' : 'Walk-in / Guest')} />

      <Box sx={{ borderTop: '1px dashed #cbd5e1', my: 1 }} />

      {sale.items.map((item) => (
        <Box
          key={item.id}
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: 1.5,
            py: 1,
            borderBottom: '1px dashed #e2e8f0',
          }}
        >
          <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ fontWeight: 600, fontSize: 14 }}>{item.product_name}</Typography>
            <Typography variant="caption" sx={{ color: '#64748b' }}>
              {item.quantity} × {formatCurrency(item.unit_price)}
            </Typography>
          </Box>
          <Typography sx={{ fontWeight: 600, fontSize: 14, whiteSpace: 'nowrap' }}>
            {formatCurrency(item.total_price)}
          </Typography>
        </Box>
      ))}

      <Box sx={{ borderTop: '1px dashed #cbd5e1', my: 1 }} />

      <TicketRow
        label="Items"
        value={`${sale.items.length} line${sale.items.length === 1 ? '' : 's'} · ${totalUnits} unit${totalUnits === 1 ? '' : 's'}`}
      />
      <TicketRow label="Subtotal" value={formatCurrency(sale.subtotal)} />
      <TicketRow label="Total" value={formatCurrency(sale.total)} bold />
      <TicketRow label="Amount Paid" value={formatCurrency(sale.amount_paid)} />
      {sale.remaining_credit > 0 ? (
        <TicketRow label="Remaining Credit" value={formatCurrency(sale.remaining_credit)} bold />
      ) : (
        <Typography variant="caption" sx={{ color: '#16a34a', textAlign: 'center', display: 'block', mt: 0.5 }}>
          Fully paid — no outstanding balance.
        </Typography>
      )}

      <Box sx={{ borderTop: '1px dashed #cbd5e1', my: 1 }} />

      <Typography variant="caption" sx={{ color: '#475569', textAlign: 'center', display: 'block' }}>
        {shop?.receipt_footer ?? 'Thank you for your patronage!'}
      </Typography>
    </Box>
  )
}

export default function MobileReceiptScreen() {
  const mobileNav = useMobileNav()
  const saleId = mobileNav.params?.saleId ?? null
  const { data: sale, isLoading, isError } = useSaleDetail(saleId)
  const shopQuery = useShopDetail(sale?.shop_id ?? null)
  const shop = shopQuery.data ?? null
  const [pending, setPending] = useState<'pdf' | 'image' | null>(null)

  const handleDownload = async (kind: 'pdf' | 'image') => {
    if (!sale) return
    setPending(kind)
    try {
      if (kind === 'pdf') {
        await downloadReceiptPdf(sale)
      } else {
        await downloadReceiptImage(sale.receipt_number)
      }
    } finally {
      setPending(null)
    }
  }

  if (isLoading) {
    return <Loading label="Loading receipt..." />
  }

  if (isError || !sale) {
    return (
      <Box sx={{ py: 8, textAlign: 'center', px: 2 }}>
        <Typography variant="h6">Receipt not found</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          This sale may have been removed or is no longer available.
        </Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ pb: 'calc(84px + env(safe-area-inset-bottom))' }}>
      <Box
        sx={{
          maxWidth: 360,
          mx: 'auto',
          background: '#ffffff',
          borderRadius: 3,
          boxShadow: 3,
          p: 2.5,
          position: 'relative',
        }}
      >
        <Box
          id="receipt-view"
          sx={{ background: '#ffffff', borderRadius: 2, p: 1 }}
        >
          <TicketContent sale={sale} shop={shop} />
        </Box>
      </Box>

      <ReceiptSheet sale={sale} shop={shop} forPrint />

      <Box
        sx={{
          position: 'fixed',
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1100,
          display: 'flex',
          gap: 1,
          p: 1.5,
          pt: 1.25,
          pb: 'calc(12px + env(safe-area-inset-bottom))',
          bgcolor: 'background.paper',
          borderTop: 1,
          borderColor: 'divider',
        }}
      >
        <Button fullWidth variant="contained" startIcon={<Print />} onClick={() => window.print()}>
          Print
        </Button>
        <Button
          fullWidth
          variant="outlined"
          startIcon={pending === 'image' ? <CircularProgress size={16} /> : <Image />}
          onClick={() => handleDownload('image')}
          disabled={pending !== null}
        >
          Save PNG
        </Button>
        <Button
          fullWidth
          variant="outlined"
          startIcon={pending === 'pdf' ? <CircularProgress size={16} /> : <PictureAsPdf />}
          onClick={() => handleDownload('pdf')}
          disabled={pending !== null}
        >
          PDF
        </Button>
      </Box>
    </Box>
  )
}
