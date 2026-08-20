export function getAuthErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    const code = (error as { code?: string }).code
    if (typeof code === 'string') {
      switch (code) {
        case 'invalid_credentials':
          return 'Invalid email or password.'
        case 'email_not_confirmed':
          return 'Please verify your email address before signing in.'
        case 'user_not_found':
          return 'No account found with this email address.'
        case 'rate_limited':
        case 'over_email_send_rate_limit':
        case 'over_request_rate_limit':
          return 'Too many attempts. Please try again later.'
        case 'network_request_failed':
          return 'Unable to reach the server. Check your connection and try again.'
      }
    }
    if (error.message) {
      return error.message
    }
  }
  return 'Unable to sign in. Please try again.'
}

const apiErrorMessages: Record<string, string> = {
  not_authenticated: 'You must be signed in to perform this action.',
  forbidden: 'You do not have permission to perform this action.',
  role_forbidden: 'You cannot assign this role.',
  shop_mismatch: 'The target user must belong to your assigned shop.',
  shop_required: 'A shop is required for this role.',
  super_admin_cannot_have_shop: 'Super admin users cannot be assigned to a shop.',
  email_taken: 'An account with this email already exists.',
  password_too_short: 'Password must be at least 6 characters.',
  name_required: 'Full name is required.',
  name_too_long: 'Full name must be 100 characters or fewer.',
  name_invalid: 'Full name must be 1-100 characters.',
  invalid_email: 'Please enter a valid email address.',
  phone_too_long: 'Phone number is too long.',
  invalid_role: 'Invalid role selected.',
  user_not_found: 'User not found.',
  already_onboarded: 'This user has already been onboarded.',
  cannot_deactivate_self: 'You cannot deactivate your own account.',
  empty_items: 'Add at least one product to the sale.',
  negative_payment: 'Amount paid cannot be negative.',
  credit_requires_customer: 'Select a customer for credit sales.',
  product_not_found: 'A product in the sale is no longer available.',
  invalid_quantity: 'Quantity must be at least 1.',
  insufficient_stock: 'Not enough stock for one or more items.',
  overpayment: 'Amount paid cannot exceed the sale total.',
  sale_not_found: 'Sale not found.',
  reason_required: 'A reason is required for this action.',
  customer_not_found: 'Customer not found.',
  invalid_amount: 'Enter an amount greater than zero.',
  exceeds_outstanding: 'Payment cannot exceed the outstanding balance.',
}

export function getApiErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    const code = (error as { code?: string }).code
    if (typeof code === 'string' && apiErrorMessages[code]) {
      return apiErrorMessages[code]
    }
    const message = error.message ?? ''
    if (apiErrorMessages[message]) {
      return apiErrorMessages[message]
    }
    if (message && !/^(fetch|Failed|Network)/i.test(message)) {
      return message
    }
  }
  return 'Something went wrong. Please try again.'
}