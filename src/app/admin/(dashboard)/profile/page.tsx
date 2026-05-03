'use client';
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import LockIcon from '@mui/icons-material/Lock';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { signOut } from 'next-auth/react';

const cardSx = {
  background: 'var(--surface)',
  borderRadius: 3,
  boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
  p: 3,
  mb: 3,
};

const fieldSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: 2,
    '& fieldset': { borderColor: 'rgba(82,122,102,0.35)' },
    '&:hover fieldset': { borderColor: '#527a66' },
    '&.Mui-focused fieldset': { borderColor: '#324d3e' },
  },
  '& .MuiInputLabel-root.Mui-focused': { color: '#324d3e' },
};

const btnPrimary = {
  background: 'linear-gradient(135deg, #324d3e, #527a66)',
  borderRadius: 2,
  fontWeight: 700,
  textTransform: 'none' as const,
  '&:hover': { background: 'linear-gradient(135deg, #22382d, #3d6050)' },
  '&:disabled': { opacity: 0.6 },
};

export default function ProfilePage() {
  const [user, setUser] = useState<{ name: string; email: string; createdAt: string } | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [editing, setEditing] = useState(false);
  const [nameVal, setNameVal] = useState('');
  const [savingInfo, setSavingInfo] = useState(false);
  const [infoMsg, setInfoMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const [pwOpen, setPwOpen] = useState(false);
  const [pw, setPw] = useState({ current: '', next: '', repeat: '' });
  const [showPw, setShowPw] = useState({ current: false, next: false, repeat: false });
  const [savingPw, setSavingPw] = useState(false);
  const [pwMsg, setPwMsg] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    (async () => {
      setLoadingUser(true);
      try {
        const res = await fetch('/api/admin/profile');
        const data = await res.json();
        if (data.ok) {
          setUser(data.user);
          setNameVal(data.user.name ?? '');
        } else {
          setFetchError(data.error || 'تعذر تحميل بيانات الملف الشخصي');
        }
      } catch {
        setFetchError('تعذر الاتصال بالخادم');
      } finally {
        setLoadingUser(false);
      }
    })();
  }, []);

  async function handleInfoSave(e: React.FormEvent) {
    e.preventDefault();
    const trimmedName = nameVal.trim();
    if (!trimmedName) {
      setInfoMsg({ ok: false, text: 'الاسم لا يمكن أن يكون فارغاً' });
      return;
    }
    if (trimmedName.length > 100) {
      setInfoMsg({ ok: false, text: 'الاسم لا يتجاوز 100 حرف' });
      return;
    }
    setSavingInfo(true);
    setInfoMsg(null);
    try {
      const res = await fetch('/api/admin/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: trimmedName }),
      });
      const data = await res.json();
      if (data.ok) {
        setUser(u => u ? { ...u, name: trimmedName } : u);
        setNameVal(trimmedName);
        setEditing(false);
        setInfoMsg({ ok: true, text: 'تم حفظ التغييرات بنجاح' });
        window.dispatchEvent(new CustomEvent('admin-profile-updated', {
          detail: { name: trimmedName, email: user?.email ?? '' },
        }));
      } else {
        setInfoMsg({ ok: false, text: data.error || 'حدث خطأ' });
      }
    } catch {
      setInfoMsg({ ok: false, text: 'تعذر الاتصال بالخادم' });
    } finally {
      setSavingInfo(false);
    }
  }

  async function handlePwSave(e: React.FormEvent) {
    e.preventDefault();
    if (pw.next !== pw.repeat) {
      setPwMsg({ ok: false, text: 'كلمتا المرور الجديدتان غير متطابقتين' });
      return;
    }
    setSavingPw(true);
    setPwMsg(null);
    try {
      const res = await fetch('/api/admin/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: user?.name ?? nameVal, currentPassword: pw.current, newPassword: pw.next }),
      });
      const data = await res.json();
      if (data.ok) {
        setPwMsg({ ok: true, text: 'تم تغيير كلمة المرور بنجاح' });
        setPw({ current: '', next: '', repeat: '' });
        setPwOpen(false);
        if (data.passwordChanged) {
          await signOut({ callbackUrl: '/admin/login' });
        }
      } else {
        setPwMsg({ ok: false, text: data.error || 'حدث خطأ' });
      }
    } catch {
      setPwMsg({ ok: false, text: 'تعذر الاتصال بالخادم' });
    } finally {
      setSavingPw(false);
    }
  }

  if (loadingUser) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <CircularProgress sx={{ color: '#324d3e' }} />
      </Box>
    );
  }

  if (fetchError) {
    return (
      <Box sx={{ p: { xs: 2, sm: 3 }, maxWidth: 560, mx: 'auto' }}>
        <Alert severity="error" sx={{ borderRadius: 2 }}>{fetchError}</Alert>
      </Box>
    );
  }

  const initial = (user?.name ?? 'A').charAt(0).toUpperCase();
  const joinedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' })
    : '';

  return (
    <Box sx={{ p: { xs: 2, sm: 3 }, maxWidth: 560, mx: 'auto' }}>
      <Typography variant="h5" sx={{ fontWeight: 700, color: 'var(--surface-text)', mb: 3 }}>
        الملف الشخصي
      </Typography>

      {/* Avatar card */}
      <Paper sx={{ ...cardSx, display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4 }}>
        <Avatar sx={{ width: 72, height: 72, bgcolor: '#324d3e', fontSize: 32, color: '#fff' }}>
          {initial}
        </Avatar>
        <Typography variant="h6" sx={{ mt: 2, fontWeight: 700, color: 'var(--surface-text)' }}>{user?.name}</Typography>
        <Typography variant="body2" sx={{ color: 'var(--surface-text)', opacity: 0.6 }}>{user?.email}</Typography>
        {joinedDate && (
          <Typography variant="caption" sx={{ color: 'var(--surface-text)', opacity: 0.45, mt: 0.5 }}>
            عضو منذ {joinedDate}
          </Typography>
        )}
      </Paper>

      {/* Info card */}
      <Paper sx={cardSx}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'var(--surface-text)' }}>المعلومات الشخصية</Typography>
          {!editing && (
            <Button size="small" startIcon={<EditIcon />} onClick={() => { setEditing(true); setInfoMsg(null); }}
              sx={{ color: '#527a66', fontWeight: 700, textTransform: 'none' }}>
              تعديل
            </Button>
          )}
        </Box>

        {infoMsg && <Alert severity={infoMsg.ok ? 'success' : 'error'} sx={{ mb: 2, borderRadius: 2 }}>{infoMsg.text}</Alert>}

        <Divider sx={{ borderColor: 'rgba(128,128,128,0.1)', mb: 2 }} />

        <Box component="form" onSubmit={handleInfoSave} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {editing ? (
            <TextField label="الاسم" value={nameVal} onChange={e => setNameVal(e.target.value)} required fullWidth size="small" sx={fieldSx} slotProps={{ htmlInput: { maxLength: 100 } }} helperText={`${nameVal.length}/100`} />
          ) : (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
              <Typography variant="body2" sx={{ color: 'var(--surface-text)', opacity: 0.55 }}>الاسم</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600, color: 'var(--surface-text)' }}>{user?.name}</Typography>
            </Box>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
            <Typography variant="body2" sx={{ color: 'var(--surface-text)', opacity: 0.55 }}>البريد الإلكتروني</Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: 'var(--surface-text)', direction: 'ltr' }}>{user?.email}</Typography>
          </Box>

          {editing && (
            <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'flex-end', mt: 1 }}>
              <Button variant="outlined" startIcon={<CloseIcon />} onClick={() => { setEditing(false); setNameVal(user?.name ?? ''); }}
                sx={{ borderRadius: 2, fontWeight: 700, textTransform: 'none', borderColor: 'rgba(82,122,102,0.4)', color: '#527a66' }}>
                إلغاء
              </Button>
              <Button type="submit" variant="contained" startIcon={savingInfo ? <CircularProgress size={14} color="inherit" /> : <SaveIcon />}
                disabled={savingInfo} sx={btnPrimary}>
                حفظ
              </Button>
            </Box>
          )}
        </Box>
      </Paper>

      {/* Password card */}
      <Paper sx={cardSx}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'var(--surface-text)', display: 'flex', alignItems: 'center', gap: 1 }}>
            <LockIcon fontSize="small" sx={{ color: '#527a66' }} /> كلمة المرور
          </Typography>
          {!pwOpen && (
            <Button size="small" onClick={() => { setPwOpen(true); setPwMsg(null); }}
              sx={{ color: '#527a66', fontWeight: 700, textTransform: 'none' }}>
              تغيير
            </Button>
          )}
        </Box>

        {pwMsg && <Alert severity={pwMsg.ok ? 'success' : 'error'} sx={{ mb: 2, borderRadius: 2 }}>{pwMsg.text}</Alert>}

        {pwOpen ? (
          <Box component="form" onSubmit={handlePwSave} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField type={showPw.current ? 'text' : 'password'} label="كلمة المرور الحالية" value={pw.current}
              onChange={e => setPw(p => ({ ...p, current: e.target.value }))} required fullWidth size="small" sx={fieldSx}
              slotProps={{ input: { endAdornment: <InputAdornment position="end"><IconButton edge="end" onClick={() => setShowPw(s => ({ ...s, current: !s.current }))} aria-label={showPw.current ? 'إخفاء كلمة المرور الحالية' : 'إظهار كلمة المرور الحالية'}>{showPw.current ? <VisibilityOff /> : <Visibility />}</IconButton></InputAdornment> } }} />
            <TextField type={showPw.next ? 'text' : 'password'} label="كلمة المرور الجديدة (8 أحرف على الأقل)" value={pw.next}
              onChange={e => setPw(p => ({ ...p, next: e.target.value }))} required fullWidth size="small" sx={fieldSx}
              slotProps={{ input: { endAdornment: <InputAdornment position="end"><IconButton edge="end" onClick={() => setShowPw(s => ({ ...s, next: !s.next }))} aria-label={showPw.next ? 'إخفاء كلمة المرور الجديدة' : 'إظهار كلمة المرور الجديدة'}>{showPw.next ? <VisibilityOff /> : <Visibility />}</IconButton></InputAdornment> } }} />
            <TextField type={showPw.repeat ? 'text' : 'password'} label="تأكيد كلمة المرور الجديدة" value={pw.repeat}
              onChange={e => setPw(p => ({ ...p, repeat: e.target.value }))} required fullWidth size="small" sx={fieldSx}
              slotProps={{ input: { endAdornment: <InputAdornment position="end"><IconButton edge="end" onClick={() => setShowPw(s => ({ ...s, repeat: !s.repeat }))} aria-label={showPw.repeat ? 'إخفاء تأكيد كلمة المرور' : 'إظهار تأكيد كلمة المرور'}>{showPw.repeat ? <VisibilityOff /> : <Visibility />}</IconButton></InputAdornment> } }} />
            <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'flex-end', mt: 1 }}>
              <Button variant="outlined" startIcon={<CloseIcon />}
                onClick={() => { setPwOpen(false); setPw({ current: '', next: '', repeat: '' }); }}
                sx={{ borderRadius: 2, fontWeight: 700, textTransform: 'none', borderColor: 'rgba(82,122,102,0.4)', color: '#527a66' }}>
                إلغاء
              </Button>
              <Button type="submit" variant="contained" startIcon={savingPw ? <CircularProgress size={14} color="inherit" /> : <LockIcon />}
                disabled={savingPw} sx={btnPrimary}>
                تغيير كلمة المرور
              </Button>
            </Box>
          </Box>
        ) : (
          <Typography variant="body2" sx={{ color: 'var(--surface-text)', opacity: 0.4, letterSpacing: 3 }}>••••••••</Typography>
        )}
      </Paper>
    </Box>
  );
}
