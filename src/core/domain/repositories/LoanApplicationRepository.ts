import { prisma } from '.';
import { Prisma } from '@prisma/client';
import {
  ApplicationHistory,
  fromApplicationHistoryModel,
  fromLoanApplicationModel,
  fromLoanApprovalModel,
  LoanApplication,
  LoanApplicationStatus,
  LoanApproval,
} from '../model';
import { TRPCError } from '@trpc/server';

export type LoanApplicationRepository = {
  getAllLoanApplications: () => Promise<LoanApplication[]>;

  findApplicationById: (id: string) => Promise<LoanApplication>;

  createLoanApplication: (
    ustomerId: string,
    loanTypeId: string,
    amount: number,
    termMonths: number
  ) => Promise<LoanApplication>;

  addApproval: (application: LoanApplication) => Promise<LoanApproval>;

  addApplicationHistory: (
    applicationId: string,
    status: LoanApplicationStatus,
    statusReason?: string
  ) => Promise<ApplicationHistory>;

  updateLoanApplicationStatus: (
    applicationId: string,
    status: LoanApplicationStatus
  ) => Promise<Date>;
};

async function getAllLoanApplications(): Promise<LoanApplication[]> {
  const loanApplicationModels = await prisma.loanApplication.findMany({
    include: {
      customer: true,
      loanType: true,
      history: true,
      approval: true,
    },
  });
  return loanApplicationModels.map(fromLoanApplicationModel);
}

async function findApplicationById(id: string): Promise<LoanApplication> {
  const application = await prisma.loanApplication.findUnique({
    where: {
      id,
    },
    include: {
      customer: true,
      loanType: true,
      history: true,
      approval: true,
    },
  });

  if (!application) {
    throw new TRPCError({
      message: `Loan Application with id '${id}' was not found`,
      code: 'BAD_REQUEST',
    });
  }

  return fromLoanApplicationModel(application);
}

async function createLoanApplication(
  customerId: string,
  loanTypeId: string,
  amount: number,
  termMonths: number
): Promise<LoanApplication> {
  return fromLoanApplicationModel(
    await prisma.loanApplication.create({
      data: {
        customerId,
        loanTypeId,
        amount: new Prisma.Decimal(amount),
        termMonths: termMonths,
        applicationDate: new Date(),
        status: 'IN_PROGRESS',
        history: {
          create: {
            status: 'IN_PROGRESS',
          },
        },
      },
      include: {
        customer: true,
        loanType: true,
        history: true,
        approval: true,
      },
    })
  );
}

async function updateLoanApplicationStatus(
  applicationId: string,
  status: LoanApplicationStatus
): Promise<Date> {
  const updatedAt = new Date();
  await prisma.loanApplication.update({
    where: {
      id: applicationId,
    },
    data: {
      status,
      updatedAt,
    },
  });
  return updatedAt;
}

async function addApproval(
  application: LoanApplication
): Promise<LoanApproval> {
  return fromLoanApprovalModel(
    await prisma.loanApproval.create({
      data: {
        applicationId: application.id!,
        approvedAmount: application.amount,
        approvedTermMonths: application.termMonths,
        approvedInterestRate: application.loanType.interestRate,
      },
    })
  );
}

async function addApplicationHistory(
  applicationId: string,
  status: LoanApplicationStatus,
  statusReason?: string
): Promise<ApplicationHistory> {
  return fromApplicationHistoryModel(
    await prisma.applicationHistory.create({
      data: {
        applicationId,
        status,
        statusReason,
      },
    })
  );
}

const DefaultLoanApplicationRepository: LoanApplicationRepository = {
  getAllLoanApplications,
  findApplicationById,
  createLoanApplication,
  addApproval,
  addApplicationHistory,
  updateLoanApplicationStatus,
};

export default DefaultLoanApplicationRepository;
