import { LoanType, Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type InsertLoanType = Omit<LoanType, 'id' | 'createdAt' | 'updatedAt'>;

const initialLoanTypes: InsertLoanType[] = [
  {
    name: 'Working Capital Loan',
    description: 'Short-term loan for daily operational expenses',
    interestRate: new Prisma.Decimal(7.0),
    maxAmount: new Prisma.Decimal(50000.0),
    maxTermMonths: 24,
  },
  {
    name: 'Equipment Financing',
    description: 'Loan to purchase or lease business equipment',
    interestRate: new Prisma.Decimal(6.5),
    maxAmount: new Prisma.Decimal(75000.0),
    maxTermMonths: 60,
  },
  {
    name: 'Business Expansion Loan',
    description: 'Long-term loan for expanding business operations',
    interestRate: new Prisma.Decimal(8.0),
    maxAmount: new Prisma.Decimal(150000.0),
    maxTermMonths: 120,
  },
  {
    name: 'Startup Loan',
    description: 'Funding for new business ventures or startups',
    interestRate: new Prisma.Decimal(9.5),
    maxAmount: new Prisma.Decimal(30000.0),
    maxTermMonths: 36,
  },
  {
    name: 'Inventory Financing',
    description: 'Loan to purchase inventory or manage stock',
    interestRate: new Prisma.Decimal(7.5),
    maxAmount: new Prisma.Decimal(40000.0),
    maxTermMonths: 48,
  },
];

async function seed() {
  for (const loanType of initialLoanTypes) {
    await upsertLoanType(loanType);
  }
  await prisma.customer.upsert({
    where: {
      email: 'john.doe@example.com',
    },
    update: {},
    create: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phoneNumber: '+1 (555) 123-4567',
      address: '123 Main Street, Cityville',
    },
  });
}

async function upsertLoanType({
  name,
  description,
  interestRate,
  maxAmount,
  maxTermMonths,
}: InsertLoanType) {
  await prisma.loanType.upsert({
    where: {
      name,
    },
    update: {},
    create: {
      name,
      description,
      interestRate,
      maxAmount,
      maxTermMonths,
    },
  });
}

(async function performSeed() {
  try {
    await seed();
    prisma.$disconnect();
  } catch (e) {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  }
})();
