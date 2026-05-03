'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { useLocale } from 'next-intl';
import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import AdminAppBar from './AppBar';

interface ResponsiveDrawerProps {
  children: ReactNode;
  adminName?: string;
  adminEmail?: string;
}

const ResponsiveDrawer: React.FC<ResponsiveDrawerProps> = ({ children, adminName, adminEmail }) => {
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(max-width:900px)').matches : false
  );
  const [mobileOpen, setMobileOpen] = useState(false);
  const locale = useLocale();
  const pathname = usePathname();
  const isRtl = locale !== 'en';
  const [liveAdminName, setLiveAdminName] = useState(adminName ?? 'Admin');
  const [liveAdminEmail, setLiveAdminEmail] = useState(adminEmail ?? '');

  useEffect(() => {
    const mq = window.matchMedia('(max-width:900px)');
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    document.documentElement.setAttribute('dir', isRtl ? 'rtl' : 'ltr');
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    return () => {
      mq.removeEventListener('change', handler);
      document.documentElement.setAttribute('dir', 'rtl');
    };
  }, [isRtl]);

  useEffect(() => {
    // Keep AppBar data fresh when navigating between admin pages.
    const syncAdminIdentity = async () => {
      try {
        const res = await fetch('/api/admin/profile', { cache: 'no-store' });
        const data = await res.json().catch(() => null);
        if (data?.ok && data.user) {
          setLiveAdminName(data.user.name || 'Admin');
          setLiveAdminEmail(data.user.email || '');
        }
      } catch {
        // Ignore network hiccups; keep current UI values.
      }
    };

    const onProfileUpdated = (event: Event) => {
      const customEvent = event as CustomEvent<{ name?: string; email?: string }>;
      if (customEvent.detail?.name) setLiveAdminName(customEvent.detail.name);
      if (customEvent.detail?.email) setLiveAdminEmail(customEvent.detail.email);
    };

    void syncAdminIdentity();
    window.addEventListener('admin-profile-updated', onProfileUpdated as EventListener);
    return () => {
      window.removeEventListener('admin-profile-updated', onProfileUpdated as EventListener);
    };
  }, [pathname]);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      style={{
        display: 'flex',
        flexDirection: 'row',
        height: '100vh',
        overflow: 'hidden',
        background: 'var(--background)',
        // Hide until mounted to avoid layout flash, but keep space reserved
        visibility: mounted ? 'visible' : 'hidden',
      }}
    >
      {/* Permanent sidebar on desktop */}
      {!isMobile && <Sidebar variant="permanent" />}

      {/* Temporary drawer on mobile */}
      {isMobile && (
        <Sidebar
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
        />
      )}

      {/* Main content area */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          minWidth: 0,
          overflow: 'hidden',
        }}
      >
        <AdminAppBar showMenu={isMobile} onMenuClick={handleDrawerToggle} adminName={liveAdminName} adminEmail={liveAdminEmail} />
        <main style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default ResponsiveDrawer;
