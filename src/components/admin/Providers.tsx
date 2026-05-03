'use client';

import type { FC, ReactNode } from 'react';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v16-appRouter';
import rtlPlugin from 'stylis-plugin-rtl';
import ThemeProvider from './ThemeProvider';

const Providers: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <AppRouterCacheProvider options={{ key: 'muirtl-login', stylisPlugins: [rtlPlugin] }}>
      <ThemeProvider>
        {children}
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
};

export default Providers;
