'use client';

import { useEffect, useState, useCallback } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import RefreshIcon from '@mui/icons-material/Refresh';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EmailIcon from '@mui/icons-material/Email';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import DownloadIcon from '@mui/icons-material/Download';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import * as XLSX from 'xlsx';
import { useTranslations } from 'next-intl';
import { useTheme } from '@mui/material/styles';

type ContactStatus = 'NEW' | 'REPLIED' | 'CLOSED';

type Contact = {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  country: string | null;
  message: string;
  status: ContactStatus;
  createdAt: string;
};

const STATUS_CONFIG: Record<ContactStatus, { color: string; bg: string; icon: React.ReactNode }> = {
  NEW: { color: '#4fc3f7', bg: 'rgba(79,195,247,0.15)', icon: <EmailIcon sx={{ fontSize: 14 }} /> },
  REPLIED: { color: '#1e8449', bg: 'rgba(30,132,73,0.1)', icon: <CheckCircleIcon sx={{ fontSize: 14 }} /> },
  CLOSED: { color: '#7f8c8d', bg: 'rgba(127,140,141,0.1)', icon: <CancelIcon sx={{ fontSize: 14 }} /> },
};

const STATUS_T_KEYS: Record<ContactStatus, 'statusNew' | 'statusReplied' | 'statusClosed'> = {
  NEW: 'statusNew',
  REPLIED: 'statusReplied',
  CLOSED: 'statusClosed',
};

const formatEnNumber = (value: number) => new Intl.NumberFormat('en-US').format(value);

const formatArDateWithEnDigits = (value: string) => (
  new Intl.DateTimeFormat('en-US-u-nu-latn', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(value))
);

function StatusChip({ status, onUpdate }: { status: ContactStatus; onUpdate: (s: ContactStatus) => void }) {
  const t = useTranslations('contacts');
  const [anchor, setAnchor] = useState<null | HTMLElement>(null);
  const cfg = STATUS_CONFIG[status];
  const label = t(STATUS_T_KEYS[status]);

  return (
    <>
      <Chip
        label={label}
        icon={cfg.icon as React.ReactElement}
        size="small"
        deleteIcon={<ExpandMoreIcon sx={{ fontSize: '14px !important' }} />}
        onDelete={(e) => setAnchor(e.currentTarget)}
        onClick={(e) => setAnchor(e.currentTarget)}
        sx={{
          fontWeight: 700,
          color: cfg.color,
          background: cfg.bg,
          cursor: 'pointer',
          minWidth: 112,
          height: 30,
          '& .MuiChip-icon': { color: cfg.color, ml: 0.2, mr: 0.5 },
          '& .MuiChip-label': { px: 0.8 },
          '& .MuiChip-deleteIcon': { mr: 0.2, ml: 0.2 },
        }}
      />
      <Menu anchorEl={anchor} open={!!anchor} onClose={() => setAnchor(null)} dir="rtl">
        {(Object.keys(STATUS_CONFIG) as ContactStatus[]).map((s) => (
          <MenuItem
            key={s}
            selected={s === status}
            onClick={() => { onUpdate(s); setAnchor(null); }}
            sx={{ gap: 1 }}
          >
            {STATUS_CONFIG[s].icon}
            <Typography variant="body2">{t(STATUS_T_KEYS[s])}</Typography>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

function ContactCard({ contact, onStatusChange, onDelete }: { contact: Contact; onStatusChange: (id: string, status: ContactStatus) => void; onDelete: (id: string) => void }) {
  const t = useTranslations('contacts');
  const [confirmOpen, setConfirmOpen] = useState(false);
  return (
    <Paper
      elevation={0}
      sx={{
        background: contact.status === 'NEW' ? 'var(--surface)' : 'rgba(128,128,128,0.04)',
        border: '1px solid',
        borderColor: contact.status === 'NEW' ? 'rgba(79,195,247,0.3)' : 'rgba(128,128,128,0.12)',
        borderRadius: 3,
        p: 3,
        transition: 'border-color 0.2s',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap', mb: 1.5 }}>
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'var(--surface-text)' }}>
            {contact.fullName}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 0.5 }}>
            <Typography variant="caption" sx={{ color: 'var(--surface-text)', opacity: 0.6 }} dir="ltr">
              {contact.email}
            </Typography>
            {contact.phone && (
              <Typography variant="caption" sx={{ color: 'var(--surface-text)', opacity: 0.6 }} dir="ltr">
                {contact.phone?.replace(/^\+/, '00')}
              </Typography>
            )}
            {contact.country && (
              <Typography variant="caption" sx={{ color: 'var(--surface-text)', opacity: 0.6 }}>
                {contact.country}
              </Typography>
            )}
          </Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexShrink: 0, position: 'relative' }}>
          <Typography variant="caption" sx={{ opacity: 0.45, color: 'var(--surface-text)' }}>
            {formatArDateWithEnDigits(contact.createdAt)}
          </Typography>
          <StatusChip status={contact.status} onUpdate={(s) => onStatusChange(contact.id, s)} />
          <Tooltip title={t('delete')}>
            <IconButton size="small" onClick={() => setConfirmOpen(true)} sx={{ color: 'error.main', opacity: 0.7, '&:hover': { opacity: 1 } }}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          {confirmOpen && (
            <Paper elevation={3} sx={{ position: 'absolute', zIndex: 10, top: '100%', left: 0, p: 2, borderRadius: 2, minWidth: 220, background: 'var(--surface)' }}>
              <Typography variant="body2" sx={{ mb: 1.5, fontWeight: 600 }}>{t('deleteConfirm')}</Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button size="small" variant="contained" color="error" onClick={() => { setConfirmOpen(false); onDelete(contact.id); }} sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700 }}>{t('delete')}</Button>
                <Button size="small" variant="outlined" onClick={() => setConfirmOpen(false)} sx={{ borderRadius: 2, textTransform: 'none', color: 'var(--surface-text)', borderColor: 'rgba(128,128,128,0.3)' }}>{t('cancel')}</Button>
              </Box>
            </Paper>
          )}
        </Box>
      </Box>
      <Divider sx={{ borderColor: 'rgba(128,128,128,0.1)', mb: 1.5 }} />
      <Typography variant="body2" sx={{ color: 'var(--surface-text)', lineHeight: 1.8, whiteSpace: 'pre-wrap', opacity: 0.85 }}>
        {contact.message}
      </Typography>
    </Paper>
  );
}

