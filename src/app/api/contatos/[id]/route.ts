import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logToFile } from '@/lib/logger';

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id);

  try {
    await prisma.contato.delete({
      where: { id },
    });

    logToFile(`Contato deletado via /[id]: ID ${id}`);
    return NextResponse.json({ message: 'Contato deletado com sucesso' }, { status: 200 });
  } catch (error: any) {
    console.error(error);
    logToFile(`Erro ao deletar contato ID ${id}: ${error.message}`);
    return NextResponse.json({ error: 'Erro ao deletar contato' }, { status: 500 });
  }
}

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const { id } = await params

  const contato = await prisma.contato.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      telefones: true,
    },
  });

  if (!contato) {
    return NextResponse.json({ error: 'Contato não encontrado' }, { status: 404 });
  }

  return NextResponse.json(contato);
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const { nome, idade, telefones } = await req.json();
  const { id } = await params
   

  const contatoAtualizado = await prisma.contato.update({
    where: {
      id: Number(id),
    },
    data: {
      nome,
      idade,
      telefones: {
        deleteMany: {}, // Remove os antigos
        create: telefones.map((numero: string) => ({ numero })),
      },
    },
    include: {
      telefones: true,
    },
  });

  return NextResponse.json(contatoAtualizado);
}
