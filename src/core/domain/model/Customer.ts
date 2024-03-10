import { z } from 'zod';
import { Customer as CustomerModel } from '@prisma/client';

export const CustomerSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  phoneNumber: z.string(),
  address: z.string(),
});

export type Customer = z.infer<typeof CustomerSchema>;

export function fromCustomerModel({
  firstName,
  lastName,
  email,
  phoneNumber,
  address,
}: CustomerModel): Customer {
  return { firstName, lastName, email, phoneNumber, address };
}
