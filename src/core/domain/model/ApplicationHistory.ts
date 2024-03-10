import { z } from 'zod';
import {
  ApplicationHistory as ApplicationHistoryModel,
  LoanApplicationStatus,
} from '@prisma/client';

export const ApplicationHistorySchema = z.object({
  status: z.nativeEnum(LoanApplicationStatus),
  statusReason: z.string().nullish(),
  createdAt: z.date(),
});

export type ApplicationHistory = z.infer<typeof ApplicationHistorySchema>;

export function fromApplicationHistoryModel({
  status,
  createdAt,
  statusReason,
}: ApplicationHistoryModel): ApplicationHistory {
  return { status, createdAt, statusReason: statusReason || undefined };
}
