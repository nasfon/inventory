import { useState } from 'react'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import Paper from '@mui/material/Paper'
import Select, { type SelectChangeEvent } from '@mui/material/Select'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import ShoppingCartCheckout from '@mui/icons-material/ShoppingCartCheckout'
import { getApiErrorMessage } from '../../lib/errors'
import { formatCurrency, formatMoneyInput, roundToTwo, sanitizeMoneyInput } from '../../lib/utils'
import { useAuth } from '../../hooks/useAuth'
import { useShops } from '../../hooks/useShops'
import { useCreateSale } from '../../hooks/useSales'
import * as salesService from '../../services/sales'
import type { CustomerRecord } from '../../types/customers'
import type { ProductRecord } from '../../types/products'
import { PAYMENT_METHOD_LABELS, type PaymentMethod, type SaleDetail } from '../../types/sales'
import CustomerPicker from './CustomerPicker'
import ProductPicker from './ProductPicker'
import SaleCart, { type CartLine } from './SaleCart'
import SaleSuccessDialog from './SaleSuccessDialog'

const STEPS = ['Customer', 'Items', 'Pay'] as const

export default function MobileNewSaleFlow() {
  const { profile } = useAuth()
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [shopSelection, setShopSelection] = useState('')
  const [cart, setCart] = useState<CartLine[]>([])
  const [customer, setCustomer] = useState<CustomerRecord | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash')
  const [amountPaidInput, setAmountPaidInput] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [successSale, setSuccessSale] = useState<SaleDetail | null>(null)

  const isSuperAdmin = profile?.role === 'super_admin'
  const shopId = isSuperAdmin ? shopSelection : (profile?.shop_id ?? '')
  const shopsQuery = useShops()
  const shops = shopsQuery.data ?? []
  const createSale = useCreateSale()

  const subtotal = roundToTwo(cart.reduce((sum, line) => sum + roundToTwo(line.unit_price * line.quantity), 0))
  const total = subtotal
  const amountPaid = amountPaidInput ?? String(total)
  const amountPaidNum = Number(amountPaid)
  const overpayment = Number.isFinite(amountPaidNum) && amountPaidNum > total
  const customerMissing = !customer
  const amountValid = Number.isFinite(amountPaidNum) && amountPaidNum >= 0 && !overpayment
  const canComplete =
    Boolean(shopId) && cart.length > 0 && !customerMissing && amountValid && !createSale.isPending

  const handleAddProduct = (product: ProductRecord) => {
    setCart((prev) => {
      const existing = prev.find((line) => line.product_id === product.id)
      if (existing) {
        return prev.map((line) =>
          line.product_id === product.id
            ? { ...line, quantity: Math.min(line.quantity + 1, line.available) }
            : line,
        )
      }
      return [
        ...prev,
        {
          product_id: product.id,
          name: product.name,
          sku: product.sku,
          unit_price: product.selling_price,
          quantity: 1,
          available: product.quantity,
        },
      ]
    })
  }

  const handleChangeQuantity = (productId: string, quantity: number) => {
    if (!Number.isInteger(quantity) || quantity < 1) return
    setCart((prev) =>
      prev.map((line) =>
        line.product_id === productId ? { ...line, quantity: Math.min(quantity, line.available) } : line,
      ),
    )
  }

  const handleRemove = (productId: string) => {
    const next = cart.filter((line) => line.product_id !== productId)
    setCart(next)
    if (next.length === 0) setAmountPaidInput(null)
  }

  const handleComplete = async () => {
    setSubmitError(null)
    try {
      const saleId = await createSale.mutateAsync({
        shop_id: shopId,
        customer_id: customer?.id ?? null,
        items: cart.map((line) => ({ product_id: line.product_id, quantity: line.quantity })),
        amount_paid: amountPaidNum,
        payment_method: paymentMethod,
      })
      const sale = await salesService.getSale(saleId)
      setSuccessSale(sale)
    } catch (error) {
      setSubmitError(getApiErrorMessage(error))
    }
  }

  const resetFlow = () => {
    setCart([])
    setCustomer(null)
    setPaymentMethod('cash')
    setAmountPaidInput(null)
    setSubmitError(null)
    setStep(1)
  }

  if (successSale) {
    return (
      <SaleSuccessDialog
        open
        sale={successSale}
        onClose={() => {
          setSuccessSale(null)
          resetFlow()
        }}
      />
    )
  }

  return (
    <Box>
      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
        {STEPS.map((label, index) => {
          const value = (index + 1) as 1 | 2 | 3
          const active = value === step
          const done = value < step
          return (
            <Box key={label} sx={{ flex: 1 }}>
              <Typography
                variant="caption"
                sx={{ fontWeight: 700, color: active || done ? 'primary.main' : 'text.secondary' }}
              >
                {label}
              </Typography>
              <Box
                sx={{
                  height: 4,
                  borderRadius: 2,
                  mt: 0.5,
                  bgcolor: active || done ? 'primary.main' : 'divider',
                }}
              />
            </Box>
          )
        })}
      </Stack>

      {isSuperAdmin && (
        <Select
          value={shopSelection}
          onChange={(event: SelectChangeEvent<string>) => setShopSelection(event.target.value)}
          displayEmpty
          size="small"
          fullWidth
          sx={{ mb: 2 }}
        >
          <MenuItem value="">Select a shop</MenuItem>
          {shops.map((shop) => (
            <MenuItem key={shop.id} value={shop.id}>
              {shop.name}
            </MenuItem>
          ))}
        </Select>
      )}

      {!shopId ? (
        <Paper sx={{ p: 3 }}>
          <Typography variant="body2" color="text.secondary">
            Select a shop to start a sale.
          </Typography>
        </Paper>
      ) : (
        <>
          {step === 1 && (
            <CustomerPicker shopId={shopId} value={customer} onChange={setCustomer} />
          )}

          {step === 2 && (
            <Stack spacing={2}>
              <ProductPicker
                shopId={shopId}
                addedIds={cart.map((line) => line.product_id)}
                onAdd={handleAddProduct}
              />
              <SaleCart items={cart} onChangeQuantity={handleChangeQuantity} onRemove={handleRemove} />
            </Stack>
          )}

          {step === 3 && (
            <Paper sx={{ p: 2.5 }}>
              <Stack spacing={2}>
                <Typography variant="h6">Summary</Typography>
                <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Subtotal</Typography>
                  <Typography variant="body2">{formatCurrency(subtotal)}</Typography>
                </Stack>
                <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
                  <Typography variant="body1">Total</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 700 }}>{formatCurrency(total)}</Typography>
                </Stack>
                <Divider />
                <Stack spacing={1}>
                  <Typography variant="subtitle2">Payment method</Typography>
                  <Select
                    value={paymentMethod}
                    onChange={(event: SelectChangeEvent<PaymentMethod>) =>
                      setPaymentMethod(event.target.value as PaymentMethod)
                    }
                    size="small"
                    fullWidth
                  >
                    {(Object.keys(PAYMENT_METHOD_LABELS) as PaymentMethod[]).map((method) => (
                      <MenuItem key={method} value={method}>
                        {PAYMENT_METHOD_LABELS[method]}
                      </MenuItem>
                    ))}
                  </Select>
                </Stack>
                <TextField
                  label="Amount paid"
                  type="text"
                  inputMode="decimal"
                  value={
                    amountPaidInput === null
                      ? formatMoneyInput(String(total))
                      : formatMoneyInput(amountPaidInput)
                  }
                  onChange={(event) => setAmountPaidInput(sanitizeMoneyInput(event.target.value))}
                  size="small"
                  fullWidth
                />
                {overpayment ? (
                  <Typography variant="body2" color="error.main">
                    Amount paid cannot exceed the sale total.
                  </Typography>
                ) : amountPaidNum < total ? (
                  <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Remaining balance</Typography>
                    <Typography variant="body2" color="error.main">
                      {formatCurrency(roundToTwo(total - amountPaidNum))}
                    </Typography>
                  </Stack>
                ) : (
                  <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Change</Typography>
                    <Typography variant="body2" color="success.main">
                      {formatCurrency(roundToTwo(amountPaidNum - total))}
                    </Typography>
                  </Stack>
                )}
                {customerMissing && (
                  <Typography variant="body2" color="error.main">
                    Select a customer to complete the sale.
                  </Typography>
                )}
                {submitError && <Alert severity="error">{submitError}</Alert>}
              </Stack>
            </Paper>
          )}

          <Stack direction="row" spacing={1.5} sx={{ mt: 2.5 }}>
            {step > 1 && (
              <Button onClick={() => setStep((prev) => (prev - 1) as 1 | 2 | 3)} disabled={createSale.isPending} fullWidth>
                Back
              </Button>
            )}
            {step < 3 && (
              <Button
                variant="contained"
                onClick={() => setStep((prev) => (prev + 1) as 1 | 2 | 3)}
                disabled={step === 1 && isSuperAdmin && !shopId ? true : step === 2 && cart.length === 0}
                fullWidth
              >
                Next
              </Button>
            )}
            {step === 3 && (
              <Button
                variant="contained"
                startIcon={<ShoppingCartCheckout />}
                onClick={handleComplete}
                disabled={!canComplete}
                fullWidth
              >
                Complete Sale
              </Button>
            )}
          </Stack>
        </>
      )}
    </Box>
  )
}
