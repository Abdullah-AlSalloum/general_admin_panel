"use client";

import type { FC } from 'react';
import type { ApexOptions } from 'apexcharts';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import Alert from '@mui/material/Alert';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import { useAnalytics } from './AnalyticsContext';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const ProfitLastWeek: FC = () => {
  const t = useTranslations('ProfitLastWeek');
  const { weekly: data, error } = useAnalytics();

  const categories = data?.categories ?? [];
  const series = [
    { name: t('sales'), data: data?.counts ?? [] },
    { name: t('revenue'), data: data?.revenue ?? [] },
  ];

  const chartOptions: ApexOptions = {
    chart: { type: 'bar', stacked: true, toolbar: { show: false }, foreColor: 'var(--surface-text)' },
    plotOptions: { bar: { columnWidth: '40%', borderRadius: 6 } },
    dataLabels: { enabled: false },
    grid: { borderColor: 'rgba(255,255,255,0.12)', strokeDashArray: 4 },
    xaxis: { categories, axisBorder: { show: false }, axisTicks: { show: false } },
    yaxis: { min: 0, tickAmount: 4 },
    colors: ['#324d3e', '#bfa12a'],
    legend: { show: false },
    tooltip: { theme: 'dark' },
  };

  return (
    <Box sx={{ background: 'var(--surface)', color: 'var(--surface-text)', borderRadius: 3, p: { xs: 2, sm: 3 }, boxShadow: '0 6px 18px rgba(0, 0, 0, 0.25)', display: 'flex', flexDirection: 'column', minHeight: { xs: 'auto', lg: 432 } }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>{t('title')}</Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 12, height: 12, borderRadius: '50%', background: '#324d3e' }} />
          <Typography variant="body2" sx={{ opacity: 0.7 }}>{t('sales')}</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 12, height: 12, borderRadius: '50%', background: '#bfa12a' }} />
          <Typography variant="body2" sx={{ opacity: 0.7 }}>{t('revenue')}</Typography>
        </Box>
      </Box>

      <Box sx={{ flex: 1, minHeight: 260 }}>
        {!data ? (
          error ? <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert> : <Skeleton variant="rounded" height={260} sx={{ borderRadius: 2 }} />
        ) : (
          <Chart options={chartOptions} series={series} type="bar" height="100%" />
        )}
      </Box>
    </Box>
  );
};

export default ProfitLastWeek;

