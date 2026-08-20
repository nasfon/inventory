import { Suspense, useState } from 'react'
import AppBar from '@mui/material/AppBar'
import Alert from '@mui/material/Alert'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Divider from '@mui/material/Divider'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Toolbar from '@mui/material/Toolbar'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import Logout from '@mui/icons-material/Logout'
import MenuIcon from '@mui/icons-material/Menu'
import NotificationsNone from '@mui/icons-material/NotificationsNone'
import Logo from '../components/ui/Logo'
import StatusBadge from '../components/ui/StatusBadge'
import Loading from '../components/feedback/Loading'
import PlaceholderPage from '../components/feedback/PlaceholderPage'
import { useAuth } from '../hooks/useAuth'
import SidebarContent from './SidebarContent'
import { getNavItems, type PageKey } from './navigation'

const mobileDrawerWidth = 260

export default function DashboardLayout() {
  const { profile, isProfileLoading, profileError, logout } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const [activeKey, setActiveKey] = useState<PageKey>('dashboard')
  const [userMenu, setUserMenu] = useState<HTMLElement | null>(null)
  const [notifMenu, setNotifMenu] = useState<HTMLElement | null>(null)
  const [signingOut, setSigningOut] = useState(false)

  const items = getNavItems(profile?.role)
  const activeItem = items.find((item) => item.key === activeKey) ?? items[0]
  const drawerWidth = collapsed ? 72 : mobileDrawerWidth
  const roleColor =
    profile?.role === 'super_admin' ? 'error' : profile?.role === 'shop_admin' ? 'primary' : 'secondary'

  const handleLogout = async () => {
    setSigningOut(true)
    try {
      await logout()
    } finally {
      setSigningOut(false)
    }
  }

  if (isProfileLoading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loading label="Loading your workspace..." />
      </Box>
    )
  }

  if (!profile) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'background.default',
          p: 2,
        }}
      >
        <Card sx={{ maxWidth: 420, width: '100%', borderRadius: 4 }}>
          <CardContent sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, textAlign: 'center' }}>
            <Logo size={56} />
            <Typography variant="h6" sx={{ mt: 1, fontWeight: 700 }}>
              Account unavailable
            </Typography>
            {profileError ? (
              <Alert severity="error" sx={{ width: '100%', textAlign: 'left', mt: 1 }}>
                {profileError.message}
              </Alert>
            ) : (
              <Typography variant="body2" color="text.secondary">
                Your account has no active profile. Ask an administrator to assign you a role and shop, or sign out.
              </Typography>
            )}
            <Button variant="contained" startIcon={<Logout />} onClick={handleLogout} disabled={signingOut} sx={{ mt: 2 }}>
              Sign out
            </Button>
          </CardContent>
        </Card>
      </Box>
    )
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar
        position="fixed"
        color="inherit"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Toolbar sx={{ gap: 1 }}>
          <Tooltip title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="Toggle sidebar"
              onClick={() => setCollapsed((value) => !value)}
              sx={{ display: { xs: 'none', md: 'inline-flex' } }}
            >
              <MenuIcon />
            </IconButton>
          </Tooltip>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="Open navigation menu"
            onClick={() => setMobileOpen(true)}
            sx={{ display: { xs: 'inline-flex', md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Logo size={32} />
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>
            IMS
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Tooltip title="Notifications">
            <IconButton aria-label="Notifications" onClick={(event) => setNotifMenu(event.currentTarget)}>
              <NotificationsNone />
            </IconButton>
          </Tooltip>
          <IconButton aria-label="Account menu" onClick={(event) => setUserMenu(event.currentTarget)}>
            <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
              {profile.full_name.charAt(0).toUpperCase()}
            </Avatar>
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: mobileDrawerWidth },
          }}
        >
          <SidebarContent
            items={items}
            activeKey={activeKey}
            collapsed={false}
            onNavigate={(key) => {
              setActiveKey(key)
              setMobileOpen(false)
            }}
            onLogout={handleLogout}
            signingOut={signingOut}
          />
        </Drawer>
        <Drawer
          variant="permanent"
          open
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          <SidebarContent
            items={items}
            activeKey={activeKey}
            collapsed={collapsed}
            onNavigate={setActiveKey}
            onLogout={handleLogout}
            signingOut={signingOut}
          />
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{ flexGrow: 1, p: { xs: 2, md: 3 }, width: { md: `calc(100% - ${drawerWidth}px)` } }}
      >
        <Toolbar />
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
          <Typography color="text.secondary">IMS</Typography>
          <Typography color="text.primary" sx={{ fontWeight: 600 }}>
            {activeItem.label}
          </Typography>
        </Breadcrumbs>
        <Suspense fallback={<Loading />}>
          {activeItem.Page ? (
            <activeItem.Page />
          ) : (
            <PlaceholderPage title={activeItem.label} description={activeItem.placeholder ?? ''} />
          )}
        </Suspense>
      </Box>

      <Menu
        anchorEl={notifMenu}
        open={Boolean(notifMenu)}
        onClose={() => setNotifMenu(null)}
        slotProps={{ paper: { sx: { minWidth: 240 } } }}
      >
        <MenuItem disabled>
          <Typography variant="body2" color="text.secondary">
            No notifications yet.
          </Typography>
        </MenuItem>
      </Menu>

      <Menu
        anchorEl={userMenu}
        open={Boolean(userMenu)}
        onClose={() => setUserMenu(null)}
        slotProps={{ paper: { sx: { minWidth: 240 } } }}
      >
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {profile.full_name}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {profile.email}
          </Typography>
          <Box sx={{ mt: 1 }}>
            <StatusBadge label={profile.role.replace('_', ' ')} color={roleColor} />
          </Box>
        </Box>
        <Divider />
        <MenuItem onClick={handleLogout} disabled={signingOut}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </Box>
  )
}