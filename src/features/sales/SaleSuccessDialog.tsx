import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import CheckCircle from '@mui/icons-material/CheckCircle'
import { useShopDetail } from '../../hooks/useShops'
import type { SaleDetail } from '../../types/sales'
import ReceiptActions from './ReceiptActions'
import ReceiptSheet from './ReceiptSheet'

interface SaleSuccessDialogProps {
  open: boolean
  sale: SaleDetail | null
  onClose: () => void
}

export default function SaleSuccessDialog({ open, sale, onClose }: SaleSuccessDialogProps) {
  const shopQuery = useShopDetail(sale?.shop_id ?? null)
  const shop = shopQuery.data ?? null

  if (!sale) return null

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
          <Stack spacing={1} sx={{ alignItems: 'center' }}>
            <CheckCircle color="success" fontSize="large" />
            <Typography variant="h6">Sale Complete</Typography>
          </Stack>
        </DialogTitle>
        <DialogContent sx={{ pt: 1, pb: 1 }}>
          <ReceiptSheet sale={sale} shop={shop} />
          <ReceiptSheet sale={sale} shop={shop} forPrint />
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3, gap: 1 }}>
          <ReceiptActions sale={sale} shop={shop} />
          <Button onClick={onClose} variant="contained">
            Done
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}