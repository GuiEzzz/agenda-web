-- CreateTable
CREATE TABLE "Contato" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "idade" INTEGER NOT NULL,

    CONSTRAINT "Contato_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Telefone" (
    "id" SERIAL NOT NULL,
    "numero" TEXT NOT NULL,
    "contatoId" INTEGER NOT NULL,

    CONSTRAINT "Telefone_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Telefone" ADD CONSTRAINT "Telefone_contatoId_fkey" FOREIGN KEY ("contatoId") REFERENCES "Contato"("id") ON DELETE CASCADE ON UPDATE CASCADE;
