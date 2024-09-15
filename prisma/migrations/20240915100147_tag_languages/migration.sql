/*
  Warnings:

  - You are about to drop the column `name` on the `tags` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[fsValue]` on the table `tags` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[bsValue]` on the table `tags` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `bsValue` to the `tags` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fsValue` to the `tags` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "tags_name_key";

-- AlterTable
ALTER TABLE "tags" DROP COLUMN "name",
ADD COLUMN     "bsValue" VARCHAR NOT NULL,
ADD COLUMN     "fsValue" VARCHAR NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "tags_fsValue_key" ON "tags"("fsValue");

-- CreateIndex
CREATE UNIQUE INDEX "tags_bsValue_key" ON "tags"("bsValue");
