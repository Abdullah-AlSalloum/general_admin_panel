'use client';

import { useState, useTransition } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ImageIcon from '@mui/icons-material/Image';
import ClearIcon from '@mui/icons-material/Clear';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Divider from '@mui/material/Divider';
import { useTheme } from '@mui/material/styles';
import { CldUploadWidget } from '@/lib/cloudinary';
import type { CloudinaryUploadWidgetResults } from '@/lib/cloudinary';
import type { Study, StudyTemplateFeRow, StudyTemplateOeRow, StudyTemplateSaleRow } from './StudiesTable';

import { useTranslations } from 'next-intl';
import { formatNumberInput, parseFormattedNumber, limitNumberInput } from '@/lib/numberFormatter';
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
if (!UPLOAD_PRESET) {
  console.warn('[StudyFormDialog] Missing env variable: NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET');
}

const SECTORS = [
  { value: 'FOOD' },
  { value: 'INDUSTRIAL' },
  { value: 'SERVICE' },
  { value: 'COMMERCIAL' },
  { value: 'TECH' },
  { value: 'OTHER' },
];

const empty = {
  title: '',
  sector: 'FOOD',
  price: '',
  oldPrice: '',
  status: 'DRAFT',
  shortDescription: '',
  coverImage: '',
  fileUrl: '',
  deliverables: [] as string[],
  templateFoundingExpenses: [] as StudyTemplateFeRow[],
  templateOperatingExpenses: [] as StudyTemplateOeRow[],
  templateSales: [] as StudyTemplateSaleRow[],
};

type Props = {
  open: boolean;
  study: Study | null;
  onClose: (refresh?: boolean) => void;
};

function UploadField({
  label,
  value,
  icon,
  accept,
  onUpload,
  onClear,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  accept: 'image' | 'raw';
  onUpload: (url: string) => void;
  onClear: () => void;
}) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const accent = isDark ? '#8dc6a8' : '#324d3e';

  return (
    <Box
      sx={{
        border: '1.5px dashed',
        borderColor: value
          ? (isDark ? 'rgba(141,198,168,0.65)' : '#324d3e')
          : (isDark ? 'rgba(220,236,228,0.25)' : 'rgba(128,128,128,0.35)'),
        borderRadius: 2,
        p: 2,
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        background: value
          ? (isDark ? 'rgba(141,198,168,0.12)' : 'rgba(50,77,62,0.06)')
          : 'transparent',
        minHeight: 64,
      }}
    >
      <Box
        sx={{
          color: value ? accent : 'var(--surface-text)',
          opacity: value ? 1 : (isDark ? 0.75 : 0.45),
          flexShrink: 0,
        }}
      >
        {icon}
      </Box>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="caption" sx={{ opacity: isDark ? 0.85 : 0.6, display: 'block', color: 'var(--surface-text)' }}>
          {label}
        </Typography>
        {value ? (
          <Typography
            variant="body2"
            sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: accent, fontWeight: 700 }}
          >
            {value.split('/').pop()}
          </Typography>
        ) : (
          <Typography variant="body2" sx={{ opacity: isDark ? 0.82 : 0.5, color: 'var(--surface-text)' }}>لم يتم الرفع بعد</Typography>
        )}
      </Box>
      <Box sx={{ display: 'flex', gap: 0.5, flexShrink: 0 }}>
        {value && (
          <IconButton size="small" onClick={onClear} sx={{ color: '#c0392b' }}>
            <ClearIcon fontSize="small" />
          </IconButton>
        )}
        <CldUploadWidget
          uploadPreset={UPLOAD_PRESET}
          options={{
            resourceType: accept === 'raw' ? 'raw' : 'image',
            clientAllowedFormats: accept === 'raw' ? ['pdf'] : ['jpg', 'jpeg', 'png', 'webp'],
            sources: ['local', 'google_drive', 'url', 'dropbox'],
            multiple: false,
            language: 'ar',
          }}
          onSuccess={(result: CloudinaryUploadWidgetResults) => {
            const info = result?.info;
            if (info && typeof info === 'object' && 'secure_url' in info) {
              onUpload(info.secure_url as string);
            }
          }}
        >
          {({ open }) => (
            <Button
              size="small"
              variant="outlined"
              onClick={() => open()}
              sx={{
                borderColor: accent,
                color: accent,
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                '&:hover': {
                  background: isDark ? 'rgba(141,198,168,0.14)' : 'rgba(50,77,62,0.08)',
                  borderColor: accent,
                },
              }}
            >
              <CloudUploadIcon sx={{ fontSize: 18 }} />
              {value ? 'تغيير' : 'رفع'}
            </Button>
          )}
        </CldUploadWidget>
      </Box>
    </Box>
  );
}

