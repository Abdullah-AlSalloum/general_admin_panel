'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useLocale, useTranslations } from 'next-intl';

type Stats = { totalStudies: number; totalCustomers: number; totalProjects: number; totalRevenue: number };
type TimeSeriesData = { categories: string[]; counts: number[]; revenue: number[] };
type SectorItem = { sector: string; count: number };

export type AnalyticsData = {
  stats: Stats | null;
  monthly: TimeSeriesData | null;
  weekly: TimeSeriesData | null;
  sectors: SectorItem[] | null;
  loading: boolean;
  error: string | null;
};

const AnalyticsContext = createContext<AnalyticsData>({
  stats: null, monthly: null, weekly: null, sectors: null, loading: true, error: null,
});

export const useAnalytics = () => useContext(AnalyticsContext);

export function AnalyticsProvider({ children }: { children: ReactNode }) {
  const locale = useLocale();
  const t = useTranslations('analytics');
  const [data, setData] = useState<Omit<AnalyticsData, 'loading' | 'error'>>({
    stats: null, monthly: null, weekly: null, sectors: null,
  });
  const [loadedLocale, setLoadedLocale] = useState<string | null>(null);
  const loading = loadedLocale !== locale;
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/admin/analytics?locale=${locale}`)
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then((d) => {
        setData({ stats: d.stats, monthly: d.monthly, weekly: d.weekly, sectors: d.sectors });
        setError(null);
      })
      .catch(() => setError(t('errorLoad')))
      .finally(() => setLoadedLocale(locale));
  }, [locale, t]);

  return (
    <AnalyticsContext.Provider value={{ ...data, loading, error }}>
      {children}
    </AnalyticsContext.Provider>
  );
}
