import type { SaleDetail } from '../types/sales'
import { PAYMENT_METHOD_LABELS } from '../types/sales'
import type { ShopRecord } from '../types/shops'
import { formatCurrency, formatDateTime } from './utils'

const MARGIN = 20
const PAGE_WIDTH = 210
const PAGE_HEIGHT = 297
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2
const CONTENT_HEIGHT = PAGE_HEIGHT - MARGIN * 2

type TextCmd = {
  type: 'text'
  text: string
  x: number
  y: number
  size: number
  style: 'normal' | 'bold'
  align: 'left' | 'right' | 'center'
}

type LineCmd = {
  type: 'line'
  x1: number
  x2: number
  y: number
  width: number
  color: [number, number, number]
}

type Cmd = TextCmd | LineCmd

export async function downloadReceiptPdf(sale: SaleDetail, shop: ShopRecord | null): Promise<void> {
  const { jsPDF } = await import('jspdf')
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })

  const commands: Cmd[] = []
  let y = 0

  const pushText = (
    text: string,
    x: number,
    size: number,
    style: 'normal' | 'bold',
    align: 'left' | 'right' | 'center',
  ) => {
    commands.push({ type: 'text', text, x, y, size, style, align })
  }

  const row = (label: string, value: string, boldValue = false) => {
    pushText(label, 0, 3.5, 'normal', 'left')
    pushText(value, CONTENT_WIDTH, 3.5, boldValue ? 'bold' : 'normal', 'right')
    y += 5.5
  }

  const divider = (thickness = 0.3, color: [number, number, number] = [226, 232, 240]) => {
    y += 1.5
    commands.push({ type: 'line', x1: 0, x2: CONTENT_WIDTH, y, width: thickness, color })
    y += 6
  }

  const name = shop?.name ?? 'Business'
  pushText(name, CONTENT_WIDTH / 2, 6.5, 'bold', 'center')
  y += 9

  const contact = [shop?.phone, shop?.email].filter(Boolean).join('  •  ')
  if (contact) {
    pushText(contact, CONTENT_WIDTH / 2, 3.2, 'normal', 'center')
    y += 5
  }
  if (shop?.address) {
    pushText(shop.address, CONTENT_WIDTH / 2, 3.2, 'normal', 'center')
    y += 5
  }
  y += 2

  commands.push({ type: 'line', x1: 0, x2: CONTENT_WIDTH, y, width: 0.8, color: [15, 23, 42] })
  y += 8

  pushText('SALES RECEIPT', CONTENT_WIDTH / 2, 4, 'bold', 'center')
  y += 6
  divider()

  row('Receipt No.', sale.receipt_number, true)
  row('Date & Time', formatDateTime(sale.created_at))
  row('Payment Method', PAYMENT_METHOD_LABELS[sale.payment_method])
  row('Customer', sale.customer_id ? 'Customer on file' : 'Walk-in / Guest')
  divider()

  const colItem = 12
  const colQty = 110
  const colPrice = 136
  const colTotal = CONTENT_WIDTH
  const itemNameWidth = colQty - colItem - 8

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(3.5)
  pushText('#', 0, 3.5, 'bold', 'left')
  pushText('Item', colItem, 3.5, 'bold', 'left')
  pushText('Qty', colQty, 3.5, 'bold', 'right')
  pushText('Unit Price', colPrice, 3.5, 'bold', 'right')
  pushText('Total', colTotal, 3.5, 'bold', 'right')
  y += 5
  divider(0.2)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(3.2)

  sale.items.forEach((item, index) => {
    const lines = doc.splitTextToSize(item.product_name, itemNameWidth) as string[]
    lines.forEach((line, lineIndex) => {
      if (lineIndex === 0) {
        pushText(String(index + 1), 0, 3.2, 'normal', 'left')
        pushText(line, colItem, 3.2, 'normal', 'left')
        pushText(String(item.quantity), colQty, 3.2, 'normal', 'right')
        pushText(formatCurrency(item.unit_price), colPrice, 3.2, 'normal', 'right')
        pushText(formatCurrency(item.total_price), colTotal, 3.2, 'normal', 'right')
      } else {
        pushText(line, colItem, 3.2, 'normal', 'left')
      }
      y += 4.2
    })
    y += 1
    commands.push({ type: 'line', x1: 0, x2: CONTENT_WIDTH, y, width: 0.15, color: [241, 245, 249] })
    y += 1.5
  })

  y += 1
  divider()

  const totalUnits = sale.items.reduce((sum, item) => sum + item.quantity, 0)
  row('Items', `${sale.items.length} line${sale.items.length === 1 ? '' : 's'}  ·  ${totalUnits} unit${totalUnits === 1 ? '' : 's'}`)
  divider()

  pushText('Total', 60, 4.5, 'bold', 'left')
  pushText(formatCurrency(sale.total), CONTENT_WIDTH, 4.5, 'bold', 'right')
  y += 7

  pushText('Subtotal', 60, 3.5, 'normal', 'left')
  pushText(formatCurrency(sale.subtotal), CONTENT_WIDTH, 3.5, 'normal', 'right')
  y += 5.5

  pushText('Amount Paid', 60, 3.5, 'normal', 'left')
  pushText(formatCurrency(sale.amount_paid), CONTENT_WIDTH, 3.5, 'normal', 'right')
  y += 5.5

  if (sale.remaining_credit > 0) {
    pushText('Remaining Credit', 60, 3.5, 'bold', 'left')
    pushText(formatCurrency(sale.remaining_credit), CONTENT_WIDTH, 3.5, 'bold', 'right')
    y += 5.5
  } else {
    pushText('Status', 60, 3.5, 'normal', 'left')
    pushText('Fully paid', CONTENT_WIDTH, 3.5, 'normal', 'right')
    y += 5.5
  }

  y += 1
  divider()

  const footer = shop?.receipt_footer ?? 'Thank you for your patronage!'
  const footerLines = doc.splitTextToSize(footer, CONTENT_WIDTH) as string[]
  footerLines.forEach((line) => {
    pushText(line, CONTENT_WIDTH / 2, 3.2, 'normal', 'center')
    y += 4.2
  })

  const scale = Math.min(1, CONTENT_HEIGHT / y)

  for (const cmd of commands) {
    if (cmd.type === 'text') {
      doc.setFont('helvetica', cmd.style)
      doc.setFontSize(cmd.size * scale)
      doc.text(cmd.text, MARGIN + cmd.x * scale, MARGIN + cmd.y * scale, { align: cmd.align })
    } else {
      doc.setDrawColor(...cmd.color)
      doc.setLineWidth(cmd.width * scale)
      doc.line(
        MARGIN + cmd.x1 * scale,
        MARGIN + cmd.y * scale,
        MARGIN + cmd.x2 * scale,
        MARGIN + cmd.y * scale,
      )
    }
  }

  doc.save(`receipt-${sale.receipt_number}.pdf`)
}