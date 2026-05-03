'use client';

import type { FC } from 'react';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Alert from '@mui/material/Alert';
import StatCard from './StatCard';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import GroupIcon from '@mui/icons-material/Group';
import { useTranslations } from 'next-intl';
import { useAnalytics } from './AnalyticsContext';

const iconBox = (bg: string, children: React.ReactNode) => (
  <Box sx={{ width: 48, height: 48, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: bg, color: '#fff' }}>
    {children}
  </Box>
);

const StatCardsRow: FC = () => {
  const t = useTranslations('StatCardsRow');
  const { stats, error } = useAnalytics();

  const grid = {
    display: 'grid',
    gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(4, 1fr)' },
    gap: 3,
  };

  if (!stats) {
    if (error) {
      return <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>;
    }
    return (
      <Box sx={grid}>
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} variant="rounded" height={180} sx={{ borderRadius: 3 }} />
        ))}
      </Box>
    );
  }

  const fmt = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(1)}K` : String(n);
  const fmtMoney = (n: number) => n >= 1000 ? `$${(n / 1000).toFixed(1)}K` : `$${n}`;

  return (
    <Box sx={grid}>
      <StatCard icon={iconBox('#527a66', <VisibilityIcon />)} value={fmt(stats.totalStudies)} label={t('totalProducts')} />
      <StatCard icon={iconBox('#bfa12a', <AttachMoneyIcon />)} value={fmtMoney(stats.totalRevenue)} label={t('totalProfit')} />
      <StatCard icon={iconBox('#324d3e', <Inventory2Icon />)} value={fmt(stats.totalProjects)} label={t('totalPurchases')} />
      <StatCard icon={iconBox('#8ea58b', <GroupIcon />)} value={fmt(stats.totalCustomers)} label={t('totalUsers')} />
    </Box>
  );
};

export default StatCardsRow;

