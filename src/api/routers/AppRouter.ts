import { trpc } from '../trpc';
import { loanTypesRouter } from './LoanTypesRouter';
import { loanApplicationsRouter } from './LoanApplicationsRouter';
import { customersRouter } from './CustomersRouter';

export const appRouter = trpc.router({
  customers: customersRouter,
  loanTypes: loanTypesRouter,
  loanApplications: loanApplicationsRouter,
});
