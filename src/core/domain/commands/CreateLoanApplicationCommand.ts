import { z } from 'zod';

export const CreateLoanApplicationCommandSchema = z.object({
  customerEmail: z.string().email(),
  loanTypeName: z.string(),
  amount: z.number().gt(0, 'The amount must be greater than zero.'),
  termMonths: z
    .number()
    .int('The term in months must be an integer.')
    .gt(0, 'The term in months must be greater than zero.'),
});

export type CreateLoanApplicationCommand = z.infer<
  typeof CreateLoanApplicationCommandSchema
>;
