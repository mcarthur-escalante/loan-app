import { prisma } from '.';
import { LoanType as LoanTypeModel } from '@prisma/client';
import { fromLoanTypeModel, LoanType } from '../model';
import { TRPCError } from '@trpc/server';

export type LoanTypeRepository = {
  getLoanTypes: () => Promise<LoanType[]>;
  findLoanTypeModelByNameOrThrow: (name: string) => Promise<LoanTypeModel>;
};

async function getLoanTypes(): Promise<LoanType[]> {
  return (await prisma.loanType.findMany()).map(fromLoanTypeModel);
}

async function findLoanTypeModelByNameOrThrow(
  name: string
): Promise<LoanTypeModel> {
  const loanTypeModel = await prisma.loanType.findUnique({
    where: { name },
  });
  if (!loanTypeModel) {
    throw new TRPCError({
      message: `Loan Type with name '${name}' was not found.`,
      code: 'BAD_REQUEST',
    });
  }
  return loanTypeModel;
}

const DefaultLoanTypeRepository: LoanTypeRepository = {
  getLoanTypes,
  findLoanTypeModelByNameOrThrow,
};

export default DefaultLoanTypeRepository;
