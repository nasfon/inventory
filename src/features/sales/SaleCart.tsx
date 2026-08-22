import Add from '@mui/icons-material/Add'
import DeleteOutlined from '@mui/icons-material/DeleteOutlined'
import Remove from '@mui/icons-material/Remove'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
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
  const total = items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0)

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
    <Paper sx={{ overflow: 'hidden' }}>
      <Stack divider={<Divider />}>
        {items.map((item) => (
          <Stack
            key={item.product_id}
            direction="row"
            spacing={1}
            sx={{ alignItems: 'center', px: 2, py: 1.25 }}
          >
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography noWrap variant="body2" sx={{ fontWeight: 600 }}>
                {item.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {formatCurrency(item.unit_price)}
              </Typography>
            </Box>

            <Stack direction="row" spacing={0.25} sx={{ alignItems: 'center' }}>
              <IconButton
                size="small"
                aria-label="Decrease quantity"
                onClick={() => onChangeQuantity(item.product_id, item.quantity - 1)}
                disabled={item.quantity <= 1}
              >
                <Remove fontSize="small" />
              </IconButton>
              <Typography
                variant="body2"
                sx={{ minWidth: 22, textAlign: 'center', fontWeight: 600 }}
              >
                {item.quantity}
              </Typography>
              <IconButton
                size="small"
                aria-label="Increase quantity"
                onClick={() => onChangeQuantity(item.product_id, item.quantity + 1)}
                disabled={item.quantity >= item.available}
              >
                <Add fontSize="small" />
              </IconButton>
            </Stack>

            <Typography
              variant="body2"
              sx={{ minWidth: 78, textAlign: 'right', fontWeight: 700 }}
            >
              {formatCurrency(item.unit_price * item.quantity)}
            </Typography>

            <IconButton
              size="small"
              aria-label="Remove item"
              onClick={() => onRemove(item.product_id)}
              sx={{ color: 'text.secondary' }}
            >
              <DeleteOutlined fontSize="small" />
            </IconButton>
          </Stack>
        ))}
      </Stack>

      <Divider />
      <Stack
        direction="row"
        sx={{ justifyContent: 'space-between', px: 2, py: 1.5 }}
      >
        <Typography variant="body2" color="text.secondary">
          Total
        </Typography>
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          {formatCurrency(total)}
        </Typography>
      </Stack>
    </Paper>
  )
}
