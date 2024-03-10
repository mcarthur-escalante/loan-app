import { prisma } from '.';
import { Customer, fromCustomerModel } from '../model';
import { TRPCError } from '@trpc/server';

export type CustomerRepository = {
  getAllCustomers: () => Promise<Customer[]>;
  findCustomerIdByEmailOrThrow: (customerEmail: string) => Promise<string>;
};

async function getAllCustomers(): Promise<Customer[]> {
  return (await prisma.customer.findMany()).map(fromCustomerModel);
}

async function findCustomerIdByEmailOrThrow(
  customerEmail: string
): Promise<string> {
  const customerModel = await prisma.customer.findUnique({
    where: { email: customerEmail },
    select: { id: true },
  });
  if (!customerModel?.id) {
    throw new TRPCError({
      message: `Customer with email '${customerEmail}' was not found.`,
      code: 'BAD_REQUEST',
    });
  }
  return customerModel.id;
}

const DefaultCustomerRepository: CustomerRepository = {
  getAllCustomers,
  findCustomerIdByEmailOrThrow,
};

export default DefaultCustomerRepository;
