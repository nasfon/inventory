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
import Settings from '@mui/icons-material/Settings'
import Store from '@mui/icons-material/Store'
import type { RoleName } from '../types/auth'

const DashboardPage = lazy(() => import('../features/dashboard/DashboardPage'))
const UsersPage = lazy(() => import('../features/users/UsersPage'))
const ShopsPage = lazy(() => import('../features/shops/ShopsPage'))
const ProductsPage = lazy(() => import('../features/products/ProductsPage'))
const CustomersPage = lazy(() => import('../features/customers/CustomersPage'))
const SalesPage = lazy(() => import('../features/sales/NewSalePage'))
const CreditBookPage = lazy(() => import('../features/credit/CreditBookPage'))

export type PageKey =
  | 'dashboard'
  | 'products'
  | 'customers'
  | 'sales'
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
  roles?: RoleName[]
  Page?: ComponentType
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
    key: 'credit-book',
    label: 'Credit Book',
    icon: AccountBalanceWallet,
    roles: ['super_admin', 'shop_admin'],
    Page: CreditBookPage,
  },
  {
    key: 'expenses',
    label: 'Expenses',
    icon: Payments,
    roles: ['super_admin', 'shop_admin'],
    placeholder: 'Expense recording is coming soon.',
  },
  {
    key: 'reports',
    label: 'Reports',
    icon: Assessment,
    roles: ['super_admin', 'shop_admin'],
    placeholder: 'Sales, revenue, expenses, credit, and inventory reports are coming soon.',
  },
  {
    key: 'audit-logs',
    label: 'Audit Logs',
    icon: History,
    roles: ['super_admin', 'shop_admin'],
    placeholder: 'The audit log viewer is coming soon.',
  },
  {
    key: 'shops',
    label: 'Shops',
    icon: Store,
    roles: ['super_admin'],
    Page: ShopsPage,
  },
  { key: 'users', label: 'Users', icon: Group, roles: ['super_admin', 'shop_admin'], Page: UsersPage },
  {
    key: 'settings',
    label: 'Settings',
    icon: Settings,
    roles: ['super_admin'],
    placeholder: 'Business settings are coming soon.',
  },
]

export function getNavItems(role?: RoleName | null): NavItem[] {
  if (!role) {
    return navItems.filter((item) => !item.roles)
  }
  return navItems.filter((item) => !item.roles || item.roles.includes(role))
}