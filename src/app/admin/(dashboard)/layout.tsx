import ResponsiveDrawer from '@/components/admin/ResponsiveDrawer';
import { getAdminPublicProfile } from '@/lib/mock-data';

export default async function Layout({ children }: { children: React.ReactNode }) {
  const admin = getAdminPublicProfile();
  const adminName = admin.name || 'Admin';
  const adminEmail = admin.email || '';
  return <ResponsiveDrawer adminName={adminName} adminEmail={adminEmail}>{children}</ResponsiveDrawer>;
}
