import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

export async function shutdownDatabase() {
  console.log('Shutting down...');
  try {
    await prisma.$disconnect();
    process.exit(0);
  } catch (e) {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  }
}

export * from './sample-database';
export { default as CustomerRepository } from './CustomerRepository';
export { default as LoanTypeRepository } from './LoanTypeRepository';
export { default as LoanApplicationRepository } from './LoanApplicationRepository';
