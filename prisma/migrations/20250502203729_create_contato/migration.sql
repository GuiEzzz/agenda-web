/*
  Warnings:

  - You are about to drop the column `contatoId` on the `Telefone` table. All the data in the column will be lost.
  - Added the required column `contato_id` to the `Telefone` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Telefone" DROP CONSTRAINT "Telefone_contatoId_fkey";

-- AlterTable
ALTER TABLE "Telefone" DROP COLUMN "contatoId",
ADD COLUMN     "contato_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Telefone" ADD CONSTRAINT "Telefone_contato_id_fkey" FOREIGN KEY ("contato_id") REFERENCES "Contato"("id") ON DELETE CASCADE ON UPDATE CASCADE;