type Filter = 'ALL' | ContactStatus;

type ContactsInboxProps = {
  apiPath?: string;
  title?: string;
};

export default function ContactsInbox({
  apiPath = '/api/admin/contacts',
  title,
}: ContactsInboxProps) {
  const t = useTranslations('contacts');
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>('ALL');
  const [search, setSearch] = useState('');
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const fetchContacts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(apiPath);
      if (!res.ok) throw new Error('request failed');
      const json = await res.json();
      setContacts(json.data);
    } catch {
      setError(t('errorLoad'));
    } finally {
      setLoading(false);
    }
  }, [apiPath, t]);

  useEffect(() => { fetchContacts(); }, [fetchContacts]);

  const handleStatusChange = async (id: string, status: ContactStatus) => {
    setContacts((prev) => prev.map((c) => c.id === id ? { ...c, status } : c));
    try {
      const res = await fetch(apiPath, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      if (!res.ok) throw new Error('request failed');
    } catch {
      setError(t('errorUpdateStatus'));
      fetchContacts();
    }
  };

  const handleDelete = async (id: string) => {
    setContacts((prev) => prev.filter((c) => c.id !== id));
    try {
      const res = await fetch(apiPath, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error('request failed');
    } catch {
      setError(t('errorDelete'));
      fetchContacts();
    }
  };

  const normalizedSearch = search.trim().toLowerCase();
  const filtered = contacts.filter((c) => {
    const passStatus = filter === 'ALL' || c.status === filter;
    const passSearch =
      normalizedSearch.length === 0 ||
      c.fullName.toLowerCase().includes(normalizedSearch) ||
      c.email.toLowerCase().includes(normalizedSearch);
    return passStatus && passSearch;
  });
  const allCount = contacts.length;
  const newCount = contacts.filter((c) => c.status === 'NEW').length;
  const repliedCount = contacts.filter((c) => c.status === 'REPLIED').length;
  const closedCount = contacts.filter((c) => c.status === 'CLOSED').length;

  const handleExportExcel = () => {
    const rows = filtered.map((c) => ({
      [t('excelName')]: c.fullName,
      [t('excelEmail')]: c.email,
      [t('excelPhone')]: c.phone ?? '-',
      [t('excelCountry')]: c.country ?? '-',
      [t('excelMessage')]: c.message,
      [t('excelStatus')]: t(STATUS_T_KEYS[c.status]),
      [t('excelDate')]: formatArDateWithEnDigits(c.createdAt),
    }));

    const sheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, sheet, 'Contacts');
    XLSX.writeFile(workbook, `contacts-${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  const filterBtns: { key: Filter; label: string }[] = [
    { key: 'ALL', label: `${t('filterAll')} (${formatEnNumber(allCount)})` },
    { key: 'NEW', label: `${t('statusNew')} (${formatEnNumber(newCount)})` },
    { key: 'REPLIED', label: `${t('statusReplied')} (${formatEnNumber(repliedCount)})` },
    { key: 'CLOSED', label: `${t('statusClosed')} (${formatEnNumber(closedCount)})` },
  ];

  const isExportDisabled = !hasMounted || filtered.length === 0;

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: 'var(--surface-text)' }}>
            {title ?? t('title')}
          </Typography>
          {newCount > 0 && (
            <Chip label={formatEnNumber(newCount)} size="small" sx={{ background: isDark ? 'rgba(79,195,247,0.2)' : '#1a5276', color: isDark ? '#4fc3f7' : '#fff', fontWeight: 700, height: 22 }} />
          )}
        </Box>
        <Tooltip title={t('refresh')}>
          <IconButton onClick={fetchContacts} sx={{ color: isDark ? '#8dc6a8' : '#324d3e' }}>
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Filter tabs */}
      <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
        {filterBtns.map(({ key, label }) => (
          <Button
            key={key}
            size="small"
            variant={filter === key ? 'contained' : 'outlined'}
            onClick={() => setFilter(key)}
            sx={{
              borderRadius: 5,
              textTransform: 'none',
              fontWeight: 600,
              ...(filter === key
                ? { background: 'linear-gradient(135deg, #324d3e, #527a66)', '&:hover': { background: 'linear-gradient(135deg, #22382d, #3d6050)' } }
                : { borderColor: 'rgba(128,128,128,0.3)', color: 'var(--surface-text)', '&:hover': { background: 'rgba(50,77,62,0.06)' } }),
            }}
          >
            {label}
          </Button>
        ))}
      </Box>

      <Box sx={{ display: 'flex', gap: 1.5, mb: 3, flexWrap: 'wrap' }}>
        <TextField
          size="small"
          placeholder={t('searchPlaceholder')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ minWidth: { xs: '100%', sm: 320 }, '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
          slotProps={{
            input: {
              startAdornment: <SearchIcon sx={{ fontSize: 18, mr: 1, opacity: 0.6 }} />,
            },
          }}
        />
        <Button
          onClick={handleExportExcel}
          variant="outlined"
          startIcon={<DownloadIcon />}
          disabled={isExportDisabled}
          sx={{
            borderRadius: 3,
            textTransform: 'none',
            fontWeight: 600,
            borderColor: isDark ? 'rgba(141,198,168,0.45)' : 'rgba(50,77,62,0.45)',
            color: isDark ? '#8dc6a8' : '#324d3e',
            '&:hover': { borderColor: isDark ? '#8dc6a8' : '#324d3e', background: isDark ? 'rgba(141,198,168,0.08)' : 'rgba(50,77,62,0.06)' },
          }}
        >
          {t('exportExcel')}
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {/* Content */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress sx={{ color: '#324d3e' }} />
        </Box>
      ) : filtered.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 10, color: 'var(--surface-text)', opacity: 0.4 }}>
          <EmailIcon sx={{ fontSize: 56, mb: 1 }} />
          <Typography>{t('empty')}</Typography>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {filtered.map((contact) => (
            <ContactCard key={contact.id} contact={contact} onStatusChange={handleStatusChange} onDelete={handleDelete} />
          ))}
        </Box>
      )}
    </Box>
  );
}
