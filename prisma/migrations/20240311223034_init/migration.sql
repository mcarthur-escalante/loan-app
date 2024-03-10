-- CreateEnum
CREATE TYPE "LoanApplicationStatus" AS ENUM ('IN_PROGRESS', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "customers" (
    "id" CHAR(21) NOT NULL,
    "first_name" VARCHAR(255) NOT NULL,
    "last_name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "phone_number" VARCHAR(20) NOT NULL,
    "address" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "loan_applications" (
    "id" CHAR(21) NOT NULL,
    "customer_id" CHAR(21) NOT NULL,
    "loan_type_id" CHAR(21) NOT NULL,
    "amount" DECIMAL(15,2) NOT NULL,
    "term_months" INTEGER NOT NULL,
    "application_date" DATE NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "status" "LoanApplicationStatus" NOT NULL,

    CONSTRAINT "loan_applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "application_history" (
    "id" CHAR(21) NOT NULL,
    "application_id" CHAR(21) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "LoanApplicationStatus" NOT NULL,
    "status_reason" TEXT,

    CONSTRAINT "application_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "loan_approvals" (
    "id" CHAR(21) NOT NULL,
    "application_id" CHAR(21) NOT NULL,
    "approval_date" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approved_amount" DECIMAL(15,2) NOT NULL,
    "approved_term_months" INTEGER NOT NULL,
    "approved_interest_rate" DECIMAL(5,2) NOT NULL,

    CONSTRAINT "loan_approvals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "loan_types" (
    "id" CHAR(21) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "interest_rate" DECIMAL(5,2) NOT NULL,
    "max_amount" DECIMAL(15,2) NOT NULL,
    "max_term_months" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "loan_types_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "customers_email_key" ON "customers"("email");

-- CreateIndex
CREATE UNIQUE INDEX "loan_approvals_application_id_key" ON "loan_approvals"("application_id");

-- CreateIndex
CREATE UNIQUE INDEX "loan_types_name_key" ON "loan_types"("name");

-- AddForeignKey
ALTER TABLE "loan_applications" ADD CONSTRAINT "loan_applications_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "loan_applications" ADD CONSTRAINT "loan_applications_loan_type_id_fkey" FOREIGN KEY ("loan_type_id") REFERENCES "loan_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "application_history" ADD CONSTRAINT "application_history_application_id_fkey" FOREIGN KEY ("application_id") REFERENCES "loan_applications"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loan_approvals" ADD CONSTRAINT "loan_approvals_application_id_fkey" FOREIGN KEY ("application_id") REFERENCES "loan_applications"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
