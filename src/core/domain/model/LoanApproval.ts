import { z } from 'zod';
import { LoanApproval as LoanApprovalModel } from '@prisma/client';

export const LoanApprovalSchema = z.object({
  approvalDate: z.date(),
  approvedAmount: z.number(),
  approvedTermMonths: z.number().int(),
  approvedInterestRate: z.number(),
});

export type LoanApproval = z.infer<typeof LoanApprovalSchema>;

export function fromLoanApprovalModel({
  approvalDate,
  approvedAmount,
  approvedTermMonths,
  approvedInterestRate,
}: LoanApprovalModel): LoanApproval {
  return {
    approvalDate,
    approvedAmount: approvedAmount.toNumber(),
    approvedTermMonths,
    approvedInterestRate: approvedInterestRate.toNumber(),
  };
}
