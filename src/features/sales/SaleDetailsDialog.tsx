import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import Close from '@mui/icons-material/Close'
import Loading from '../../components/feedback/Loading'
import StatusBadge from '../../components/ui/StatusBadge'
import { useSaleDetail } from '../../hooks/useSales'
import { useShopDetail } from '../../hooks/useShops'
import { formatCurrency, formatDateTime } from '../../lib/utils'
import { PAYMENT_METHOD_LABELS, type SaleStatus } from '../../types/sales'
import ReceiptActions from './ReceiptActions'
import ReceiptSheet from './ReceiptSheet'

interface SaleDetailsDialogProps {
  saleId: string | null
  onClose: () => void
}

export default function SaleDetailsDialog({ saleId, onClose }: SaleDetailsDialogProps) {
  const { data: sale, isLoading } = useSaleDetail(saleId)
  const shopQuery = useShopDetail(sale?.shop_id ?? null)
  const shop = shopQuery.data ?? null

  const statusColor = (status: SaleStatus) =>
    status === 'completed' ? 'success' : status === 'corrected' ? 'warning' : 'error'

  return (
    <Dialog open={saleId !== null} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, pr: 1 }}>
        <Stack sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {sale ? sale.receipt_number : 'Sale details'}
          </Typography>
          {sale && (
            <Typography variant="body2" color="text.secondary">
              {formatDateTime(sale.created_at)}
            </Typography>
          )}
        </Stack>
        {sale && <StatusBadge label={sale.status} color={statusColor(sale.status)} />}
        <IconButton aria-label="Close" onClick={onClose}>
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ pt: 2.5 }}>
        {isLoading || !sale ? (
          <Loading label="Loading sale details..." />
        ) : (
          <Stack spacing={2.5}>
            <Stack spacing={1}>
              <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">
                  Customer
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {sale.customer_id ? 'Customer on file' : 'Walk-in / Guest'}
                </Typography>
              </Stack>
              <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">
                  Payment method
                </Typography>
                <Typography variant="body2">{PAYMENT_METHOD_LABELS[sale.payment_method]}</Typography>
              </Stack>
            </Stack>

            <Divider />

            <Stack spacing={1}>
              <Typography variant="subtitle2">Items</Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Item</TableCell>
                      <TableCell align="right">Qty</TableCell>
                      <TableCell align="right">Unit Price</TableCell>
                      <TableCell align="right">Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sale.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {item.product_name}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2">{item.quantity}</Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2">{formatCurrency(item.unit_price)}</Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2">{formatCurrency(item.total_price)}</Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Stack>

            <Divider />

            <Stack spacing={1}>
              <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">
                  Subtotal
                </Typography>
                <Typography variant="body2">{formatCurrency(sale.subtotal)}</Typography>
              </Stack>
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
              {sale.remaining_credit > 0 && (
                <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">
                    Remaining credit
                  </Typography>
                  <Typography variant="body2" color="error.main" sx={{ fontWeight: 600 }}>
                    {formatCurrency(sale.remaining_credit)}
                  </Typography>
                </Stack>
              )}
            </Stack>
          </Stack>
        )}
      </DialogContent>
      <DialogActions>
        {sale && (
          <>
            <ReceiptActions sale={sale} shop={shop} />
            <ReceiptSheet sale={sale} shop={shop} forPrint />
          </>
        )}
        <Button onClick={onClose} variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}