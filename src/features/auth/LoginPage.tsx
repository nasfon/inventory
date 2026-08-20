import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CircularProgress from '@mui/material/CircularProgress'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Typography from '@mui/material/Typography'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import { FormTextField } from '../../components/forms'
import Logo from '../../components/ui/Logo'
import { getAuthErrorMessage } from '../../lib/errors'
import { useAuth } from '../../hooks/useAuth'
import { loginSchema, type LoginFormValues } from './loginSchema'

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const { login } = useAuth()
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = async (values: LoginFormValues) => {
    setErrorMessage(null)
    try {
      await login(values.email, values.password)
    } catch (error) {
      setErrorMessage(getAuthErrorMessage(error))
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(160deg, #eff6ff 0%, #ffffff 100%)',
        p: 2,
      }}
    >
      <Card
        sx={{
          width: '100%',
          maxWidth: 420,
          borderRadius: 4,
          boxShadow: '0 20px 50px -20px rgba(37, 99, 235, 0.35)',
        }}
      >
        <CardContent sx={{ p: { xs: 4, sm: 5 } }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
            <Logo />
            <Typography variant="h5" component="h1" sx={{ mt: 2, fontWeight: 700, color: '#1e293b' }}>
              Company
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Sign in to your account
            </Typography>
          </Box>

          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit(onSubmit)}
            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
          >
            {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
            <FormTextField
              name="email"
              control={control}
              label="Email"
              type="email"
              autoComplete="email"
              autoFocus
            />
            <FormTextField
              name="password"
              control={control}
              label="Password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        onClick={() => setShowPassword((v) => !v)}
                        edge="end"
                        size="small"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={isSubmitting}
              sx={{ mt: 1, py: 1.5, fontSize: '0.95rem', fontWeight: 600, textTransform: 'none' }}
            >
              {isSubmitting ? <CircularProgress size={22} color="inherit" /> : 'Login'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}