export interface CustomerRecord {
  id: string
  shop_id: string
  full_name: string
  phone: string
  email: string | null
  address: string | null
  total_credit: number
  created_at: string
  updated_at: string
}

export interface CustomerListParams {
  page: number
  pageSize: number
  search?: string
  shopId?: string
}

export interface CustomerListResult {
  rows: CustomerRecord[]
  count: number
}

export interface CreateCustomerInput {
  shop_id: string
  full_name: string
  phone: string
  email?: string
  address?: string
}

export interface UpdateCustomerInput {
  customer_id: string
  full_name: string
  phone: string
  email?: string
  address?: string
}