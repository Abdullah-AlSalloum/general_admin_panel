export type ContactStatus = 'NEW' | 'REPLIED' | 'CLOSED';
export type StudyStatus = 'PUBLISHED' | 'COMING_SOON' | 'DRAFT';
export type Sector = 'FOOD' | 'INDUSTRIAL' | 'SERVICE' | 'COMMERCIAL' | 'TECH' | 'OTHER';

type Contact = {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  country: string | null;
  message: string;
  status: ContactStatus;
  createdAt: Date;
};

type Project = {
  id: string;
  name: string;
  brand: string | null;
  sector: Sector;
  createdAt: Date;
  paidAmount: number;
  study: { title: string; price: number };
};

type Customer = {
  id: string;
  name: string | null;
  surname: string | null;
  email: string;
  phone: string | null;
  country: string | null;
  city: string | null;
  gender: string | null;
  emailVerified: boolean;
  createdAt: Date;
  projects: Project[];
};

type StudyFoundingExpense = { id: string; name: string; amount: number };
type StudyOperatingExpense = { id: string; month: number; name: string; amount: number };
type StudySale = { id: string; month: number; amount: number };

export type StudyRecord = {
  id: string;
  title: string;
  sector: Sector;
  price: number;
  oldPrice: number | null;
  status: StudyStatus;
  shortDescription: string | null;
  coverImage: string | null;
  fileUrl: string | null;
  deliverables: string[];
  studyFoundingExpenses: StudyFoundingExpense[];
  studyOperatingExpenses: StudyOperatingExpense[];
  studySales: StudySale[];
  createdAt: Date;
};

const CUSTOM_STUDY_PREFIX = '[طلب دراسة مخصصة]';

export const sectorValues: Sector[] = ['FOOD', 'INDUSTRIAL', 'SERVICE', 'COMMERCIAL', 'TECH', 'OTHER'];
export const studyStatusValues: StudyStatus[] = ['PUBLISHED', 'COMING_SOON', 'DRAFT'];
export const contactStatusValues: ContactStatus[] = ['NEW', 'REPLIED', 'CLOSED'];

const now = Date.now();
const daysAgo = (days: number) => new Date(now - days * 24 * 60 * 60 * 1000);

let contacts: Contact[] = [
  {
    id: 'con_1',
    fullName: 'Ahmed Salem',
    email: 'ahmed.salem@example.com',
    phone: '+966500111222',
    country: 'Saudi Arabia',
    message: 'Hi, I need details about market-entry studies for GCC.',
    status: 'NEW',
    createdAt: daysAgo(1),
  },
  {
    id: 'con_2',
    fullName: 'Mona Adel',
    email: 'mona.adel@example.com',
    phone: '+201001112223',
    country: 'Egypt',
    message: 'Please share expected timeline and deliverables for feasibility reports.',
    status: 'REPLIED',
    createdAt: daysAgo(4),
  },
  {
    id: 'con_3',
    fullName: 'Yousef Alnasser',
    email: 'y.alnasser@example.com',
    phone: null,
    country: 'UAE',
    message: `${CUSTOM_STUDY_PREFIX} Retail analytics for small cities, 6-month rollout plan.`,
    status: 'NEW',
    createdAt: daysAgo(2),
  },
  {
    id: 'con_4',
    fullName: 'Sara Hany',
    email: 'sara.hany@example.com',
    phone: '+201212341234',
    country: 'Egypt',
    message: `${CUSTOM_STUDY_PREFIX} Specialized study for boutique coffee roasting business.`,
    status: 'CLOSED',
    createdAt: daysAgo(8),
  },
];

