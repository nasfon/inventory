import { useState } from 'react'
import type { ColumnDef, PaginationState } from '@tanstack/react-table'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Close from '@mui/icons-material/Close'
import Payments from '@mui/icons-material/Payments'
import DataTable from '../../components/data/DataTable'
import type { TableFeatures } from '../../components/data/table'
import { getApiErrorMessage } from '../../lib/errors'
import { formatCurrency, formatDateTime } from '../../lib/utils'
import { useCustomerPayments, useRecordCreditPayment } from '../../hooks/useCredit'
import { useCustomerProfile } from '../../hooks/useCustomers'
import type { CustomerRecord } from '../../types/customers'
import {
  CREDIT_PAYMENT_METHOD_LABELS,
  type CreditPaymentMethod,
  type CreditPaymentRecord,
} from '../../types/credit'
import RecordPaymentDialog from './RecordPaymentDialog'
import type { RecordPaymentFormValues } from './creditSchema'

interface CreditCustomerDialogProps {
  customer: CustomerRecord
  shopName?: string
  onClose: () => void
}

export default function CreditCustomerDialog({
  customer,
  shopName,
  onClose,
}: CreditCustomerDialogProps) {
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 })
  const [paymentOpen, setPaymentOpen] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const paymentsQuery = useCustomerPayments(customer.id, {
    page: pagination.pageIndex,
    pageSize: pagination.pageSize,
  })
  const recordPayment = useRecordCreditPayment()
  const profileQuery = useCustomerProfile(customer.id)
  const liveCustomer = profileQuery.data ?? customer
  const outstanding = liveCustomer.total_credit

  const columns: ColumnDef<TableFeatures, CreditPaymentRecord, unknown>[] = [
    {
      accessorKey: 'created_at',
      header: 'Date',
      cell: (info) => <Typography variant="body2">{formatDateTime(info.getValue<string>())}</Typography>,
    },
    {
      accessorKey: 'amount',
      header: 'Amount',
      cell: (info) => <Typography variant="body2">{formatCurrency(info.getValue<number>())}</Typography>,
    },
    {
      accessorKey: 'payment_method',
      header: 'Method',
      cell: (info) => (
        <Typography variant="body2">
          {CREDIT_PAYMENT_METHOD_LABELS[info.getValue<CreditPaymentMethod>()]}
        </Typography>
      ),
    },
    {
      accessorKey: 'received_by_name',
      header: 'Received by',
      cell: (info) => <Typography variant="body2">{info.getValue<string | null>() ?? '—'}</Typography>,
    },
  ]

  const handleSubmit = async (values: RecordPaymentFormValues) => {
    setSubmitError(null)
    try {
      await recordPayment.mutateAsync({
        customer_id: customer.id,
        amount: values.amount,
        payment_method: values.payment_method,
      })
      setPaymentOpen(false)
    } catch (error) {
      setSubmitError(getApiErrorMessage(error))
    }
  }

  return (
    <Dialog open onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pr: 1 }}>
        <Avatar sx={{ bgcolor: 'error.main' }}>{customer.full_name.charAt(0).toUpperCase()}</Avatar>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {customer.full_name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {customer.phone}
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Payments />}
          onClick={() => setPaymentOpen(true)}
          disabled={outstanding <= 0}
        >
          Record Payment
        </Button>
        <IconButton aria-label="Close" onClick={onClose}>
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ pt: 2.5 }}>
        <Stack spacing={2.5}>
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="caption" color="text.secondary">
              Outstanding Credit
            </Typography>
            <Typography
              variant="h5"
              sx={{ color: outstanding > 0 ? 'error.main' : 'success.main', fontWeight: 700 }}
            >
              {formatCurrency(outstanding)}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {shopName ?? '—'}
            </Typography>
          </Paper>
          <Divider />
          <Typography variant="h6">Payment History</Typography>
          <DataTable<CreditPaymentRecord>
            columns={columns}
            data={paymentsQuery.data?.rows ?? []}
            getRowId={(row) => row.id}
            loading={paymentsQuery.isLoading}
            rowCount={paymentsQuery.data?.count ?? 0}
            pagination={pagination}
            onPaginationChange={setPagination}
            emptyTitle="No payments recorded"
            emptyDescription="Payments toward this balance will appear here."
          />
        </Stack>
      </DialogContent>
      <RecordPaymentDialog
        open={paymentOpen}
        customerName={customer.full_name}
        outstanding={outstanding}
        isSubmitting={recordPayment.isPending}
        submitError={submitError}
        onSubmit={handleSubmit}
        onClose={() => {
          setPaymentOpen(false)
          setSubmitError(null)
        }}
      />
    </Dialog>
  )
}