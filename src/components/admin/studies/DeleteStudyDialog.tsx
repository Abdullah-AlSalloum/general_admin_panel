'use client';

import { useState, useTransition } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import DeleteIcon from '@mui/icons-material/Delete';
import type { Study } from './StudiesTable';

type Props = {
  study: Study | null;
  onClose: (refresh?: boolean) => void;
};

export default function DeleteStudyDialog({ study, onClose }: Props) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleDelete = () => {
    if (!study) return;
    setError(null);
    startTransition(async () => {
      try {
        const res = await fetch(`/api/admin/studies/${study.id}`, { method: 'DELETE' });
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          if (res.status === 409) {
            setError('لا يمكن حذف هذه الدراسة لأنها مرتبطة بطلبات شراء موجودة.');
          } else {
            setError(body?.error ?? 'حدث خطأ أثناء الحذف، حاول مرة أخرى.');
          }
          return;
        }
        onClose(true);
      } catch {
        setError('تعذّر الاتصال بالخادم، حاول مرة أخرى.');
      }
    });
  };

  return (
    <Dialog open={!!study} onClose={() => onClose()} maxWidth="xs" fullWidth dir="rtl"
      slotProps={{ paper: { sx: { background: 'var(--surface)', color: 'var(--surface-text)', borderRadius: 3 } } }}
    >
      <DialogTitle sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
        <DeleteIcon sx={{ color: '#c0392b' }} />
        حذف الدراسة
      </DialogTitle>

      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
            {error}
          </Alert>
        )}
        <Typography>
          هل أنت متأكد من حذف الدراسة{' '}
          <strong>&quot;{study?.title}&quot;</strong>؟
          <br />
          <Typography component="span" variant="body2" sx={{ opacity: 0.6 }}>
            لا يمكن التراجع عن هذا الإجراء.
          </Typography>
        </Typography>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
        <Button onClick={() => onClose()} disabled={isPending} sx={{ color: 'var(--surface-text)', textTransform: 'none' }}>
          إلغاء
        </Button>
        <Button
          variant="contained"
          onClick={handleDelete}
          disabled={isPending}
          sx={{
            background: '#c0392b',
            borderRadius: 2,
            fontWeight: 700,
            textTransform: 'none',
            minWidth: 90,
            '&:hover': { background: '#a93226' },
          }}
        >
          {isPending ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : 'حذف'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
