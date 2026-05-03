import Box from '@mui/material/Box';
import { AnalyticsProvider } from '@/components/admin/dashboard/AnalyticsContext';
import StatCardsRow from '@/components/admin/dashboard/StatCardsRow';
import PaymentsOverview from '@/components/admin/dashboard/PaymentsOverview';
import ProfitLastWeek from '@/components/admin/dashboard/ProfitWeek';
import UsedDevices from '@/components/admin/dashboard/UsedDevices';
import ContactsStatusAndTopCustomers from '@/components/admin/dashboard/ContactsStatusAndTopCustomers';

export default function AnalyticsPage() {
  return (
    <AnalyticsProvider>
      <Box sx={{ p: { xs: 2, sm: 3 } }}>
        {/* Stat Cards */}
        <Box sx={{ mb: 3 }}>
          <StatCardsRow />
        </Box>

        {/* Charts row */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' },
            gap: 3,
            mb: 3,
          }}
        >
          <PaymentsOverview />
          <ProfitLastWeek />
        </Box>

        {/* Contacts status + top customers */}
        <Box sx={{ mb: 3 }}>
          <ContactsStatusAndTopCustomers />
        </Box>

        {/* Bottom row */}
        <Box sx={{ mb: 3 }}>
          <UsedDevices />
        </Box>

      </Box>
    </AnalyticsProvider>
  );
}
