-- AlterTable
ALTER TABLE "leads" 
ADD COLUMN IF NOT EXISTS "ownerId" INTEGER,
ADD COLUMN IF NOT EXISTS "tipo_cortina" VARCHAR(100),
ADD COLUMN IF NOT EXISTS "espaco_cortina" VARCHAR(100),
ADD COLUMN IF NOT EXISTS "translucidez" VARCHAR(100),
ADD COLUMN IF NOT EXISTS "forro" VARCHAR(100),
ADD COLUMN IF NOT EXISTS "endereco" VARCHAR(255);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Lead_ownerId_idx" ON "leads"("ownerId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Lead_origem_idx" ON "leads"("origem");
