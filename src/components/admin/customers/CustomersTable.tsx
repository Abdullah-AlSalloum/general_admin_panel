'use client';

import { useEffect, useState, useCallback } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Collapse from '@mui/material/Collapse';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { useTheme } from '@mui/material/styles';
import { useTranslations } from 'next-intl';

type Project = {
  id: string;
  name: string;
  brand?: string | null;
  sector: string;
  createdAt: string;
  study: { title: string; price: string };
  paidAmount?: string | null;
};

type Customer = {
  id: string;
  name: string | null;
  surname: string | null;
  email: string;
  phone: string | null;
  country: string | null;
  city: string | null;
  gender: string | null;
  emailVerified: boolean;
  createdAt: string;
  projects: Project[];
};

function getGenderLabel(gender: string | null, t: ReturnType<typeof useTranslations>) {
  if (!gender) return t('genderUnknown');
  const normalized = gender.trim().toLowerCase();
  if (normalized === 'male' || normalized === 'ذكر') return t('genderMale');
  if (normalized === 'female' || normalized === 'أنثى') return t('genderFemale');
  return t('genderUnknown');
}

function CustomerRow({ customer, rowNumber, t, tSector, isDark }: { customer: Customer; rowNumber: number; t: ReturnType<typeof useTranslations>; tSector: ReturnType<typeof useTranslations>; isDark: boolean }) {
  const [open, setOpen] = useState(false);
  const fullName = [customer.name, customer.surname].filter(Boolean).join(' ') || '—';
  const canExpand = customer.projects.length > 0;

  return (
    <>
      <TableRow
        onClick={() => canExpand && setOpen((o) => !o)}
        sx={{
          cursor: canExpand ? 'pointer' : 'default',
          '& td': { color: isDark ? 'rgba(236,247,241,0.96)' : 'var(--surface-text)', borderColor: 'rgba(128,128,128,0.1)' },
          '&:hover': canExpand ? { background: 'rgba(50,77,62,0.06)' } : {},
        }}
      >
        <TableCell sx={{ fontWeight: 700, textAlign: 'center' }}>{rowNumber}</TableCell>
        <TableCell sx={{ fontWeight: 600, textAlign: 'center' }}>{fullName}</TableCell>
        <TableCell sx={{ direction: 'ltr', fontSize: '0.85rem', textAlign: 'center' }}>{customer.email}</TableCell>
        <TableCell sx={{ direction: 'ltr', textAlign: 'center' }}>{customer.phone ? customer.phone.replace(/^\+/, '00') : '—'}</TableCell>
        <TableCell sx={{ textAlign: 'center' }}>{customer.country ?? '—'}</TableCell>
        <TableCell sx={{ textAlign: 'center' }}>{customer.city ?? '—'}</TableCell>
        <TableCell sx={{ textAlign: 'center' }}>{getGenderLabel(customer.gender, t)}</TableCell>
        <TableCell sx={{ textAlign: 'center' }}>
          <Chip
            size="small"
            icon={customer.emailVerified ? <CheckCircleIcon sx={{ fontSize: '14px !important' }} /> : <HighlightOffIcon sx={{ fontSize: '14px !important' }} />}
            label={customer.emailVerified ? t('verified') : t('unverified')}
            sx={{
              fontWeight: 700,
              background: customer.emailVerified
                ? (isDark ? 'rgba(108,173,138,0.24)' : 'rgba(50,77,62,0.15)')
                : (isDark ? 'rgba(255,122,89,0.2)' : 'rgba(180,50,0,0.1)'),
              color: customer.emailVerified
                ? (isDark ? '#dff7ea' : '#324d3e')
                : (isDark ? '#ffd3c7' : '#b03000'),
            }}
          />
        </TableCell>
        <TableCell sx={{ textAlign: 'center' }}>
          <Chip
            size="small"
            label={customer.projects.length}
            sx={{
              fontWeight: 700,
              background: isDark ? 'rgba(108,173,138,0.2)' : 'rgba(82,122,102,0.15)',
              color: isDark ? '#e6f8ef' : '#324d3e',
              minWidth: 32,
            }}
          />
        </TableCell>
        <TableCell sx={{ textAlign: 'center' }}>{new Date(customer.createdAt).toLocaleDateString('en-US')}</TableCell>
        <TableCell align="center" sx={{ width: 40 }}>
          {canExpand && (
            <KeyboardArrowDownIcon
              fontSize="small"
              sx={{
                color: isDark ? '#8dc6a8' : '#527a66',
                transition: 'transform 0.2s',
                transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
              }}
            />
          )}
        </TableCell>
      </TableRow>

      {/* Expandable projects sub-table */}
      <TableRow>
        <TableCell colSpan={11} sx={{ p: 0, border: 0 }}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ mx: 2, my: 1.5, borderRadius: 2, overflow: 'hidden', border: '1px solid rgba(82,122,102,0.2)', background: 'rgba(50,77,62,0.03)' }}>
              <Typography
                variant="caption"
                sx={{
                  display: 'block',
                  fontWeight: 700,
                  color: isDark ? '#9ed2b8' : '#527a66',
                  px: 2,
                  pt: 1.5,
                  pb: 0.5,
                  textAlign: 'left',
                }}
              >
                {t('projects')}
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ '& th': { fontWeight: 700, color: 'var(--surface-text)', opacity: 0.7, fontSize: '0.75rem', background: 'rgba(50,77,62,0.05)' } }}>
                    <TableCell align="left">{t('colProjectName')}</TableCell>
                    <TableCell align="left">{t('colStudy')}</TableCell>
                    <TableCell align="left">{t('colSector')}</TableCell>
                     <TableCell align="left">{t('colBrand')}</TableCell>
                    <TableCell align="left">{t('colPrice')}</TableCell>
                    <TableCell align="left">{t('colDate')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {customer.projects.map((p) => (
                    <TableRow key={p.id} sx={{ '& td': { color: 'var(--surface-text)', borderColor: 'rgba(128,128,128,0.08)', fontSize: '0.82rem' } }}>
                      <TableCell align="left">{p.name}</TableCell>
                      <TableCell align="left" sx={{ maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.study.title}</TableCell>
                      <TableCell align="left">{tSector.has(p.sector) ? tSector(p.sector as Parameters<typeof tSector>[0]) : p.sector}</TableCell>
                      <TableCell align="left">{p.brand ?? '—'}</TableCell>
                      <TableCell align="left" sx={{ direction: 'ltr' }}>${Number(p.paidAmount ?? p.study.price).toLocaleString('en-US')}</TableCell>
                      <TableCell align="left">{new Date(p.createdAt).toLocaleDateString('en-US')}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

export default function CustomersTable() {
  const t = useTranslations('customers');
  const tSector = useTranslations('UsedDevices');
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/customers');
      if (!res.ok) throw new Error('request failed');
      const json = await res.json();
      setCustomers(json.data);
    } catch {
      setError(t('errorLoad'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: 'var(--surface-text)' }}>
          {t('title')}
        </Typography>
        {!loading && !error && (
          <Typography variant="body2" sx={{ mt: 0.75, color: 'text.secondary', fontWeight: 600 }}>
            {t('countSummary', { count: customers.length })}
          </Typography>
        )}
      </Box>

      <Paper sx={{ background: 'var(--surface)', borderRadius: 3, overflow: 'hidden', boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress sx={{ color: '#324d3e' }} />
          </Box>
        ) : error ? (
          <Box sx={{ p: 3 }}>
            <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>
          </Box>
        ) : customers.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8, color: 'var(--surface-text)', opacity: 0.5 }}>
            <Typography>{t('empty')}</Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ '& th': { fontWeight: 700, color: 'var(--surface-text)', borderColor: 'rgba(128,128,128,0.15)', background: 'rgba(50,77,62,0.06)' } }}>
                  <TableCell sx={{ textAlign: 'center' }}>{t('colNumber')}</TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>{t('colName')}</TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>{t('colEmail')}</TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>{t('colPhone')}</TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>{t('colCountry')}</TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>{t('colCity')}</TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>{t('colGender')}</TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>{t('colVerified')}</TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>{t('colProjects')}</TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>{t('colJoined')}</TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {customers.map((c, index) => (
                  <CustomerRow key={c.id} customer={c} rowNumber={index + 1} t={t} tSector={tSector} isDark={isDark} />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Box>
  );
}
