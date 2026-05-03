'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Switch from '@mui/material/Switch';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useThemeMode } from '@/components/admin/ThemeProvider';
import LanguageIcon from '@mui/icons-material/Language';
import PaletteIcon from '@mui/icons-material/Palette';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import SecurityIcon from '@mui/icons-material/Security';

const cardSx = {
  background: 'var(--surface)',
  borderRadius: 3,
  boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
  mb: 3,
  overflow: 'hidden',
};

const sectionTitle = (label: string) => (
  <Box sx={{ px: 3, pt: 2.5, pb: 1 }}>
    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#527a66', fontSize: '0.78rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
      {label}
    </Typography>
  </Box>
);

export default function SettingsPage() {
  const t = useTranslations('settings');
  const { themePreference, setThemeMode } = useThemeMode();
  const currentLocale = useLocale();
  const isEnglish = currentLocale === 'en';
  const [locale, setLocale] = useState(currentLocale);
  const [emailNotifs, setEmailNotifs] = useState(() => {
    if (typeof window === 'undefined') return true;
    const v = localStorage.getItem('notif-email');
    return v === null ? true : v === 'true';
  });
  const [contactNotifs, setContactNotifs] = useState(() => {
    if (typeof window === 'undefined') return true;
    const v = localStorage.getItem('notif-contact');
    return v === null ? true : v === 'true';
  });
  const [twoFactor] = useState(false);

  const handleEmailNotifs = (value: boolean) => {
    setEmailNotifs(value);
    localStorage.setItem('notif-email', String(value));
  };

  const handleContactNotifs = (value: boolean) => {
    setContactNotifs(value);
    localStorage.setItem('notif-contact', String(value));
  };

  const handleLocaleChange = (value: string) => {
    setLocale(value);
    document.cookie = `locale=${value}; path=/; max-age=31536000`;
    window.location.reload();
  };

  const rowSx = {
    px: 3,
    py: 0.5,
    '& .MuiListItemText-primary': { color: 'var(--surface-text)', fontWeight: 600, fontSize: '0.93rem', textAlign: isEnglish ? 'start' : undefined },
    '& .MuiListItemText-secondary': { color: 'var(--surface-text)', opacity: 0.55, fontSize: '0.78rem', textAlign: isEnglish ? 'start' : undefined },
    '& .MuiListItemIcon-root': { color: '#527a66', minWidth: 40 },
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3 }, maxWidth: 680, mx: 'auto' }}>
      <Typography variant="h5" sx={{ fontWeight: 700, color: 'var(--surface-text)', mb: 3 }}>
        {t('pageTitle')}
      </Typography>

      {/* Language */}
      <Paper sx={cardSx}>
        {sectionTitle(t('sectionLanguage'))}
        <Divider sx={{ borderColor: 'rgba(128,128,128,0.1)' }} />
        <List disablePadding>
          <ListItem sx={rowSx} secondaryAction={isEnglish ? undefined : (
              <FormControl size="small">
                <Select value={locale} onChange={(e) => handleLocaleChange(e.target.value)}
                  sx={{ fontSize: '0.85rem', minWidth: 110, color: 'var(--surface-text)', '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(82,122,102,0.4)' } }}>
                  <MenuItem value="ar">العربية</MenuItem>
                  <MenuItem value="en">English</MenuItem>
                </Select>
              </FormControl>
            )}>
            <ListItemIcon><LanguageIcon /></ListItemIcon>
            <ListItemText primary={t('languageLabel')} secondary={t('languageDesc')} />
            {isEnglish && <FormControl size="small" sx={{ ml: 'auto', flexShrink: 0 }}>
              <Select value={locale} onChange={(e) => handleLocaleChange(e.target.value)}
                sx={{ fontSize: '0.85rem', minWidth: 110, color: 'var(--surface-text)', '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(82,122,102,0.4)' } }}>
                <MenuItem value="ar">العربية</MenuItem>
                <MenuItem value="en">English</MenuItem>
              </Select>
            </FormControl>}
          </ListItem>
        </List>
      </Paper>

      {/* Appearance */}
      <Paper sx={cardSx}>
        {sectionTitle(t('sectionAppearance'))}
        <Divider sx={{ borderColor: 'rgba(128,128,128,0.1)' }} />
        <List disablePadding>
          <ListItem sx={rowSx} secondaryAction={isEnglish ? undefined : (
              <FormControl size="small">
                <Select value={themePreference} onChange={(e) => setThemeMode(e.target.value as 'light' | 'dark' | 'system')}
                  sx={{ fontSize: '0.85rem', minWidth: 130, color: 'var(--surface-text)', '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(82,122,102,0.4)' } }}>
                  <MenuItem value="system">{t('themeSystem')}</MenuItem>
                  <MenuItem value="light">{t('themeLight')}</MenuItem>
                  <MenuItem value="dark">{t('themeDark')}</MenuItem>
                </Select>
              </FormControl>
            )}>
            <ListItemIcon><PaletteIcon /></ListItemIcon>
            <ListItemText primary={t('appearanceLabel')} secondary={t('appearanceDesc')} />
            {isEnglish && <FormControl size="small" sx={{ ml: 'auto', flexShrink: 0 }}>
              <Select value={themePreference} onChange={(e) => setThemeMode(e.target.value as 'light' | 'dark' | 'system')}
                sx={{ fontSize: '0.85rem', minWidth: 130, color: 'var(--surface-text)', '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(82,122,102,0.4)' } }}>
                <MenuItem value="system">{t('themeSystem')}</MenuItem>
                <MenuItem value="light">{t('themeLight')}</MenuItem>
                <MenuItem value="dark">{t('themeDark')}</MenuItem>
              </Select>
            </FormControl>}
          </ListItem>
        </List>
      </Paper>

      {/* Notifications */}
      <Paper sx={cardSx}>
        {sectionTitle(t('sectionNotifications'))}
        <Divider sx={{ borderColor: 'rgba(128,128,128,0.1)' }} />
        <List disablePadding>
          <ListItem sx={rowSx} secondaryAction={isEnglish ? undefined : (
              <Switch checked={emailNotifs} onChange={(e) => handleEmailNotifs(e.target.checked)}
                sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: '#527a66' }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#527a66' } }}
              />
            )}>
            <ListItemIcon><NotificationsNoneIcon /></ListItemIcon>
            <ListItemText primary={t('emailNotifsLabel')} secondary={t('emailNotifsDesc')} />
            {isEnglish && <Switch checked={emailNotifs} onChange={(e) => handleEmailNotifs(e.target.checked)} sx={{ ml: 'auto', flexShrink: 0, '& .MuiSwitch-switchBase.Mui-checked': { color: '#527a66' }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#527a66' } }} />}
          </ListItem>
          <Divider sx={{ borderColor: 'rgba(128,128,128,0.06)', mx: 3 }} />
          <ListItem sx={rowSx} secondaryAction={isEnglish ? undefined : (
              <Switch checked={contactNotifs} onChange={(e) => handleContactNotifs(e.target.checked)}
                sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: '#527a66' }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#527a66' } }}
              />
            )}>
            <ListItemIcon><NotificationsNoneIcon /></ListItemIcon>
            <ListItemText primary={t('contactNotifsLabel')} secondary={t('contactNotifsDesc')} />
            {isEnglish && <Switch checked={contactNotifs} onChange={(e) => handleContactNotifs(e.target.checked)} sx={{ ml: 'auto', flexShrink: 0, '& .MuiSwitch-switchBase.Mui-checked': { color: '#527a66' }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#527a66' } }} />}
          </ListItem>
        </List>
      </Paper>

      {/* Security */}
      <Paper sx={cardSx}>
        {sectionTitle(t('sectionSecurity'))}
        <Divider sx={{ borderColor: 'rgba(128,128,128,0.1)' }} />
        <List disablePadding>
          <ListItem sx={rowSx} secondaryAction={isEnglish ? undefined : (
              <Switch checked={twoFactor} disabled sx={{ opacity: 0.45 }} />
            )}>
            <ListItemIcon><SecurityIcon /></ListItemIcon>
            <ListItemText primary={t('twoFactorLabel')} secondary={t('twoFactorDesc')} />
            {isEnglish && <Switch checked={twoFactor} disabled sx={{ ml: 'auto', flexShrink: 0, opacity: 0.45 }} />}
          </ListItem>
        </List>
      </Paper>
    </Box>
  );
}

