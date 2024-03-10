import { LoanApplication, LoanApplicationStatus } from '../model';
import { CreateLoanApplicationCommand } from '../commands';
import {
  CustomerRepository,
  LoanApplicationRepository,
  LoanTypeRepository,
} from '../repositories';

export type LoanApplicationService = {
  createLoanApplication: (
    request: CreateLoanApplicationCommand
  ) => Promise<LoanApplication>;
};

async function createLoanApplication({
  customerEmail,
  loanTypeName,
  amount,
  termMonths,
}: CreateLoanApplicationCommand): Promise<LoanApplication> {
  const customerId =
    await CustomerRepository.findCustomerIdByEmailOrThrow(customerEmail);

  const loanType =
    await LoanTypeRepository.findLoanTypeModelByNameOrThrow(loanTypeName);

  const loanApplication = await LoanApplicationRepository.createLoanApplication(
    customerId,
    loanType.id,
    amount,
    termMonths
  );

  if (amount > loanType.maxAmount.toNumber()) {
    return await rejectApplication(
      loanApplication,
      'The requested amount is greater than the maximum amount for the loan type.'
    );
  }
  if (termMonths > loanType.maxTermMonths) {
    return await rejectApplication(
      loanApplication,
      'The requested term in months is greater than the maximum term in months for the loan type.'
    );
  }

  return await approveApplication(loanApplication);
}

async function rejectApplication(
  application: LoanApplication,
  reason: string
): Promise<LoanApplication> {
  return await changeApplicationStatus(application, 'REJECTED', reason);
}

async function approveApplication(application: LoanApplication) {
  application.approval =
    await LoanApplicationRepository.addApproval(application);

  return await changeApplicationStatus(application, 'APPROVED');
}

async function changeApplicationStatus(
  loanApplication: LoanApplication,
  status: LoanApplicationStatus,
  reason?: string
) {
  const history = await LoanApplicationRepository.addApplicationHistory(
    loanApplication.id!,
    status,
    reason
  );
  loanApplication.history.push(history);
  loanApplication.updatedAt =
    await LoanApplicationRepository.updateLoanApplicationStatus(
      loanApplication.id!,
      status
    );
  loanApplication.status = status;
  return loanApplication;
}

const DefaultLoanApplicationService: LoanApplicationService = {
  createLoanApplication,
};

export default DefaultLoanApplicationService;
