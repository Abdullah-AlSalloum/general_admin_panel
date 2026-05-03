'use client';

import { useState, type FC } from 'react';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Avatar from '@mui/material/Avatar';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import ListItemIcon from '@mui/material/ListItemIcon';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import { useTranslations, useLocale } from 'next-intl';
import { useThemeMode } from './ThemeProvider';
import { signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

type AdminAppBarProps = {
  onMenuClick?: () => void;
  showMenu?: boolean;
  adminName?: string;
  adminEmail?: string;
};

const AdminAppBar: FC<AdminAppBarProps> = ({ onMenuClick, showMenu = false, adminName = 'Admin', adminEmail = '' }) => {
  const isMobile = useMediaQuery('(max-width:600px)', { noSsr: true });
  const { mode, toggleMode } = useThemeMode();
  const t = useTranslations('app');
  const pathname = usePathname();
  const locale = useLocale();
  const isRtl = locale !== 'en';
  // Menus open from the correct side based on text direction
  const menuAnchor = isRtl ? 'left' : 'right';

  const searchBg = mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';
  const iconBtnSx = {
    background: searchBg,
    borderRadius: '999px',
    width: 36,
    height: 36,
    '&:hover': { background: searchBg },
  };

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notifAnchorEl, setNotifAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);
  const notifOpen = Boolean(notifAnchorEl);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleNotifOpen = (event: React.MouseEvent<HTMLElement>) => setNotifAnchorEl(event.currentTarget);
  const handleNotifClose = () => setNotifAnchorEl(null);
  const handleLogout = () => {
    handleMenuClose();
    signOut({ callbackUrl: '/admin/login' });
  };

  const title = (() => {
    if (pathname === '/admin') return t('dashboard');
    if (pathname.startsWith('/admin/studies')) return t('studies');
    if (pathname.startsWith('/admin/customers')) return t('customers');
    if (pathname.startsWith('/admin/contacts')) return t('contacts');
    if (pathname.startsWith('/admin/analytics')) return t('analytics');
    if (pathname.startsWith('/admin/profile')) return t('profile');
    if (pathname.startsWith('/admin/settings')) return t('settings');
    return t('dashboard');
  })();

  return (
    // dir wrapper ensures correct flex direction for AppBar toolbar regardless of html[dir]
    <div dir={isRtl ? 'rtl' : 'ltr'}>
    <MuiAppBar
      position="sticky"
      elevation={0}
      sx={{
        top: 0,
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: 'var(--surface)',
        color: 'var(--surface-text)',
        borderBottom: 'none',
        boxShadow: 'none',
      }}
    >
      <Toolbar
        sx={{
          justifyContent: 'space-between',
          gap: 1,
          flexWrap: 'wrap',
          minHeight: { xs: 64, sm: 80 },
        }}
      >
        {/* Start side: hamburger + title + mobile logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
          {showMenu && (
            <IconButton
              color="inherit"
              aria-label="menu"
              sx={{ ...(isMobile ? iconBtnSx : {}) }}
              onClick={onMenuClick}
            >
              <MenuIcon />
            </IconButton>
          )}
           {isMobile && (
            <Image
              src={mode === 'dark' ? '/brand/logo-light.png' : '/brand/logo-green.png'}
              alt="دراسات ستور"
              width={100}
              height={34}
              style={{ height: 34, width: 'auto', objectFit: 'contain' }}
              priority
            />
          )}
          <Typography
            variant="h6"
            color="inherit"
            noWrap
            sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
          >
            {title}
          </Typography>
         
        </Box>

        {/* End side: search + actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1 } }}>
          {isMobile && (
            <>
              <IconButton color="inherit" aria-label="toggle theme" onClick={toggleMode} sx={iconBtnSx}>
                {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
              </IconButton>
              <IconButton color="inherit" aria-label="notifications" onClick={handleNotifOpen} sx={iconBtnSx}>
                <NotificationsIcon />
              </IconButton>
            </>
          )}

          {!isMobile && (
            <IconButton color="inherit" aria-label="toggle theme" onClick={toggleMode} sx={iconBtnSx}>
              {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          )}
          {!isMobile && (
            <IconButton color="inherit" onClick={handleNotifOpen} aria-label="notifications">
              <NotificationsIcon />
            </IconButton>
          )}

          <Box
            onClick={handleMenuOpen}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              cursor: 'pointer',
              px: 1,
              py: 0.5,
              borderRadius: 2,
              '&:hover': { backgroundColor: 'rgba(0,0,0,0.05)' },
            }}
            aria-controls={menuOpen ? 'user-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={menuOpen ? 'true' : undefined}
          >
            <Avatar sx={{ width: 32, height: 32, bgcolor: '#324d3e', fontFamily: 'sans-serif', color: '#fff', lineHeight: 1, pt: '2px' }}>{adminName.charAt(0).toUpperCase()}</Avatar>
            {!isMobile && (
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {adminName}
              </Typography>
            )}
            {!isMobile && <ExpandMoreIcon fontSize="small" />}
          </Box>
        </Box>
      </Toolbar>

      {/* User dropdown */}
      <Menu
        id="user-menu"
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: menuAnchor }}
        transformOrigin={{ vertical: 'top', horizontal: menuAnchor }}
        slotProps={{
          paper: {
            sx: {
              mt: 1,
              minWidth: 220,
              borderRadius: 2,
              backgroundColor: 'var(--surface)',
              color: 'var(--surface-text)',
            },
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 2, py: 1.5 }}>
          <Avatar sx={{ width: 40, height: 40, bgcolor: 'var(--color-brand-700, #324d3e)', fontFamily: 'sans-serif', color: '#fff', lineHeight: 1, pt: '2px' }}>{adminName.charAt(0).toUpperCase()}</Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
              {adminName}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {adminEmail}
            </Typography>
          </Box>
        </Box>
        <Divider />
        <MenuItem component={Link} href="/admin/profile" onClick={handleMenuClose}>
          <ListItemIcon>
            <AccountCircleIcon fontSize="small" />
          </ListItemIcon>
          {t('viewProfile')}
        </MenuItem>
        <MenuItem component={Link} href="/admin/settings" onClick={handleMenuClose}>
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          {t('accountSettings')}
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          {t('logout')}
        </MenuItem>
      </Menu>

      {/* Notifications dropdown */}
      <Menu
        anchorEl={notifAnchorEl}
        open={notifOpen}
        onClose={handleNotifClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: menuAnchor }}
        transformOrigin={{ vertical: 'top', horizontal: menuAnchor }}
        slotProps={{
          paper: {
            sx: {
              mt: 1,
              minWidth: 320,
              borderRadius: 2,
              backgroundColor: 'var(--surface)',
              color: 'var(--surface-text)',
            },
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, py: 1.5 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            {t('notifications')}
          </Typography>

        </Box>
        <Divider />
        <Box sx={{ px: 2, py: 3, textAlign: 'center', color: 'text.secondary' }}>
          <Typography variant="body2">{t('noNotifications')}</Typography>
        </Box>
      </Menu>

    </MuiAppBar>
    </div>
  );
};

export default AdminAppBar;
