'use client';

import { useEffect, useState, type FC } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Box from '@mui/material/Box';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import EmailIcon from '@mui/icons-material/Email';
import AssignmentIcon from '@mui/icons-material/Assignment';
import BarChartIcon from '@mui/icons-material/BarChart';
import SettingsIcon from '@mui/icons-material/Settings';
import PeopleIcon from '@mui/icons-material/People';
import Divider from '@mui/material/Divider';
import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { useThemeMode } from './ThemeProvider';

export const drawerWidth = 300;

type SidebarProps = {
  variant?: 'permanent' | 'temporary';
  open?: boolean;
  onClose?: () => void;
};

const navItems = [
  { labelKey: 'analytics', href: '/admin/analytics', icon: <BarChartIcon /> },
  { labelKey: 'studies', href: '/admin/studies', icon: <MenuBookIcon /> },
  { labelKey: 'customers', href: '/admin/customers', icon: <PeopleIcon /> },
  { labelKey: 'contacts', href: '/admin/contacts', icon: <EmailIcon /> },
  { labelKey: 'customStudyRequests', href: '/admin/custom-study-requests', icon: <AssignmentIcon /> },
  { labelKey: 'settings', href: '/admin/settings', icon: <SettingsIcon /> },
];

const Sidebar: FC<SidebarProps> = ({ variant = 'permanent', open, onClose }) => {
  const t = useTranslations('sidebar');
  const locale = useLocale();
  const pathname = usePathname();
  const { mode } = useThemeMode();
  const [newContactsCount, setNewContactsCount] = useState(0);
  const [newCustomStudyRequestsCount, setNewCustomStudyRequestsCount] = useState(0);

  const anchor = locale === 'en' ? 'left' : 'right';
  // In RTL (Arabic), MUI's RTL plugin flips left↔right CSS and translateX transforms.
  // Using 'left' for the temporary drawer in RTL makes MUI flip it so it appears
  // and animates from the right side — which is correct for Arabic.
  const temporaryAnchor: 'left' | 'right' = 'left';

  const handleLocaleChange = (value: string) => {
    document.cookie = `locale=${value}; path=/; max-age=31536000`;
    window.location.reload();
  };

  useEffect(() => {
    let canceled = false;

    const fetchSidebarCounts = async () => {
      try {
        const [contactsRes, customStudyRequestsRes] = await Promise.all([
          fetch('/api/admin/contacts', { cache: 'no-store' }),
          fetch('/api/admin/custom-study-requests', { cache: 'no-store' }),
        ]);

        const contactsJson = contactsRes.ok ? await contactsRes.json() : null;
        const contactsData = Array.isArray(contactsJson?.data) ? contactsJson.data : [];
        const contactsCount = contactsData.filter((item: { status?: string }) => item?.status === 'NEW').length;

        const customStudyRequestsJson = customStudyRequestsRes.ok ? await customStudyRequestsRes.json() : null;
        const customStudyRequestsData = Array.isArray(customStudyRequestsJson?.data) ? customStudyRequestsJson.data : [];
        const customStudyRequestsCount = customStudyRequestsData.filter((item: { status?: string }) => item?.status === 'NEW').length;

        if (!canceled) {
          setNewContactsCount(contactsCount);
          setNewCustomStudyRequestsCount(customStudyRequestsCount);
        }
      } catch {
        if (!canceled) {
          setNewContactsCount(0);
          setNewCustomStudyRequestsCount(0);
        }
      }
    };

    fetchSidebarCounts();
    return () => {
      canceled = true;
    };
  }, [pathname]);

  const drawerContent = (
    <>
      {variant === 'permanent' && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px 16px',
          }}
        >
          <Image
            src={mode === 'dark' ? '/brand/logo-light.png' : '/brand/logo-green.png'}
            alt="دراسات ستور"
            width={160}
            height={52}
            style={{ position: 'relative', height: 70, width: 'auto', objectFit: 'contain', top: -18  }}
            priority
          />
        </div>
      )}

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)', mt: variant === 'temporary' ? 8 : 0 }} />

      <List sx={{ flex: 1, pt: 1 }}>
        {navItems.map((item) => {
          const isActive = item.href === '/admin' ? pathname === item.href : pathname.startsWith(item.href);
          const primaryLabel = (
            <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, flexDirection: locale === 'en' ? 'row-reverse' : 'row' }}>
              <span>{t(item.labelKey)}</span>
              {item.labelKey === 'contacts' && newContactsCount > 0 && (
                <Box
                  component="span"
                  sx={{
                    minWidth: 22,
                    height: 22,
                    px: 0.75,
                    borderRadius: '999px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 12,
                    fontWeight: 800,
                    lineHeight: 1,
                    bgcolor: isActive ? 'rgba(255,99,99,0.28)' : '#c0392b',
                    color: '#fff',
                  }}
                >
                  {newContactsCount}
                </Box>
              )}
              {item.labelKey === 'customStudyRequests' && newCustomStudyRequestsCount > 0 && (
                <Box
                  component="span"
                  sx={{
                    minWidth: 22,
                    height: 22,
                    px: 0.75,
                    borderRadius: '999px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 12,
                    fontWeight: 800,
                    lineHeight: 1,
                    bgcolor: isActive ? 'rgba(255,99,99,0.28)' : '#c0392b',
                    color: '#fff',
                  }}
                >
                  {newCustomStudyRequestsCount}
                </Box>
              )}
            </Box>
          );
          return (
            <ListItem key={item.href} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                component={Link}
                href={item.href}
                selected={isActive}
                sx={{
                  mx: 1,
                  borderRadius: 2,
                  ...(locale === 'en' && {
                    direction: 'ltr',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    gap: 1.25,
                    pl: 2,
                    pr: 1.5,
                  }),
                  '&.Mui-selected': {
                    background: 'linear-gradient(135deg, #324d3e, #527a66)',
                    color: '#f6fff5',
                    '& .MuiListItemIcon-root': { color: '#f6fff5' },
                  },
                  '&.Mui-selected:hover': {
                    background: 'linear-gradient(135deg, #2b4437, #4a6f5d)',
                  },
                  '&:hover': {
                    background: mode === 'dark' ? 'rgba(122, 184, 154, 0.14)' : 'rgba(82, 122, 102, 0.18)',
                  },
                }}
              >
                {locale === 'ar' ? (
                  <>
                    <ListItemText
                      primary={primaryLabel}
                      sx={{ mr: 0, '& .MuiListItemText-primary': { textAlign: 'start' } }}
                    />
                    <ListItemIcon sx={{ color: 'inherit', minWidth: 40, justifyContent: 'flex-end' }}>
                      {item.icon}
                    </ListItemIcon>
                  </>
                ) : (
                  <>
                    <ListItemIcon sx={{ color: 'inherit', minWidth: 0, justifyContent: 'flex-start', mr: 'auto' }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={primaryLabel}
                      sx={{
                        m: 0,
                        flex: '0 1 auto',
                        '& .MuiListItemText-primary': {
                          textAlign: 'left',
                          lineHeight: 1.25,
                        },
                      }}
                    />
                  </>
                )}
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)', mx: 2 }} />

      <List>
        <ListItem>
          <FormControl fullWidth size="small">
            <Select
              value={locale}
              onChange={(e) => handleLocaleChange(e.target.value)}
              sx={{
                backgroundColor: 'var(--surface)',
                color: 'var(--surface-text)',
                '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.12)' },
                ...(locale === 'ar' && {
                  direction: 'rtl',
                  '& .MuiSelect-select': { textAlign: 'right', paddingRight: '14px', paddingLeft: '32px' },
                  '& .MuiSelect-icon': { left: 7, right: 'auto' },
                }),
              }}
              MenuProps={{
                slotProps: {
                  paper: {
                    sx: {
                      backgroundColor: 'var(--surface)',
                      color: 'var(--surface-text)',
                    },
                  },
                },
              }}
            >
              <MenuItem value="ar">العربية</MenuItem>
              <MenuItem value="en">English</MenuItem>
            </Select>
          </FormControl>
        </ListItem>
      </List>
    </>
  );

  return (
    <Drawer
      anchor={variant === 'temporary' ? temporaryAnchor : anchor}
      variant={variant}
      open={variant === 'temporary' ? open : undefined}
      onClose={variant === 'temporary' ? onClose : undefined}
      ModalProps={variant === 'temporary' ? { keepMounted: true } : undefined}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        // Only permanent drawers need to participate in the flex layout
        ...(variant === 'permanent' && { height: '100vh', position: 'sticky', top: 0 }),
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          background: 'var(--surface)',
          color: 'var(--surface-text)',
          border: 'none',
          boxShadow: 'none',
          display: 'flex',
          flexDirection: 'column',
          boxSizing: 'border-box',
          // Override MUI's default position:fixed so the drawer pushes content
          ...(variant === 'permanent' && {
            position: 'sticky',
            top: 0,
            height: '100vh',
            overflowY: 'auto',
          }),
          // In Arabic (RTL) temporary drawer: anchor='left' gives correct slide animation
          // (MUI RTL-flips the Slide direction) but the paper CSS stays on the left.
          // Force it to the right side manually.
          ...(variant === 'temporary' && locale !== 'en' && {
            left: 'auto !important',
            right: 0,
          }),
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
};

export default Sidebar;
