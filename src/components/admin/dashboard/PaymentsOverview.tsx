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

const PaymentsOverview: FC = () => {
  const t = useTranslations('PaymentsOverview');
  const { monthly: data, stats, error } = useAnalytics();

  const categories = data?.categories ?? [];
  const totalProjects = stats?.totalProjects ?? 0;
  const totalRevenue = data?.revenue.reduce((a, b) => a + b, 0) ?? 0;

  const series = [
    { name: t('projectsLabel'), data: data?.counts ?? [] },
    { name: t('revenueLabel'), data: data?.revenue ?? [] },
  ];

  const chartOptions: ApexOptions = {
    chart: {
      type: 'area',
      toolbar: { show: false },
      zoom: { enabled: false },
      foreColor: 'var(--surface-text)',
    },
    grid: { borderColor: 'rgba(255,255,255,0.12)', strokeDashArray: 4 },
    stroke: { curve: 'smooth', width: 3 },
    dataLabels: { enabled: false },
    xaxis: { categories, axisBorder: { show: false }, axisTicks: { show: false } },
    yaxis: { min: 0, tickAmount: 5 },
    colors: ['#324d3e', '#bfa12a'],
    fill: {
      type: 'gradient',
      gradient: { shadeIntensity: 1, opacityFrom: 0.35, opacityTo: 0, stops: [0, 100] },
    },
    tooltip: { theme: 'dark' },
    legend: { show: false },
  };

  return (
    <Box sx={{ background: 'var(--surface)', color: 'var(--surface-text)', borderRadius: 3, p: { xs: 2, sm: 3 }, boxShadow: '0 6px 18px rgba(0, 0, 0, 0.25)' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          {t('title')}
        </Typography>
      </Box>

      <Box sx={{ position: 'relative', height: 260, mb: 2 }}>
        {!data ? (
          error ? <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert> : <Skeleton variant="rounded" height={260} sx={{ borderRadius: 2 }} />
        ) : (
          <Chart options={chartOptions} series={series} type="area" height={260} />
        )}
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" sx={{ opacity: 0.7 }}>{t('totalProjectsLabel')}</Typography>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>{totalProjects} {t('purchases')}</Typography>
        </Box>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" sx={{ opacity: 0.7 }}>{t('totalRevenueLabel')}</Typography>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>${totalRevenue.toLocaleString()}</Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default PaymentsOverview;