const studiesSeed: StudyRecord[] = [
  {
    id: 'std_1',
    title: 'Restaurant Feasibility Pack',
    sector: 'FOOD',
    price: 1200,
    oldPrice: 1500,
    status: 'PUBLISHED',
    shortDescription: 'Complete feasibility templates for modern restaurants.',
    coverImage: null,
    fileUrl: null,
    deliverables: ['Market sizing', 'CAPEX model', 'Operating assumptions'],
    studyFoundingExpenses: [
      { id: 'fe_1', name: 'Licensing', amount: 5000 },
      { id: 'fe_2', name: 'Fit-out', amount: 42000 },
    ],
    studyOperatingExpenses: [
      { id: 'oe_1', month: 1, name: 'Salaries', amount: 12000 },
      { id: 'oe_2', month: 1, name: 'Utilities', amount: 1800 },
    ],
    studySales: [
      { id: 'ss_1', month: 1, amount: 25000 },
      { id: 'ss_2', month: 2, amount: 28000 },
    ],
    createdAt: daysAgo(40),
  },
  {
    id: 'std_2',
    title: 'E-commerce Brand Launch',
    sector: 'COMMERCIAL',
    price: 900,
    oldPrice: null,
    status: 'COMING_SOON',
    shortDescription: 'Practical launch model for niche online brands.',
    coverImage: null,
    fileUrl: null,
    deliverables: ['Demand estimate', 'CAC plan', 'Cashflow scenario'],
    studyFoundingExpenses: [],
    studyOperatingExpenses: [],
    studySales: [],
    createdAt: daysAgo(12),
  },
  {
    id: 'std_3',
    title: 'SaaS Validation Blueprint',
    sector: 'TECH',
    price: 1500,
    oldPrice: 1800,
    status: 'PUBLISHED',
    shortDescription: 'Validation and revenue assumptions for B2B SaaS.',
    coverImage: null,
    fileUrl: null,
    deliverables: ['TAM/SAM/SOM', 'Pricing ladders', 'Unit economics'],
    studyFoundingExpenses: [],
    studyOperatingExpenses: [],
    studySales: [],
    createdAt: daysAgo(65),
  },
];

let studies: StudyRecord[] = [...studiesSeed];

let customers: Customer[] = [
  {
    id: 'cus_1',
    name: 'Omar',
    surname: 'Fahad',
    email: 'omar.fahad@example.com',
    phone: '+966555101010',
    country: 'Saudi Arabia',
    city: 'Riyadh',
    gender: 'male',
    emailVerified: true,
    createdAt: daysAgo(120),
    projects: [
      {
        id: 'prj_1',
        name: 'Downtown Burger Branch',
        brand: 'Burgerly',
        sector: 'FOOD',
        createdAt: daysAgo(30),
        paidAmount: 1200,
        study: { title: studiesSeed[0].title, price: studiesSeed[0].price },
      },
    ],
  },
  {
    id: 'cus_2',
    name: 'Layla',
    surname: 'Tarek',
    email: 'layla.tarek@example.com',
    phone: '+201099887766',
    country: 'Egypt',
    city: 'Cairo',
    gender: 'female',
    emailVerified: false,
    createdAt: daysAgo(80),
    projects: [
      {
        id: 'prj_2',
        name: 'Glow Cart Launch',
        brand: 'GlowCart',
        sector: 'COMMERCIAL',
        createdAt: daysAgo(18),
        paidAmount: 900,
        study: { title: studiesSeed[1].title, price: studiesSeed[1].price },
      },
      {
        id: 'prj_3',
        name: 'B2B SaaS ICP Research',
        brand: null,
        sector: 'TECH',
        createdAt: daysAgo(7),
        paidAmount: 1500,
        study: { title: studiesSeed[2].title, price: studiesSeed[2].price },
      },
    ],
  },
];

let adminProfile = {
  id: 'admin_1',
  name: 'General Admin',
  email: 'admin@example.com',
  password: 'Admin@123',
  createdAt: daysAgo(365),
};

function clone<T>(value: T): T {
  return structuredClone(value);
}

function nextId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

