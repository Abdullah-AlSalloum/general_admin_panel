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

const SECTOR_COLORS = ['#324d3e', '#527a66', '#8ea58b', '#bfa12a', '#C9D6C6', '#6e7672'];

const UsedDevices: FC = () => {
  const t = useTranslations('UsedDevices');
  const { sectors, error } = useAnalytics();

  const total = sectors?.reduce((a, b) => a + b.count, 0) ?? 0;
  const seriesData = sectors?.map((s) => s.count) ?? [];
  const labels = sectors?.map((s) => t(s.sector as Parameters<typeof t>[0])) ?? [];

  const options: ApexOptions = {
    chart: { type: 'donut', toolbar: { show: false }, foreColor: 'var(--surface-text)' },
    labels,
    colors: SECTOR_COLORS,
    stroke: { width: 0 },
    dataLabels: { enabled: false },
    legend: { show: false },
    tooltip: { theme: 'dark' },
    plotOptions: { pie: { donut: { size: '75%' } } },
  };

  return (
    <Box sx={{ background: 'var(--surface)', color: 'var(--surface-text)', borderRadius: 3, p: { xs: 2, sm: 3 }, boxShadow: '0 6px 18px rgba(0, 0, 0, 0.25)' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>{t('title')}</Typography>
      </Box>

      <Box sx={{ position: 'relative', display: 'flex', justifyContent: 'center', mb: 3 }}>
        {!sectors ? (
          error ? <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert> : <Skeleton variant="circular" width={220} height={220} />
        ) : seriesData.length === 0 ? (
          <Box sx={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.5 }}>
            <Typography variant="body2">—</Typography>
          </Box>
        ) : (
          <>
            <Chart options={options} series={seriesData} type="donut" height={260} />
            <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>{total}</Typography>
              <Typography variant="caption" sx={{ opacity: 0.6 }}>{t('total')}</Typography>
            </Box>
          </>
        )}
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1 }}>
        {(sectors ?? []).map((s, i) => (
          <Box key={s.sector} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 10, height: 10, borderRadius: '50%', background: SECTOR_COLORS[i % SECTOR_COLORS.length], flexShrink: 0 }} />
            <Typography variant="body2" sx={{ opacity: 0.8, fontSize: 12 }}>
              {t(s.sector as Parameters<typeof t>[0])}: {total > 0 ? Math.round((s.count / total) * 100) : 0}%
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default UsedDevices;

