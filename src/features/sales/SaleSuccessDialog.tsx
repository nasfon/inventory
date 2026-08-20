import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Divider from '@mui/material/Divider'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import CheckCircle from '@mui/icons-material/CheckCircle'
import { formatCurrency } from '../../lib/utils'
import { PAYMENT_METHOD_LABELS, type SaleDetail } from '../../types/sales'

interface SaleSuccessDialogProps {
  open: boolean
  sale: SaleDetail | null
  onClose: () => void
}

export default function SaleSuccessDialog({ open, sale, onClose }: SaleSuccessDialogProps) {
  if (!sale) return null

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ textAlign: 'center' }}>
        <Stack spacing={1} sx={{ alignItems: 'center' }}>
          <CheckCircle color="success" fontSize="large" />
          <Typography variant="h6">Sale Complete</Typography>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={1.5}>
          <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
            <Typography variant="body2" color="text.secondary">
              Receipt
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {sale.receipt_number}
            </Typography>
          </Stack>
          <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
            <Typography variant="body2" color="text.secondary">
              Items
            </Typography>
            <Typography variant="body2">
              {sale.items.reduce((sum, item) => sum + item.quantity, 0)} unit
              {sale.items.reduce((sum, item) => sum + item.quantity, 0) === 1 ? '' : 's'}
            </Typography>
          </Stack>
          <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
            <Typography variant="body2" color="text.secondary">
              Payment method
            </Typography>
            <Typography variant="body2">{PAYMENT_METHOD_LABELS[sale.payment_method]}</Typography>
          </Stack>
          <Divider />
          <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
            <Typography variant="body1">Total</Typography>
            <Typography variant="body1" sx={{ fontWeight: 700 }}>
              {formatCurrency(sale.total)}
            </Typography>
          </Stack>
          <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
            <Typography variant="body2" color="text.secondary">
              Amount paid
            </Typography>
            <Typography variant="body2">{formatCurrency(sale.amount_paid)}</Typography>
          </Stack>
          {sale.remaining_credit > 0 ? (
            <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">
                Remaining credit
              </Typography>
              <Typography variant="body2" color="error.main">
                {formatCurrency(sale.remaining_credit)}
              </Typography>
            </Stack>
          ) : (
            <DialogContentText sx={{ textAlign: 'center', mt: 1 }}>
              Fully paid — no outstanding balance.
            </DialogContentText>
          )}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
        <Button onClick={onClose} variant="contained">
          Done
        </Button>
      </DialogActions>
    </Dialog>
  )
}