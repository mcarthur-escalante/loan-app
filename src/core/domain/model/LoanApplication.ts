import { string, z } from 'zod';
import { CustomerSchema, fromCustomerModel } from './Customer';
import { fromLoanTypeModel, LoanTypeSchema } from './LoanType';
import {
  ApplicationHistorySchema,
  fromApplicationHistoryModel,
} from './ApplicationHistory';
import { fromLoanApprovalModel, LoanApprovalSchema } from './LoanApproval';
import {
  LoanApplication as LoanApplicationModel,
  LoanApplicationStatus as LoanApplicationStatusModel,
} from '@prisma/client';

export const LoanApplicationStatusSchema = z.nativeEnum(
  LoanApplicationStatusModel
);

export type LoanApplicationStatus = z.infer<typeof LoanApplicationStatusSchema>;

export const LoanApplicationSchema = z.object({
  id: string().length(21).optional(),
  createdAt: z.date().nullish(),
  updatedAt: z.date().nullish(),
  applicationDate: z.date().optional(),
  amount: z.number().gt(0, 'The amount must be greater than zero.'),
  termMonths: z
    .number()
    .int('The loan term in months must be an integer number.')
    .gt(0, 'The loan term in months must be greater than zero.'),
  status: LoanApplicationStatusSchema,
  customer: CustomerSchema,
  loanType: LoanTypeSchema,
  history: z.array(ApplicationHistorySchema),
  approval: LoanApprovalSchema.optional(),
});

export type LoanApplication = z.infer<typeof LoanApplicationSchema>;

export function fromLoanApplicationModel({
  id,
  customer,
  applicationDate,
  amount,
  termMonths,
  loanType,
  status,
  history,
  approval,
  createdAt,
  updatedAt,
}: LoanApplicationModel): LoanApplication {
  return {
    id,
    customer: fromCustomerModel(customer),
    applicationDate,
    amount: amount.toNumber(),
    termMonths,
    loanType: fromLoanTypeModel(loanType),
    status,
    history: history.map(fromApplicationHistoryModel),
    approval: approval ? fromLoanApprovalModel(approval) : undefined,
    createdAt: createdAt || undefined,
    updatedAt: updatedAt || undefined,
  };
}
