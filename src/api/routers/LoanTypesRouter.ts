import { z } from 'zod';
import { publicProcedure, trpc } from '../trpc';
import { LoanTypeSchema } from '../../core/domain/model';
import { LoanTypeRepository } from '../../core/domain/repositories';

export const loanTypesRouter = trpc.router({
  getLoanTypes: publicProcedure
    .meta({
      openapi: {
        method: 'GET',
        path: '/loan-types',
        tags: ['Loan Types'],
        summary: 'Get all Loan Types',
      },
    })
    .input(z.object({}))
    .output(z.array(LoanTypeSchema))
    .query((_) => LoanTypeRepository.getLoanTypes()),
});