export default function StudyFormDialog({ open, study, onClose }: Props) {
  const tSector = useTranslations('UsedDevices');
  const [form, setForm] = useState(empty);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [newDeliverable, setNewDeliverable] = useState('');
  const [newFe, setNewFe] = useState({ name: '', amount: '' });
  const [newOe, setNewOe] = useState({ month: '1', name: '', amount: '' });
  const [newSale, setNewSale] = useState({ month: '1', amount: '' });

  // Sync form with study/open changes during rendering (React derived-state pattern)
  const [prevStudy, setPrevStudy] = useState(study);
  const [prevOpen, setPrevOpen] = useState(open);
  if (study !== prevStudy || open !== prevOpen) {
    setPrevStudy(study);
    setPrevOpen(open);
    setForm(study ? {
      title: study.title,
      sector: study.sector,
      price: study.price,
      oldPrice: study.oldPrice ?? '',
      status: study.status,
      shortDescription: study.shortDescription ?? '',
      coverImage: study.coverImage ?? '',
      fileUrl: study.fileUrl ?? '',
      deliverables: study.deliverables ?? [],
      templateFoundingExpenses: study.studyFoundingExpenses ?? [],
      templateOperatingExpenses: study.studyOperatingExpenses ?? [],
      templateSales: study.studySales ?? [],
    } : empty);
    setError(null);
    setNewDeliverable('');
    setNewFe({ name: '', amount: '' });
    setNewOe({ month: '1', name: '', amount: '' });
    setNewSale({ month: '1', amount: '' });
  }

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = () => {
    if (!form.title.trim()) { setError('العنوان مطلوب'); return; }
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) < 0) { setError('السعر غير صحيح'); return; }
    if (Number(form.price) > 999999.99) { setError('السعر لا يمكن أن يتجاوز 999,999.99'); return; }

    startTransition(async () => {
      setError(null);
      try {
        const url = study ? `/api/admin/studies/${study.id}` : '/api/admin/studies';
        const method = study ? 'PATCH' : 'POST';
        const res = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: form.title.trim(),
            sector: form.sector,
            price: Number(form.price),
            oldPrice: form.oldPrice ? Number(form.oldPrice) : null,
            status: form.status,
            shortDescription: form.shortDescription.trim() || null,
            coverImage: form.coverImage || null,
            fileUrl: form.fileUrl || null,
            deliverables: form.deliverables,
            templateFoundingExpenses: form.templateFoundingExpenses.map((r) => ({ name: r.name, amount: Number(r.amount) })),
            templateOperatingExpenses: form.templateOperatingExpenses.map((r) => ({ month: r.month, name: r.name, amount: Number(r.amount) })),
            templateSales: form.templateSales.map((r) => ({ month: r.month, amount: Number(r.amount) })),
          }),
        });
        if (!res.ok) {
          const { error } = await res.json();
          setError(error ?? 'حدث خطأ');
          return;
        }
        onClose(true);
      } catch {
        setError('حدث خطأ في الاتصال');
      }
    });
  };

  const fieldSx = {
    '& .MuiInputLabel-root': { color: 'var(--surface-text)', opacity: 0.7 },
    '& .MuiOutlinedInput-root': { borderRadius: 2, color: 'var(--surface-text)' },
  };

  return (
    <Dialog open={open} onClose={() => onClose()} maxWidth="md" fullWidth dir="rtl"
      slotProps={{ paper: { sx: { background: 'var(--surface)', color: 'var(--surface-text)', borderRadius: 3, width: { md: 920 } } } }}
    >
      <DialogTitle sx={{ fontWeight: 700 }}>
        {study ? 'تعديل الدراسة' : 'إضافة دراسة جديدة'}
      </DialogTitle>

      <DialogContent dividers sx={{ borderColor: 'rgba(128,128,128,0.15)' }}>
        {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}

        <Grid container spacing={2} sx={{ mt: 0 }}>
          {/* Title */}
          <Grid size={12}>
            <TextField label="عنوان الدراسة" fullWidth required value={form.title} onChange={set('title')} sx={fieldSx} />
          </Grid>

          {/* Sector + Status */}
          <Grid size={6}>
            <FormControl fullWidth sx={fieldSx}>
              <InputLabel sx={{ color: 'var(--surface-text)', opacity: 0.7 }}>القطاع</InputLabel>
              <Select value={form.sector} label="القطاع" onChange={(e) => setForm((f) => ({ ...f, sector: e.target.value }))}
                sx={{ borderRadius: 2, color: 'var(--surface-text)' }}>
                {SECTORS.map((s) => <MenuItem key={s.value} value={s.value}>{tSector(s.value as Parameters<typeof tSector>[0])}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={6}>
            <FormControl fullWidth sx={fieldSx}>
              <InputLabel sx={{ color: 'var(--surface-text)', opacity: 0.7 }}>الحالة</InputLabel>
              <Select value={form.status} label="الحالة" onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                sx={{ borderRadius: 2, color: 'var(--surface-text)' }}>
                <MenuItem value="DRAFT">مسودة</MenuItem>
                <MenuItem value="COMING_SOON">قريبا</MenuItem>
                <MenuItem value="PUBLISHED">منشور</MenuItem>
              </Select>
            </FormControl>
          </Grid>


          {/* Price */}
          <Grid size={6}>
            <TextField 
              label="السعر ($)" 
              type="text" 
              inputMode="numeric"
              fullWidth 
              required 
              value={form.price ? formatNumberInput(form.price) : ''} 
              onChange={(e) => {
                const limited = limitNumberInput(e.target.value);
                setForm((f) => ({ ...f, price: limited }));
              }}
              sx={fieldSx} 
            />
          </Grid>
          {/* Old price */}
          <Grid size={6}>
            <TextField
              label="السعر القديم ($) — اختياري"
              type="text"
              inputMode="numeric"
              fullWidth
              value={form.oldPrice ? formatNumberInput(String(form.oldPrice)) : ''}
              onChange={(e) => {
                const limited = limitNumberInput(e.target.value);
                setForm((f) => ({ ...f, oldPrice: limited }));
              }}
              sx={fieldSx}
            />
          </Grid>
          {/* Short description */}
          <Grid size={12}>
            <TextField
              label="وصف مختصر"
              fullWidth
              multiline
              rows={3}
              value={form.shortDescription}
              onChange={set('shortDescription')}
              sx={fieldSx}
              slotProps={{ htmlInput: { maxLength: 1500 } }}
            />
          </Grid>

          {/* Cover image upload */}
          <Grid size={12}>
            <UploadField
              label="صورة الغلاف"
              value={form.coverImage}
              icon={<ImageIcon />}
              accept="image"
              onUpload={(url) => setForm((f) => ({ ...f, coverImage: url }))}
              onClear={() => setForm((f) => ({ ...f, coverImage: '' }))}
            />
          </Grid>

          {/* PDF upload */}
          <Grid size={12}>
            <UploadField
              label="خطة التسويق (PDF)"
              value={form.fileUrl}
              icon={<PictureAsPdfIcon />}
              accept="raw"
              onUpload={(url) => setForm((f) => ({ ...f, fileUrl: url }))}
              onClear={() => setForm((f) => ({ ...f, fileUrl: '' }))}
            />
          </Grid>
          {/* Deliverables */}
          <Grid size={12}>
            <Typography variant="body2" sx={{ fontWeight: 700, color: 'var(--surface-text)', mb: 1 }}>محتويات الدراسة</Typography>            <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
              <TextField
                size="small"
                fullWidth
                placeholder="أضف بنداً..."
                value={newDeliverable}
                onChange={(e) => setNewDeliverable(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    const v = newDeliverable.trim();
                    if (v && form.deliverables.length < 20) {
                      setForm((f) => ({ ...f, deliverables: [...f.deliverables, v] }));
                      setNewDeliverable('');
                    }
                  }
                }}
                sx={fieldSx}
              />
              <IconButton
                onClick={() => {
                  const v = newDeliverable.trim();
                  if (v && form.deliverables.length < 20) {
                    setForm((f) => ({ ...f, deliverables: [...f.deliverables, v] }));
                    setNewDeliverable('');
                  }
                }}
                sx={{ bgcolor: '#324d3e', color: '#fff', borderRadius: 2, '&:hover': { bgcolor: '#22382d' } }}
              >
                <AddIcon />
              </IconButton>
            </Box>
            {form.deliverables.length === 0 && (
              <Typography variant="caption" sx={{ color: 'var(--surface-text)', opacity: 0.4 }}>سيتم استخدام القائمة الافتراضية إن تركت هذا فارغاً</Typography>
            )}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              {form.deliverables.map((d, i) => (
                <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1, bgcolor: 'rgba(50,77,62,0.06)', borderRadius: 1.5, px: 1.5, py: 0.75 }}>
                  <Typography variant="body2" sx={{ flex: 1, color: 'var(--surface-text)', fontSize: 13 }}>{d}</Typography>
                  <IconButton size="small" onClick={() => setForm((f) => ({ ...f, deliverables: f.deliverables.filter((_, j) => j !== i) }))} sx={{ color: '#c0392b', p: 0.25 }}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              ))}
            </Box>
          </Grid>

          {/* ── Template Data Sections ── */}
          <Grid size={12}><Divider sx={{ my: 1 }}><Typography variant="caption" sx={{ opacity: 0.5, px: 1 }}>البيانات الافتراضية للمشروع</Typography></Divider></Grid>

          {/* Template Founding Expenses */}
          <Grid size={12}>
            <Accordion disableGutters elevation={0} sx={{ border: '1px solid rgba(128,128,128,0.2)', borderRadius: '8px !important', '&:before': { display: 'none' } }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>تكاليف التأسيس ({form.templateFoundingExpenses.length} بند)</Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ pt: 0 }}>
                <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                  <TextField size="small" placeholder="اسم البند" value={newFe.name} onChange={(e) => setNewFe((p) => ({ ...p, name: e.target.value }))} sx={{ ...fieldSx, flex: 2 }} />
                    <TextField size="small" placeholder="المبلغ" type="text" inputMode="numeric" value={newFe.amount ? formatNumberInput(newFe.amount) : ''} onChange={(e) => setNewFe((p) => ({ ...p, amount: limitNumberInput(e.target.value) }))} sx={{ ...fieldSx, flex: 1 }} />
                  <IconButton
                    onClick={() => {
                      const name = newFe.name.trim();
                      const amount = newFe.amount;
                      if (!name || !amount || isNaN(Number(amount)) || Number(amount) < 0) return;
                      setForm((f) => ({ ...f, templateFoundingExpenses: [...f.templateFoundingExpenses, { id: `new-${Date.now()}`, name, amount }] }));
                      setNewFe({ name: '', amount: '' });
                    }}
                    sx={{ bgcolor: '#324d3e', color: '#fff', borderRadius: 2, '&:hover': { bgcolor: '#22382d' } }}
                  ><AddIcon /></IconButton>
                </Box>
                {form.templateFoundingExpenses.length === 0 && (
                  <Typography variant="caption" sx={{ opacity: 0.4 }}>لا توجد بنود بعد</Typography>
                )}
                {form.templateFoundingExpenses.map((r, i) => (
                  <Box key={r.id} sx={{ display: 'flex', alignItems: 'center', gap: 1, bgcolor: 'rgba(50,77,62,0.06)', borderRadius: 1.5, px: 1.5, py: 0.5, mb: 0.5 }}>
                    <Typography variant="body2" sx={{ flex: 2, fontSize: 13 }}>{r.name}</Typography>
                    <Typography variant="body2" sx={{ flex: 1, fontSize: 13, opacity: 0.7 }}>{Number(r.amount).toLocaleString()}</Typography>
                    <IconButton size="small" onClick={() => setForm((f) => ({ ...f, templateFoundingExpenses: f.templateFoundingExpenses.filter((_, j) => j !== i) }))} sx={{ color: '#c0392b', p: 0.25 }}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
              </AccordionDetails>
            </Accordion>
          </Grid>

          {/* Template Operating Expenses */}
          <Grid size={12}>
            <Accordion disableGutters elevation={0} sx={{ border: '1px solid rgba(128,128,128,0.2)', borderRadius: '8px !important', '&:before': { display: 'none' } }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>تكاليف التشغيل الشهرية ({form.templateOperatingExpenses.length} بند)</Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ pt: 0 }}>
                <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                  <TextField size="small" placeholder="الشهر" type="number" value={newOe.month} onChange={(e) => setNewOe((p) => ({ ...p, month: e.target.value }))} sx={{ ...fieldSx, width: 70 }} />
                  <TextField size="small" placeholder="اسم البند" value={newOe.name} onChange={(e) => setNewOe((p) => ({ ...p, name: e.target.value }))} sx={{ ...fieldSx, flex: 2 }} />
                    <TextField size="small" placeholder="المبلغ" type="text" inputMode="numeric" value={newOe.amount ? formatNumberInput(newOe.amount) : ''} onChange={(e) => setNewOe((p) => ({ ...p, amount: limitNumberInput(e.target.value) }))} sx={{ ...fieldSx, flex: 1 }} />
                  <IconButton
                    onClick={() => {
                      const month = parseInt(newOe.month);
                      const name = newOe.name.trim();
                      const amount = newOe.amount;
                      if (!name || !amount || isNaN(month) || month < 1 || isNaN(Number(amount)) || Number(amount) < 0) return;
                      setForm((f) => ({ ...f, templateOperatingExpenses: [...f.templateOperatingExpenses, { id: `new-${Date.now()}`, month, name, amount }] }));
                      setNewOe((p) => ({ ...p, name: '', amount: '' }));
                    }}
                    sx={{ bgcolor: '#324d3e', color: '#fff', borderRadius: 2, '&:hover': { bgcolor: '#22382d' } }}
                  ><AddIcon /></IconButton>
                </Box>
                {form.templateOperatingExpenses.length === 0 && (
                  <Typography variant="caption" sx={{ opacity: 0.4 }}>لا توجد بنود بعد</Typography>
                )}
                {form.templateOperatingExpenses.map((r, i) => (
                  <Box key={r.id} sx={{ display: 'flex', alignItems: 'center', gap: 1, bgcolor: 'rgba(50,77,62,0.06)', borderRadius: 1.5, px: 1.5, py: 0.5, mb: 0.5 }}>
                    <Typography variant="body2" sx={{ width: 60, fontSize: 12, opacity: 0.6 }}>ش {r.month}</Typography>
                    <Typography variant="body2" sx={{ flex: 2, fontSize: 13 }}>{r.name}</Typography>
                    <Typography variant="body2" sx={{ flex: 1, fontSize: 13, opacity: 0.7 }}>{Number(r.amount).toLocaleString()}</Typography>
                    <IconButton size="small" onClick={() => setForm((f) => ({ ...f, templateOperatingExpenses: f.templateOperatingExpenses.filter((_, j) => j !== i) }))} sx={{ color: '#c0392b', p: 0.25 }}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
              </AccordionDetails>
            </Accordion>
          </Grid>

          {/* Template Sales */}
          <Grid size={12}>
            <Accordion disableGutters elevation={0} sx={{ border: '1px solid rgba(128,128,128,0.2)', borderRadius: '8px !important', '&:before': { display: 'none' } }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>المبيعات الشهرية ({form.templateSales.length} بند)</Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ pt: 0 }}>
                <Box sx={{ display: 'flex', gap: 1, mb: 1, alignItems: 'flex-start' }}>
                  <TextField
                    size="small"
                    placeholder="الشهر"
                    type="number"
                    value={newSale.month}
                    onChange={(e) => {
                      const v = e.target.value;
                      if (v === '' || /^\d+$/.test(v)) setNewSale((p) => ({ ...p, month: v }));
                    }}
                    sx={{ ...fieldSx, width: 70 }}
                    slotProps={{ htmlInput: { min: 1 } }}
                  />
                  <TextField
                    size="small"
                    placeholder="المبلغ"
                    type="text"
                    inputMode="numeric"
                    value={newSale.amount ? formatNumberInput(newSale.amount) : ''}
                    onChange={(e) => {
                        const limited = limitNumberInput(e.target.value);
                        setNewSale((p) => ({ ...p, amount: limited }));
                    }}
                    error={newSale.amount !== '' && isNaN(parseFormattedNumber(newSale.amount))}
                    sx={{ ...fieldSx, flex: 1 }}
                  />
                  <IconButton
                    onClick={() => {
                      const month = parseInt(newSale.month);
                      const amount = newSale.amount;
                      if (!amount || isNaN(month) || month < 1 || isNaN(Number(amount)) || Number(amount) < 0) {
                        setError('يرجى إدخال رقم الشهر والمبلغ بشكل صحيح في المبيعات الشهرية');
                        return;
                      }
                      setError(null);
                      setForm((f) => ({ ...f, templateSales: [...f.templateSales, { id: `new-${Date.now()}`, month, amount }] }));
                      setNewSale((p) => ({ ...p, amount: '' }));
                    }}
                    sx={{ bgcolor: '#324d3e', color: '#fff', borderRadius: 2, '&:hover': { bgcolor: '#22382d' }, mt: 0.25 }}
                  ><AddIcon /></IconButton>
                </Box>
                {form.templateSales.length === 0 && (
                  <Typography variant="caption" sx={{ opacity: 0.4 }}>لا توجد بنود بعد</Typography>
                )}
                {form.templateSales.map((r, i) => (
                  <Box key={r.id} sx={{ display: 'flex', alignItems: 'center', gap: 1, bgcolor: 'rgba(50,77,62,0.06)', borderRadius: 1.5, px: 1.5, py: 0.5, mb: 0.5 }}>
                    <Typography variant="body2" sx={{ width: 60, fontSize: 12, opacity: 0.6 }}>ش {r.month}</Typography>
                    <Typography variant="body2" sx={{ flex: 1, fontSize: 13, opacity: 0.7 }}>{Number(r.amount).toLocaleString()}</Typography>
                    <IconButton size="small" onClick={() => setForm((f) => ({ ...f, templateSales: f.templateSales.filter((_, j) => j !== i) }))} sx={{ color: '#c0392b', p: 0.25 }}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
              </AccordionDetails>
            </Accordion>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
        <Button onClick={() => onClose()} disabled={isPending} sx={{ color: 'var(--surface-text)', textTransform: 'none' }}>
          إلغاء
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={isPending}
          sx={{
            background: 'linear-gradient(135deg, #324d3e, #527a66)',
            borderRadius: 2,
            fontWeight: 700,
            textTransform: 'none',
            minWidth: 110,
            '&:hover': { background: 'linear-gradient(135deg, #22382d, #3d6050)' },
          }}
        >
          {isPending ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : study ? 'حفظ التعديلات' : 'إضافة'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
