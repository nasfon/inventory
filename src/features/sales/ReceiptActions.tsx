import { useState } from 'react'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Image from '@mui/icons-material/Image'
import PictureAsPdf from '@mui/icons-material/PictureAsPdf'
import Print from '@mui/icons-material/Print'
import { downloadReceiptImage } from '../../lib/receiptImage'
import { downloadReceiptPdf } from '../../lib/receiptPdf'
import type { SaleDetail } from '../../types/sales'
import type { ShopRecord } from '../../types/shops'

interface ReceiptActionsProps {
  sale: SaleDetail
  shop: ShopRecord | null
}

export default function ReceiptActions({ sale, shop }: ReceiptActionsProps) {
  const [pending, setPending] = useState<'pdf' | 'image' | null>(null)

  const handlePrint = () => {
    window.print()
  }

  const handleDownload = async (kind: 'pdf' | 'image') => {
    setPending(kind)
    try {
      if (kind === 'pdf') {
        await downloadReceiptPdf(sale, shop)
      } else {
        await downloadReceiptImage(sale.receipt_number)
      }
    } finally {
      setPending(null)
    }
  }

  return (
    <>
      <Button size="small" startIcon={<Print />} onClick={handlePrint}>
        Print
      </Button>
      <Button
        size="small"
        variant="outlined"
        startIcon={pending === 'image' ? <CircularProgress size={16} /> : <Image />}
        onClick={() => handleDownload('image')}
        disabled={pending !== null}
      >
        Save Image
      </Button>
      <Button
        size="small"
        variant="outlined"
        startIcon={pending === 'pdf' ? <CircularProgress size={16} /> : <PictureAsPdf />}
        onClick={() => handleDownload('pdf')}
        disabled={pending !== null}
      >
        Download PDF
      </Button>
    </>
  )
}