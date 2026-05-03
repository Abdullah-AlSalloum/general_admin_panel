'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Tooltip from '@mui/material/Tooltip';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useLocale, useTranslations } from 'next-intl';
import { useTheme } from '@mui/material/styles';
import StudyFormDialog from './StudyFormDialog';
import DeleteStudyDialog from './DeleteStudyDialog';

export type StudyTemplateFeRow = { id: string; name: string; amount: string };
export type StudyTemplateOeRow = { id: string; month: number; name: string; amount: string };
export type StudyTemplateSaleRow = { id: string; month: number; amount: string };

export type Study = {
  id: string;
  title: string;
  sector: string;
  price: string;
  oldPrice?: string | null;
  status: 'PUBLISHED' | 'COMING_SOON' | 'DRAFT';
  shortDescription: string | null;
  coverImage: string | null;
  fileUrl: string | null;
  deliverables: string[];
  studyFoundingExpenses: StudyTemplateFeRow[];
  studyOperatingExpenses: StudyTemplateOeRow[];
  studySales: StudyTemplateSaleRow[];
  createdAt: string;
};

export default function StudiesTable() {
  const t = useTranslations('studies');
  const tSector = useTranslations('UsedDevices');
  const locale = useLocale();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [studies, setStudies] = useState<Study[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Study | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Study | null>(null);
  const [statusFilter, setStatusFilter] = useState<'ALL' | Study['status']>('ALL');
  const [sectorFilter, setSectorFilter] = useState<string>('ALL');
  const [priceMinFilter, setPriceMinFilter] = useState('');
  const [priceMaxFilter, setPriceMaxFilter] = useState('');

  const fetchStudies = useCallback(async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const res = await fetch('/api/admin/studies');
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setFetchError(err.error || 'تعذر تحميل الدراسات');
        return;
      }
      const json = await res.json();
      setStudies(Array.isArray(json.data) ? json.data : []);
    } catch {
      setFetchError('تعذر الاتصال بالخادم');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStudies();
  }, [fetchStudies]);

  const handleAdd = () => {
    setEditTarget(null);
    setFormOpen(true);
  };

  const handleEdit = (study: Study) => {
    setEditTarget(study);
    setFormOpen(true);
  };

  const handleDeleteClick = (study: Study) => {
    setDeleteTarget(study);
  };

  const handleFormClose = (refresh?: boolean) => {
    setFormOpen(false);
    setEditTarget(null);
    if (refresh) fetchStudies();
  };

  const handleDeleteClose = (refresh?: boolean) => {
    setDeleteTarget(null);
    if (refresh) fetchStudies();
  };

  const sectorOptions = useMemo(() => {
    return Array.from(new Set(studies.map((s) => s.sector))).sort((a, b) => a.localeCompare(b));
  }, [studies]);

  const filteredStudies = useMemo(() => {
    const min = priceMinFilter.trim() === '' ? null : Number(priceMinFilter);
    const max = priceMaxFilter.trim() === '' ? null : Number(priceMaxFilter);
    const hasMin = min !== null && Number.isFinite(min);
    const hasMax = max !== null && Number.isFinite(max);

    return studies.filter((study) => {
      if (statusFilter !== 'ALL' && study.status !== statusFilter) return false;
      if (sectorFilter !== 'ALL' && study.sector !== sectorFilter) return false;

      const price = Number(study.price);
      if (hasMin && price < (min as number)) return false;
      if (hasMax && price > (max as number)) return false;

      return true;
    });
  }, [studies, statusFilter, sectorFilter, priceMinFilter, priceMaxFilter]);

  const countSummary =
    filteredStudies.length === studies.length
      ? t.has('countSummary')
        ? t('countSummary', { count: studies.length })
        : locale === 'en'
          ? `Total studies: ${studies.length}`
          : `إجمالي الدراسات: ${studies.length}`
      : t.has('countFilteredSummary')
        ? t('countFilteredSummary', { visible: filteredStudies.length, total: studies.length })
        : locale === 'en'
          ? `Showing ${filteredStudies.length} of ${studies.length}`
          : `الظاهر: ${filteredStudies.length} من أصل ${studies.length}`;

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2, mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, color: 'var(--surface-text)' }}>
            {t('title')}
          </Typography>
          <Typography variant="body2" sx={{ mt: 0.75, color: 'text.secondary', fontWeight: 600 }}>
            {countSummary}
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAdd}
          sx={{
            background: 'linear-gradient(135deg, #324d3e, #527a66)',
            borderRadius: 2,
            fontWeight: 700,
            textTransform: 'none',
            '&:hover': { background: 'linear-gradient(135deg, #22382d, #3d6050)' },
          }}
        >
          {t('add')}
        </Button>
      </Box>

      {/* Table */}
      <Paper sx={{ background: 'var(--surface)', borderRadius: 3, overflow: 'hidden', boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }}>
        <Box
          sx={{
            p: { xs: 1.5, sm: 2 },
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, minmax(0, 1fr))' },
            gap: 1.5,
            borderBottom: '1px solid',
            borderColor: 'rgba(128,128,128,0.15)',
            background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(50,77,62,0.03)',
            ...(locale === 'en' && { direction: 'ltr' }),
          }}
        >
          <FormControl size="small" fullWidth>
            <InputLabel id="status-filter-label">{t('filterStatus')}</InputLabel>
            <Select
              labelId="status-filter-label"
              value={statusFilter}
              label={t('filterStatus')}
              onChange={(e) => setStatusFilter(e.target.value as 'ALL' | Study['status'])}
            >
              <MenuItem value="ALL">{t('filterAll')}</MenuItem>
              <MenuItem value="PUBLISHED">{t('published')}</MenuItem>
              <MenuItem value="COMING_SOON">{t('comingSoon')}</MenuItem>
              <MenuItem value="DRAFT">{t('draft')}</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" fullWidth>
            <InputLabel id="sector-filter-label">{t('filterSector')}</InputLabel>
            <Select
              labelId="sector-filter-label"
              value={sectorFilter}
              label={t('filterSector')}
              onChange={(e) => setSectorFilter(e.target.value)}
            >
              <MenuItem value="ALL">{t('filterAll')}</MenuItem>
              {sectorOptions.map((sector) => (
                <MenuItem key={sector} value={sector}>
                  {tSector.has(sector) ? tSector(sector as Parameters<typeof tSector>[0]) : sector}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            size="small"
            type="number"
            label={t('filterPriceFrom')}
            value={priceMinFilter}
            onChange={(e) => setPriceMinFilter(e.target.value)}
            slotProps={{ htmlInput: { min: 0, style: { MozAppearance: 'textfield', textAlign: locale !== 'en' ? 'right' : 'left' } } }}
            sx={{ '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': { display: 'none' } }}
          />

          <TextField
            size="small"
            type="number"
            label={t('filterPriceTo')}
            value={priceMaxFilter}
            onChange={(e) => setPriceMaxFilter(e.target.value)}
            slotProps={{ htmlInput: { min: 0, style: { MozAppearance: 'textfield', textAlign: locale !== 'en' ? 'right' : 'left' } } }}
            sx={{ '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': { display: 'none' } }}
          />
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress sx={{ color: '#324d3e' }} />
          </Box>
        ) : fetchError ? (
          <Box sx={{ textAlign: 'center', py: 8, color: 'error.main' }}>
            <Typography>{fetchError}</Typography>
          </Box>
        ) : studies.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8, color: 'var(--surface-text)', opacity: 0.5 }}>
            <Typography>{t('empty')}</Typography>
          </Box>
        ) : filteredStudies.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8, color: 'var(--surface-text)', opacity: 0.65 }}>
            <Typography>لا توجد نتائج مطابقة للفلاتر الحالية</Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ '& th': { fontWeight: 700, color: 'var(--surface-text)', borderColor: 'rgba(128,128,128,0.15)', background: 'rgba(50,77,62,0.06)' } }}>
                  <TableCell sx={{ width: 72 }}>{t('colNumber')}</TableCell>
                  <TableCell>{t('colTitle')}</TableCell>
                  <TableCell>{t('colSector')}</TableCell>
                  <TableCell>{t('colPrice')}</TableCell>
                  <TableCell>{t('colStatus')}</TableCell>
                  <TableCell>{t('colDate')}</TableCell>
                  <TableCell align="center">{t('colActions')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredStudies.map((study, index) => (
                  <TableRow
                    key={study.id}
                    sx={{
                      '& td': { color: 'var(--surface-text)', borderColor: 'rgba(128,128,128,0.1)' },
                      '&:hover': { background: 'rgba(50,77,62,0.04)' },
                    }}
                  >
                    <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>{index + 1}</TableCell>
                    <TableCell sx={{ maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {study.title}
                    </TableCell>
                    <TableCell>{tSector.has(study.sector) ? tSector(study.sector as Parameters<typeof tSector>[0]) : study.sector}</TableCell>
                    <TableCell>${Number(study.price).toLocaleString('en-US')}</TableCell>
                    <TableCell>
                      {(() => {
                        const isPublished = study.status === 'PUBLISHED';
                        const isComingSoon = study.status === 'COMING_SOON';
                        const label = isPublished ? t('published') : isComingSoon ? t('comingSoon') : t('draft');
                        const background = isPublished
                          ? (isDark ? 'rgba(108,173,138,0.24)' : 'rgba(50,77,62,0.15)')
                          : isComingSoon
                            ? (isDark ? 'rgba(102,153,255,0.24)' : 'rgba(53,102,214,0.13)')
                            : (isDark ? 'rgba(255,193,7,0.2)' : 'rgba(180,140,0,0.13)');
                        const color = isPublished
                          ? (isDark ? '#dff7ea' : '#324d3e')
                          : isComingSoon
                            ? (isDark ? '#d9e7ff' : '#244a99')
                            : (isDark ? '#ffd54f' : '#7a6200');

                        return (
                      <Chip
                        label={label}
                        size="small"
                        sx={{
                          fontWeight: 700,
                          background,
                          color,
                        }}
                      />
                        );
                      })()}
                    </TableCell>
                    <TableCell>
                      {new Date(study.createdAt).toLocaleDateString('en-US')}
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title={t('edit')}>
                        <IconButton size="small" onClick={() => handleEdit(study)} sx={{ color: isDark ? '#8dc6a8' : '#324d3e' }}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={t('delete')}>
                        <IconButton size="small" onClick={() => handleDeleteClick(study)} sx={{ color: '#c0392b' }}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      <StudyFormDialog open={formOpen} study={editTarget} onClose={handleFormClose} />
      <DeleteStudyDialog study={deleteTarget} onClose={handleDeleteClose} />
    </Box>
  );
}