function sortedByDateDesc<T extends { createdAt: Date }>(arr: T[]): T[] {
  return [...arr].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export function getAdminPublicProfile() {
  return {
    name: adminProfile.name,
    email: adminProfile.email,
    createdAt: adminProfile.createdAt,
  };
}

export function getAdminSession() {
  return {
    user: {
      id: adminProfile.id,
      email: adminProfile.email,
      name: adminProfile.name,
      role: 'admin',
    },
  };
}

export function verifyAdminCredentials(email: string, password: string) {
  const ok = email.trim().toLowerCase() === adminProfile.email.toLowerCase() && password === adminProfile.password;
  if (!ok) return null;
  return {
    id: adminProfile.id,
    email: adminProfile.email,
    name: adminProfile.name,
    role: 'admin',
  };
}

export function updateAdminProfileName(name: string) {
  adminProfile = { ...adminProfile, name };
}

export function changeAdminPassword(currentPassword: string, newPassword: string) {
  if (currentPassword !== adminProfile.password) return { ok: false, reason: 'INVALID_CURRENT' as const };
  if (newPassword === adminProfile.password) return { ok: false, reason: 'SAME_PASSWORD' as const };
  adminProfile = { ...adminProfile, password: newPassword };
  return { ok: true as const };
}

export function findCustomerByEmailMock(email: string) {
  const normalized = email.trim().toLowerCase();
  return clone(customers.find((c) => c.email.toLowerCase() === normalized) ?? null);
}

export function findAdminByEmailMock(email: string) {
  const normalized = email.trim().toLowerCase();
  if (adminProfile.email.toLowerCase() !== normalized) return null;
  return clone({
    id: adminProfile.id,
    email: adminProfile.email,
    name: adminProfile.name,
    password: adminProfile.password,
  });
}

export function listContacts(options?: { customOnly?: boolean }) {
  const customOnly = options?.customOnly === true;
  const filtered = contacts.filter((c) => {
    const isCustom = c.message.startsWith(CUSTOM_STUDY_PREFIX);
    return customOnly ? isCustom : !isCustom;
  });
  return clone(sortedByDateDesc(filtered));
}

export function updateContactStatus(id: string, status: ContactStatus, options?: { customOnly?: boolean }) {
  const customOnly = options?.customOnly === true;
  const idx = contacts.findIndex((c) => c.id === id);
  if (idx < 0) return null;
  const isCustom = contacts[idx].message.startsWith(CUSTOM_STUDY_PREFIX);
  if ((customOnly && !isCustom) || (!customOnly && isCustom)) return null;
  contacts[idx] = { ...contacts[idx], status };
  return clone(contacts[idx]);
}

export function deleteContact(id: string, options?: { customOnly?: boolean }) {
  const customOnly = options?.customOnly === true;
  const idx = contacts.findIndex((c) => c.id === id);
  if (idx < 0) return false;
  const isCustom = contacts[idx].message.startsWith(CUSTOM_STUDY_PREFIX);
  if ((customOnly && !isCustom) || (!customOnly && isCustom)) return false;
  contacts.splice(idx, 1);
  return true;
}

export function listCustomers() {
  return clone(sortedByDateDesc(customers));
}

export function listStudies() {
  return clone(sortedByDateDesc(studies));
}

export function getStudyById(id: string) {
  return clone(studies.find((s) => s.id === id) ?? null);
}

type CreateStudyInput = {
  title: string;
  sector: Sector;
  price: number;
  oldPrice?: number | null;
  status?: StudyStatus;
  shortDescription?: string | null;
  coverImage?: string | null;
  fileUrl?: string | null;
  deliverables?: string[];
  templateFoundingExpenses?: Array<{ name: string; amount: number }>;
  templateOperatingExpenses?: Array<{ month: number; name: string; amount: number }>;
  templateSales?: Array<{ month: number; amount: number }>;
};

export function createStudy(input: CreateStudyInput) {
  const created: StudyRecord = {
    id: nextId('std'),
    title: input.title,
    sector: input.sector,
    price: input.price,
    oldPrice: input.oldPrice ?? null,
    status: input.status ?? 'DRAFT',
    shortDescription: input.shortDescription ?? null,
    coverImage: input.coverImage ?? null,
    fileUrl: input.fileUrl ?? null,
    deliverables: input.deliverables ?? [],
    studyFoundingExpenses: (input.templateFoundingExpenses ?? []).map((r) => ({ id: nextId('fe'), ...r })),
    studyOperatingExpenses: (input.templateOperatingExpenses ?? []).map((r) => ({ id: nextId('oe'), ...r })),
    studySales: (input.templateSales ?? []).map((r) => ({ id: nextId('ss'), ...r })),
    createdAt: new Date(),
  };
  studies = [created, ...studies];
  return clone(created);
}

type UpdateStudyInput = Partial<CreateStudyInput>;

export function updateStudy(id: string, input: UpdateStudyInput) {
  const idx = studies.findIndex((s) => s.id === id);
  if (idx < 0) return null;

  const prev = studies[idx];
  const updated: StudyRecord = {
    ...prev,
    ...(input.title !== undefined && { title: input.title }),
    ...(input.sector !== undefined && { sector: input.sector }),
    ...(input.price !== undefined && { price: input.price }),
    ...(input.oldPrice !== undefined && { oldPrice: input.oldPrice ?? null }),
    ...(input.status !== undefined && { status: input.status }),
    ...(input.shortDescription !== undefined && { shortDescription: input.shortDescription ?? null }),
    ...(input.coverImage !== undefined && { coverImage: input.coverImage ?? null }),
    ...(input.fileUrl !== undefined && { fileUrl: input.fileUrl ?? null }),
    ...(input.deliverables !== undefined && { deliverables: input.deliverables }),
    ...(input.templateFoundingExpenses !== undefined && {
      studyFoundingExpenses: input.templateFoundingExpenses.map((r) => ({ id: nextId('fe'), ...r })),
    }),
    ...(input.templateOperatingExpenses !== undefined && {
      studyOperatingExpenses: input.templateOperatingExpenses.map((r) => ({ id: nextId('oe'), ...r })),
    }),
    ...(input.templateSales !== undefined && {
      studySales: input.templateSales.map((r) => ({ id: nextId('ss'), ...r })),
    }),
  };

  studies[idx] = updated;
  return clone(updated);
}

export function deleteStudy(id: string) {
  const idx = studies.findIndex((s) => s.id === id);
  if (idx < 0) return false;
  studies.splice(idx, 1);
  return true;
}

export function getContactsStatusReport() {
  const counts = { NEW: 0, REPLIED: 0, CLOSED: 0 } as Record<ContactStatus, number>;
  for (const c of contacts) counts[c.status] += 1;
  return {
    series: [counts.NEW, counts.REPLIED, counts.CLOSED],
    labels: ['NEW', 'REPLIED', 'CLOSED'],
    total: counts.NEW + counts.REPLIED + counts.CLOSED,
  };
}

export function getTopCustomersReport() {
  const mapped = customers
    .map((customer) => {
      const spend = customer.projects.reduce((sum, p) => sum + p.paidAmount, 0);
      const lastOrderAt = customer.projects.length
        ? new Date(Math.max(...customer.projects.map((p) => p.createdAt.getTime())))
        : null;
      return {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        orders: customer.projects.length,
        spend,
        lastOrderAt,
      };
    })
    .filter((c) => c.orders > 0)
    .sort((a, b) => b.spend - a.spend);

  return { customers: clone(mapped), total: mapped.length };
}

export function buildAnalytics(locale: string) {
  const allProjects = customers.flatMap((c) => c.projects);
  const totalStudies = studies.filter((s) => s.status === 'PUBLISHED').length;
  const totalCustomers = customers.length;
  const totalProjects = allProjects.length;
  const totalRevenue = allProjects.reduce((sum, p) => sum + p.paidAmount, 0);

  const nowDate = new Date();
  const monthBuckets: Record<string, { count: number; revenue: number }> = {};
  for (let i = 11; i >= 0; i--) {
    const d = new Date(nowDate);
    d.setMonth(d.getMonth() - i);
    monthBuckets[`${d.getFullYear()}-${d.getMonth()}`] = { count: 0, revenue: 0 };
  }

  for (const p of allProjects) {
    const key = `${p.createdAt.getFullYear()}-${p.createdAt.getMonth()}`;
    if (monthBuckets[key]) {
      monthBuckets[key].count += 1;
      monthBuckets[key].revenue += p.paidAmount;
    }
  }

  const monthlyCategories: string[] = [];
  const monthlyCounts: number[] = [];
  const monthlyRevenue: number[] = [];
  for (const [key, val] of Object.entries(monthBuckets)) {
    const [, month] = key.split('-').map(Number);
    monthlyCategories.push(new Intl.DateTimeFormat(locale, { month: 'short' }).format(new Date(2000, month, 1)));
    monthlyCounts.push(val.count);
    monthlyRevenue.push(Math.round(val.revenue));
  }

  const weekBuckets: { label: string; count: number; capital: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(nowDate);
    d.setDate(d.getDate() - i);
    weekBuckets.push({
      label: new Intl.DateTimeFormat(locale, { weekday: 'short' }).format(d),
      count: 0,
      capital: 0,
    });
  }

  for (const p of allProjects) {
    const daysDiff = Math.floor((nowDate.getTime() - p.createdAt.getTime()) / (24 * 60 * 60 * 1000));
    if (daysDiff >= 0 && daysDiff <= 6) {
      const idx = 6 - daysDiff;
      weekBuckets[idx].count += 1;
      weekBuckets[idx].capital += p.paidAmount;
    }
  }

  const sectorCount = new Map<string, number>();
  for (const p of allProjects) {
    sectorCount.set(p.sector, (sectorCount.get(p.sector) ?? 0) + 1);
  }

  return {
    stats: { totalStudies, totalCustomers, totalProjects, totalRevenue },
    monthly: {
      categories: monthlyCategories,
      counts: monthlyCounts,
      revenue: monthlyRevenue,
    },
    weekly: {
      categories: weekBuckets.map((b) => b.label),
      counts: weekBuckets.map((b) => b.count),
      revenue: weekBuckets.map((b) => Math.round(b.capital)),
    },
    sectors: Array.from(sectorCount.entries()).map(([sector, count]) => ({ sector, count })),
  };
}
