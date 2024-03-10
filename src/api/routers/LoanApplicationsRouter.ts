import { z } from 'zod';
import { publicProcedure, trpc } from '../trpc';
import { LoanApplicationSchema } from '../../core/domain/model';
import { LoanApplicationRepository } from '../../core/domain/repositories';
import { CreateLoanApplicationCommandSchema } from '../../core/domain/commands';
import { LoanApplicationService } from '../../core/domain/services';

export const loanApplicationsRouter = trpc.router({
  getAllLoanApplications: publicProcedure
    .meta({
      openapi: {
        method: 'GET',
        path: '/applications',
        tags: ['Loan Applications'],
        summary: 'Get all Loan Applications',
      },
    })
    .input(z.object({}))
    .output(z.array(LoanApplicationSchema))
    .query((_) => LoanApplicationRepository.getAllLoanApplications()),

  findApplicationById: publicProcedure
    .meta({
      openapi: {
        method: 'GET',
        path: '/applications/{id}',
        tags: ['Loan Applications'],
        summary: 'Find Loan Application by ID.',
      },
    })
    .input(z.object({ id: z.string() }))
    .output(LoanApplicationSchema)
    .query(({ input }) =>
      LoanApplicationRepository.findApplicationById(input.id)
    ),

  createLoanApplication: publicProcedure
    .meta({
      openapi: {
        method: 'POST',
        path: '/applications',
        tags: ['Loan Applications'],
        summary: 'Create a Loan Application',
      },
    })
    .input(CreateLoanApplicationCommandSchema)
    .output(LoanApplicationSchema)
    .mutation(({ input }) =>
      LoanApplicationService.createLoanApplication(input)
    ),
});
