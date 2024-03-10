import { z } from 'zod';
import { LoanType as LoanTypeModel } from '@prisma/client';

export const LoanTypeSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string(),
  interestRate: z
    .number()
    .gt(0, 'The interest rate must be greater than zero.'),
  maxAmount: z.number().gt(0, 'The maximum amount must be greater than zero.'),
  maxTermMonths: z
    .number()
    .int('The maximum term in months must be an integer number.')
    .gt(0, 'The maximum term in months must be greater than zero.'),
});

export type LoanType = z.infer<typeof LoanTypeSchema>;

export function fromLoanTypeModel({
  name,
  description,
  interestRate,
  maxAmount,
  maxTermMonths,
}: LoanTypeModel): LoanType {
  return {
    name,
    description,
    interestRate: interestRate.toNumber(),
    maxAmount: maxAmount.toNumber(),
    maxTermMonths,
  };
}
