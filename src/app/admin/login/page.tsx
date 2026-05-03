import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AdminLoginForm from './AdminLoginForm';

export default async function LoginPage() {
  const session = await auth();
  if (session?.user?.role === 'admin') redirect('/admin/analytics');
  return <AdminLoginForm />;
}
