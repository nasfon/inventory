import { lazy, type ComponentType } from 'react'
import type { SvgIconProps } from '@mui/material/SvgIcon'
import AccountBalanceWallet from '@mui/icons-material/AccountBalanceWallet'
import Assessment from '@mui/icons-material/Assessment'
import Dashboard from '@mui/icons-material/Dashboard'
import Group from '@mui/icons-material/Group'
import History from '@mui/icons-material/History'
import Inventory2 from '@mui/icons-material/Inventory2'
import Payments from '@mui/icons-material/Payments'
import People from '@mui/icons-material/People'
import PointOfSale from '@mui/icons-material/PointOfSale'
import ReceiptLong from '@mui/icons-material/ReceiptLong'
import Settings from '@mui/icons-material/Settings'
import Store from '@mui/icons-material/Store'
import type { RoleName } from '../types/auth'
import type { Permission } from '../lib/permissions'
import { can } from '../lib/permissions'

const DashboardPage = lazy(() => import('../features/dashboard/DashboardPage'))
const UsersPage = lazy(() => import('../features/users/UsersPage'))
const ShopsPage = lazy(() => import('../features/shops/ShopsPage'))
const ProductsPage = lazy(() => import('../features/products/ProductsPage'))
const CustomersPage = lazy(() => import('../features/customers/CustomersPage'))
const SalesPage = lazy(() => import('../features/sales/NewSalePage'))
const SalesHistoryPage = lazy(() => import('../features/sales/SalesHistoryPage'))
const CreditBookPage = lazy(() => import('../features/credit/CreditBookPage'))
const AuditLogsPage = lazy(() => import('../features/audit/AuditLogsPage'))
const ExpensesPage = lazy(() => import('../features/expenses/ExpensesPage'))

export type PageKey =
  | 'dashboard'
  | 'products'
  | 'customers'
  | 'sales'
  | 'sales-history'
  | 'credit-book'
  | 'expenses'
  | 'reports'
  | 'audit-logs'
  | 'shops'
  | 'users'
  | 'settings'

export interface NavItem {
  key: PageKey
  label: string
  icon: ComponentType<SvgIconProps>
  permission?: Permission
  Page?: ComponentType<{ onNavigate?: (key: PageKey) => void }>
  placeholder?: string
}

export const navItems: NavItem[] = [
  { key: 'dashboard', label: 'Dashboard', icon: Dashboard, Page: DashboardPage },
  {
    key: 'products',
    label: 'Products',
    icon: Inventory2,
    Page: ProductsPage,
  },
  {
    key: 'customers',
    label: 'Customers',
    icon: People,
    Page: CustomersPage,
  },
  {
    key: 'sales',
    label: 'Sales',
    icon: PointOfSale,
    Page: SalesPage,
  },
  {
    key: 'sales-history',
    label: 'Sales History',
    icon: ReceiptLong,
    Page: SalesHistoryPage,
  },
  {
    key: 'credit-book',
    label: 'Credit Book',
    icon: AccountBalanceWallet,
    permission: 'credit.read',
    Page: CreditBookPage,
  },
  {
    key: 'expenses',
    label: 'Expenses',
    icon: Payments,
    permission: 'expenses.create',
    Page: ExpensesPage,
  },
  {
    key: 'reports',
    label: 'Reports',
    icon: Assessment,
    permission: 'reports.view',
    placeholder: 'Sales, revenue, expenses, credit, and inventory reports are coming soon.',
  },
  {
    key: 'audit-logs',
    label: 'Audit Logs',
    icon: History,
    permission: 'audit_logs.view',
    Page: AuditLogsPage,
  },
  {
    key: 'shops',
    label: 'Shops',
    icon: Store,
    permission: 'shops.manage',
    Page: ShopsPage,
  },
  { key: 'users', label: 'Users', icon: Group, permission: 'users.manage', Page: UsersPage },
  {
    key: 'settings',
    label: 'Settings',
    icon: Settings,
    permission: 'settings.manage',
    placeholder: 'Business settings are coming soon.',
  },
]

export function getNavItems(role?: RoleName | null): NavItem[] {
  if (!role) {
    return navItems.filter((item) => !item.permission)
  }
  return navItems.filter((item) => !item.permission || can(role, item.permission))
}