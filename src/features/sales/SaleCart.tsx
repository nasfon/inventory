import Add from '@mui/icons-material/Add'
import DeleteOutlined from '@mui/icons-material/DeleteOutlined'
import Remove from '@mui/icons-material/Remove'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { formatCurrency } from '../../lib/utils'

export interface CartLine {
  product_id: string
  name: string
  sku: string
  unit_price: number
  quantity: number
  available: number
}

interface SaleCartProps {
  items: CartLine[]
  onChangeQuantity: (productId: string, quantity: number) => void
  onRemove: (productId: string) => void
}

export default function SaleCart({ items, onChangeQuantity, onRemove }: SaleCartProps) {
  const subtotal = items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0)

  if (items.length === 0) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Cart is empty. Search and add products above.
        </Typography>
      </Paper>
    )
  }

  return (
    <Paper>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Item</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell align="center">Qty</TableCell>
              <TableCell align="right">Total</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.product_id}>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {item.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {item.sku}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body2">{formatCurrency(item.unit_price)}</Typography>
                </TableCell>
                <TableCell align="center">
                  <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center', justifyContent: 'center' }}>
                    <IconButton
                      size="small"
                      aria-label="Decrease quantity"
                      onClick={() => onChangeQuantity(item.product_id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      <Remove fontSize="small" />
                    </IconButton>
                    <TextField
                      value={item.quantity}
                      onChange={(event) => {
                        const next = Number(event.target.value)
                        onChangeQuantity(item.product_id, Number.isInteger(next) ? next : 0)
                      }}
                      slotProps={{ htmlInput: { min: 1, max: item.available, step: 1, style: { textAlign: 'center' } } }}
                      size="small"
                      type="number"
                      sx={{ width: 72 }}
                    />
                    <IconButton
                      size="small"
                      aria-label="Increase quantity"
                      onClick={() => onChangeQuantity(item.product_id, item.quantity + 1)}
                      disabled={item.quantity >= item.available}
                    >
                      <Add fontSize="small" />
                    </IconButton>
                  </Stack>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body2">{formatCurrency(item.unit_price * item.quantity)}</Typography>
                </TableCell>
                <TableCell align="right">
                  <IconButton size="small" aria-label="Remove item" onClick={() => onRemove(item.product_id)}>
                    <DeleteOutlined fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Divider />
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'baseline' }}>
          <Typography variant="body2" color="text.secondary">
            Subtotal
          </Typography>
          <Typography variant="h6">{formatCurrency(subtotal)}</Typography>
        </Stack>
      </Box>
    </Paper>
  )
}