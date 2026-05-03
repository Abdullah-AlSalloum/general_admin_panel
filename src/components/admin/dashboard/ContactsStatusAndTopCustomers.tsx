'use client';

import type { FC } from 'react';
import type { ApexOptions } from 'apexcharts';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useTranslations, useLocale } from 'next-intl';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

interface TopCustomer {
  id: string;
  name: string | null;
  email: string;
  orders: number;
  spend: number;
  lastOrderAt: Date | string | null;
}

const ContactsStatusAndTopCustomers: FC = () => {
  const t = useTranslations('reports');
  const locale = useLocale();
  const [currentPage, setCurrentPage] = useState(0);

  // Contact Status State
  const [statusSeries, setStatusSeries] = useState<number[]>([0, 0, 0]);
  const [statusLoading, setStatusLoading] = useState(true);

  // Top Customers State
  const [topCustomers, setTopCustomers] = useState<TopCustomer[]>([]);
  const [customersLoading, setCustomersLoading] = useState(true);

  // Fetch contact status data
  useEffect(() => {
    const fetchContactsStatus = async () => {
      try {
        const response = await fetch('/api/admin/reports/contacts-status');
        if (!response.ok) throw new Error('Failed to fetch contacts status');
        const data = await response.json();
        setStatusSeries(data.series);
      } catch (error) {
        console.error('Error fetching contacts status:', error);
        // Keep fallback values on error
      } finally {
        setStatusLoading(false);
      }
    };
    fetchContactsStatus();
  }, []);

  // Fetch top customers data
  useEffect(() => {
    const fetchTopCustomers = async () => {
      try {
        const response = await fetch('/api/admin/reports/top-customers');
        if (!response.ok) throw new Error('Failed to fetch top customers');
        const data = await response.json();
        setTopCustomers(data.customers);
      } catch (error) {
        console.error('Error fetching top customers:', error);
        // Keep empty array on error
      } finally {
        setCustomersLoading(false);
      }
    };
    fetchTopCustomers();
  }, []);

  const rowsPerPage = 6;
  const totalPages = Math.ceil(topCustomers.length / rowsPerPage);
  const startIdx = currentPage * rowsPerPage;
  const endIdx = startIdx + rowsPerPage;
  const displayedCustomers = topCustomers.slice(startIdx, endIdx);

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 0));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));
  };

  // In RTL (Arabic), swap arrow directions
  const PrevIcon = locale === 'ar' ? ChevronRightIcon : ChevronLeftIcon;
  const NextIcon = locale === 'ar' ? ChevronLeftIcon : ChevronRightIcon;

  const statusOptions: ApexOptions = {
    chart: { type: 'donut', toolbar: { show: false }, foreColor: 'var(--surface-text)' },
    labels: [t('statusNew'), t('statusReplied'), t('statusClosed')],
    colors: ['#1a5276', '#1e8449', '#7f8c8d'],
    stroke: { width: 0 },
    dataLabels: { enabled: false },
    legend: { position: 'bottom', labels: { colors: 'var(--surface-text)' }, fontSize: '14' },
    tooltip: { theme: 'dark' },
    plotOptions: { pie: { donut: { size: '70%' } } },
  };

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: '1fr', lg: '1fr 1.4fr', xl: '1fr 1.4fr' },
        gap: 3,
        alignItems: 'start',
      }}
    >
      <Paper sx={{ background: 'var(--surface)', color: 'var(--surface-text)', borderRadius: 3, p: { xs: 1.5, sm: 2, md: 3 }, boxShadow: '0 6px 18px rgba(0, 0, 0, 0.25)' }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, fontSize: { xs: '0.95rem', sm: '1rem', md: '1.1rem' } }}>
          {t('contactsTitle')}
        </Typography>
        {statusLoading ? (
          <Typography sx={{ p: 2, textAlign: 'center', color: 'var(--surface-text)', opacity: 0.7 }}>
            Loading...
          </Typography>
        ) : (
          <Chart options={statusOptions} series={statusSeries} type="donut" height={280} />
        )}
      </Paper>

      <Paper sx={{ background: 'var(--surface)', color: 'var(--surface-text)', borderRadius: 3, p: { xs: 1.5, sm: 2, md: 2.5 }, boxShadow: '0 4px 16px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', height: 380 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, fontSize: { xs: '0.95rem', sm: '1rem', md: '1.1rem' } }}>
          {t('topCustomersTitle')}
        </Typography>
        <TableContainer sx={{ flex: 1, overflowY: 'auto', overflowX: 'auto' }}>
          <Table size="small" sx={{ minWidth: { xs: 600, sm: 'auto' } }}>
            <TableHead>
              <TableRow sx={{ '& th': { fontWeight: 700, borderColor: 'rgba(128,128,128,0.15)', background: 'rgba(50,77,62,0.06)', color: 'var(--surface-text)', fontSize: { xs: '0.7rem', sm: '0.85rem' } } }}>
                <TableCell>{t('colCustomer')}</TableCell>
                <TableCell>{t('colEmail')}</TableCell>
                <TableCell align="right">{t('colOrders')}</TableCell>
                <TableCell align="right">{t('colSpend')}</TableCell>
                <TableCell align="right">{t('colLastOrder')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {customersLoading ? (
                <TableRow>
                  <TableCell colSpan={5} sx={{ textAlign: 'center', p: 2, color: 'var(--surface-text)', opacity: 0.7 }}>
                    Loading...
                  </TableCell>
                </TableRow>
              ) : displayedCustomers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} sx={{ textAlign: 'center', p: 2, color: 'var(--surface-text)', opacity: 0.7 }}>
                    No customers found
                  </TableCell>
                </TableRow>
              ) : (
                displayedCustomers.map((row) => (
                  <TableRow key={row.id} sx={{ '& td': { borderColor: 'rgba(128,128,128,0.1)', color: 'var(--surface-text)', fontSize: { xs: '0.75rem', sm: '0.875rem' } } }}>
                    <TableCell>{row.name}</TableCell>
                    <TableCell sx={{ direction: 'ltr' }}>{row.email}</TableCell>
                    <TableCell align="right">{row.orders}</TableCell>
                    <TableCell align="right">{currency.format(row.spend)}</TableCell>
                    <TableCell align="right">
                      {row.lastOrderAt ? new Date(row.lastOrderAt).toLocaleDateString('en-US') : 'N/A'}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination Controls */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 2, flexWrap: 'wrap', gap: 1 }}>
          <Typography variant="body2" sx={{ color: 'var(--surface-text)', opacity: 0.7, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
            {t('colCustomer')} {topCustomers.length > 0 ? startIdx + 1 : 0} - {Math.min(endIdx, topCustomers.length)} {t('colEmail')} {topCustomers.length}
          </Typography>
          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            <Button
              size="small"
              variant="outlined"
              startIcon={<PrevIcon />}
              onClick={handlePrevPage}
              disabled={currentPage === 0 || customersLoading}
              suppressHydrationWarning
              sx={{ textTransform: 'none', color: '#324d3e', borderColor: 'rgba(50,77,62,0.3)', fontSize: { xs: '0.7rem', sm: '0.875rem' }, gap: 0.75, display: 'inline-flex', alignItems: 'center', justifyContent: locale === 'ar' ? 'flex-end' : 'center', width: 'auto' }}
            >
              {t('btnPrevious')}
            </Button>
            <Typography variant="body2" sx={{ px: { xs: 0.5, sm: 1.5 }, display: 'flex', alignItems: 'center', color: 'var(--surface-text)', fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
              {topCustomers.length > 0 ? currentPage + 1 : 0} / {totalPages}
            </Typography>
            <Button
              size="small"
              variant="outlined"
              endIcon={<NextIcon />}
              onClick={handleNextPage}
              disabled={currentPage === totalPages - 1 || customersLoading}
              suppressHydrationWarning
              sx={{ textTransform: 'none', color: '#324d3e', borderColor: 'rgba(50,77,62,0.3)', fontSize: { xs: '0.7rem', sm: '0.875rem' }, gap: 0.75, display: 'inline-flex', alignItems: 'center', justifyContent: locale === 'ar' ? 'flex-end' : 'center', width: 'auto' }}
            >
              {t('btnNext')}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default ContactsStatusAndTopCustomers;
