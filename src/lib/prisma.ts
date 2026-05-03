// Prisma is intentionally disabled in this reusable admin template.
// Keep the export to avoid import breakage in legacy files.
export const prisma = new Proxy(
  {},
  {
    get() {
      throw new Error('Prisma is disabled in the mock mode admin panel.');
    },
  }
) as never;
