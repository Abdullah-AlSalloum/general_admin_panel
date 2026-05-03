import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = requested === 'en' ? 'en' : 'ar';

  return {
    locale,
    messages:
      locale === 'en'
        ? (await import('../messages/en.json')).default
        : (await import('../messages/ar.json')).default,
  };
});
