import { useState } from 'react'
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
import ReceiptSheet from '../ReceiptSheet'
import MobileTicket from './MobileTicket'

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
            <MobileTicket sale={sale} shop={shop} />
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
