'use client';

import { useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { signIn } from 'next-auth/react';
import Image from 'next/image';

export default function AdminLoginForm() {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsPending(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('البريد الإلكتروني أو كلمة المرور غير صحيحة');
        setIsPending(false);
      } else {
        window.location.href = '/admin/analytics';
      }
    } catch {
      setError('حدث خطأ غير متوقع، حاول مرة أخرى');
      setIsPending(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--background)',
        p: 2,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: '100%',
          maxWidth: 420,
          p: { xs: 3, sm: 5 },
          borderRadius: 4,
          background: 'var(--surface)',
          color: 'var(--surface-text)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
        }}
      >
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <Image
              src="/brand/logo-green.png"
              alt="دراسات ستور"
              width={180}
              height={72}
              style={{ height: 72, width: 'auto', objectFit: 'contain' }}
              priority
            />
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 800, mb: 0.5 }}>
            لوحة التحكم
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.6 }}>
            تسجيل الدخول للمتابعة
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.7, display: 'block', mt: 1 }} dir="ltr">
            admin@example.com / Admin@123
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate dir="rtl">
          <TextField
            name="email"
            type="email"
            label="البريد الإلكتروني"
            required
            fullWidth
            autoComplete="email"
            autoFocus
            sx={{ mb: 2 }}
            slotProps={{
              input: { sx: { borderRadius: 2, color: 'var(--surface-text)' } },
              inputLabel: { sx: { color: 'var(--surface-text)', opacity: 0.7 } },
            }}
          />
          <TextField
            name="password"
            type={showPassword ? 'text' : 'password'}
            label="كلمة المرور"
            required
            fullWidth
            autoComplete="current-password"
            sx={{ mb: 3 }}
            slotProps={{
              input: {
                sx: { borderRadius: 2, color: 'var(--surface-text)' },
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(v => !v)}
                      edge="end"
                      aria-label={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
              inputLabel: { sx: { color: 'var(--surface-text)', opacity: 0.7 } },
            }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={isPending}
            sx={{
              py: 1.5,
              borderRadius: 2,
              fontWeight: 700,
              fontSize: '1rem',
              background: 'linear-gradient(135deg, #324d3e, #527a66)',
              '&:hover': { background: 'linear-gradient(135deg, #22382d, #3d6050)' },
              '&:disabled': { opacity: 0.6 },
              textTransform: 'none',
            }}
          >
            {isPending ? <CircularProgress size={22} sx={{ color: '#fff' }} /> : 'تسجيل الدخول'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
