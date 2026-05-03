'use client';

import ContactsInbox from '@/components/admin/contacts/ContactsInbox';
import { useTranslations } from 'next-intl';

export default function CustomStudyRequestsPage() {
  const t = useTranslations('contacts');

  return (
    <ContactsInbox
      apiPath="/api/admin/custom-study-requests"
      title={t('customStudyTitle')}
    />
  );
}
