import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id)

  try {
    await prisma.contato.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Contato deletado com sucesso' }, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Erro ao deletar contato' }, { status: 500 })
  }
}

export async function GET(_req: Request, { params }: { params: { id: string } }) {
    const contato = await prisma.contato.findUnique({
      where: {
        id: Number(params.id),
      },
      include: {
        telefones: true,
      },
    })
  
    if (!contato) {
      return NextResponse.json({ error: 'Contato não encontrado' }, { status: 404 })
    }
  
    return NextResponse.json(contato)
  }
  
  export async function PUT(req: Request, { params }: { params: { id: string } }) {
    const { nome, idade, telefones } = await req.json()
  
    // Atualiza os dados do contato
    const contatoAtualizado = await prisma.contato.update({
      where: {
        id: Number(params.id),
      },
      data: {
        nome,
        idade,
        telefones: {
          deleteMany: {}, // Remove os antigos
          create: telefones.map((numero: string) => ({ numero })), // Adiciona os novos
        },
      },
      include: {
        telefones: true,
      },
    })
  
    return NextResponse.json(contatoAtualizado)
  }
  