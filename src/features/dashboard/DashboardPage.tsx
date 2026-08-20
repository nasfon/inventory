import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Logo from '../../components/ui/Logo'
import StatusBadge from '../../components/ui/StatusBadge'
import { useAuth } from '../../hooks/useAuth'

export default function DashboardPage() {
  const { profile } = useAuth()
  const role = profile?.role
  const roleColor = role === 'super_admin' ? 'error' : role === 'shop_admin' ? 'primary' : 'secondary'

  return (
    <Box>
      <Card sx={{ maxWidth: 560, mx: 'auto', mt: 4, borderRadius: 4 }}>
        <CardContent
          sx={{
            p: { xs: 3, sm: 4 },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 1,
            textAlign: 'center',
          }}
        >
          <Logo size={56} />
          <Typography variant="h5" component="h1" sx={{ mt: 1, fontWeight: 700 }}>
            Welcome back, {profile?.full_name}
          </Typography>
          {role && <StatusBadge label={role.replace('_', ' ')} color={roleColor} />}
          <Typography variant="body2" color="text.secondary">
            Your dashboard overview, statistics, and quick actions will appear here in a later phase.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  )
}