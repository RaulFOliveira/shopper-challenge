-- CreateEnum
CREATE TYPE "MeasureType" AS ENUM ('WATER', 'GAS');

-- CreateTable
CREATE TABLE "leituras" (
    "measure_uuid" TEXT NOT NULL,
    "image_url" VARCHAR(1000) NOT NULL,
    "customer_code" TEXT NOT NULL,
    "measure_datetime" TIMESTAMP(3) NOT NULL,
    "measure_type" "MeasureType" NOT NULL,
    "measure_value" INTEGER NOT NULL DEFAULT 0,
    "has_confirmed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "leituras_pkey" PRIMARY KEY ("measure_uuid")
);
