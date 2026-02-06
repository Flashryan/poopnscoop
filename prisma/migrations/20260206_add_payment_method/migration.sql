-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('online', 'bank_transfer', 'cash');

-- AlterTable
ALTER TABLE "Enquiry" ADD COLUMN "payment_method" "PaymentMethod";
