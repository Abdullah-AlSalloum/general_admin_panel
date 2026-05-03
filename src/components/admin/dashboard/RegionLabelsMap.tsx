"use client";

import { useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useTranslations } from 'next-intl';

const RegionLabelsMap = () => {
  const t = useTranslations('RegionLabels');
  const mapRef = useRef<HTMLDivElement | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapInstance = useRef<any>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const mapEl = mapRef.current; // capture for cleanup
    let destroyed = false;

    const init = async () => {
      // Import jsvectormap (sets window.jsVectorMap) + its CSS, but NOT the map file
      const [mod] = await Promise.all([
        import('jsvectormap'),
        import('jsvectormap/dist/jsvectormap.css'),
      ]);

      if (destroyed) return;

      // world-merc.js calls jsVectorMap.addMap() as a global — load via <script> tag
      // so it runs in window scope where window.jsVectorMap is already set
      await new Promise<void>((resolve) => {
        if ((window as typeof window & { __jsVmWorldMerc?: boolean }).__jsVmWorldMerc) {
          resolve();
          return;
        }
        const script = document.createElement('script');
        script.src = '/jsvectormap/world-merc.js';
        script.onload = () => {
          (window as typeof window & { __jsVmWorldMerc?: boolean }).__jsVmWorldMerc = true;
          resolve();
        };
        script.onerror = () => resolve();
        document.head.appendChild(script);
      });

      if (destroyed || !mapRef.current) return;

      const JsVectorMap = mod.default;

      if (mapInstance.current) {
        mapInstance.current.destroy();
        mapInstance.current = null;
      }
      mapRef.current.innerHTML = '';

      mapInstance.current = new JsVectorMap({
        selector: mapRef.current,
        map: 'world_merc',
        backgroundColor: 'transparent',
        zoomButtons: true,
        regionStyle: {
          initial: { fill: '#C9D6C6', stroke: '#527a66', strokeWidth: 0.6 },
          hover: { fill: '#324d3e' },
        },
        markers: [],
        selectedRegions: ['SA'],
        regionStyleSelected: { fill: '#324d3e' },
      });
    };

    init();

    return () => {
      destroyed = true;
      if (mapInstance.current) {
        mapInstance.current.destroy();
        mapInstance.current = null;
      }
      if (mapEl) {
        mapEl.innerHTML = '';
      }
    };
  }, []);

  return (
    <Box
      sx={{
        background: 'var(--surface)',
        color: 'var(--surface-text)',
        borderRadius: 3,
        p: { xs: 2, sm: 3 },
        boxShadow: '0 6px 18px rgba(0, 0, 0, 0.25)',
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 420, mb: 2 }}>
        {t('title')}
      </Typography>
      <Box
        dir="ltr"
        sx={{
          position: 'relative',
          height: { xs: 260, sm: 340, md: 420 },
        }}
      >
        {/* Inner div fills the wrapper absolutely so jsvectormap's
            `.jvm-container { height:100%; width:100% }` resolves correctly
            and is unaffected by the parent RTL direction */}
        <div
          ref={mapRef}
          style={{ position: 'absolute', inset: 0, direction: 'ltr' }}
        />
      </Box>
    </Box>
  );
};

export default RegionLabelsMap;
