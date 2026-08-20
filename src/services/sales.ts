import { supabase } from '../lib/supabase'
import type {
  CreateSaleInput,
  PaymentMethod,
  SaleDetail,
  SaleItemRecord,
  SaleStatus,
} from '../types/sales'

const saleSelect =
  'id, shop_id, customer_id, cashier_id, receipt_number, subtotal, total, amount_paid, remaining_credit, payment_method, status, created_at, updated_at'

export async function createSale(input: CreateSaleInput): Promise<string> {
  const { data, error } = await supabase.rpc('create_sale', {
    p_shop_id: input.shop_id,
    p_customer_id: input.customer_id,
    p_items: input.items.map((item) => ({
      product_id: item.product_id,
      quantity: item.quantity,
    })),
    p_amount_paid: input.amount_paid,
    p_payment_method: input.payment_method,
  })
  if (error) throw error
  return data as string
}

export async function getSale(saleId: string): Promise<SaleDetail> {
  const { data, error } = await supabase
    .from('sales')
    .select(
      `${saleSelect}, items:sale_items(id, product_id, product_name, quantity, unit_price, total_price)`,
    )
    .eq('id', saleId)
    .single()

  if (error) throw error

  const row = data as Record<string, unknown> & { items?: Record<string, unknown>[] }

  const items: SaleItemRecord[] = (row.items ?? []).map((item) => ({
    id: item.id as string,
    product_id: item.product_id as string | null,
    product_name: item.product_name as string,
    quantity: Number(item.quantity),
    unit_price: Number(item.unit_price),
    total_price: Number(item.total_price),
  }))

  return {
    id: row.id as string,
    shop_id: row.shop_id as string,
    customer_id: row.customer_id as string | null,
    cashier_id: row.cashier_id as string,
    receipt_number: row.receipt_number as string,
    subtotal: Number(row.subtotal),
    total: Number(row.total),
    amount_paid: Number(row.amount_paid),
    remaining_credit: Number(row.remaining_credit),
    payment_method: row.payment_method as PaymentMethod,
    status: row.status as SaleStatus,
    created_at: row.created_at as string,
    updated_at: row.updated_at as string,
    items,
  }
}