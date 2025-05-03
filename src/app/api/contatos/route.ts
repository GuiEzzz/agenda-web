import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'   

export async function POST(request: Request) {
  const { nome, idade, telefones } = await request.json()

  const novoContato = await prisma.contato.create({
    data: {
      nome,
      idade,
      telefones: {
        create: telefones.map((numero: string) => ({ numero }))
      }
    }
  })

  return NextResponse.json(novoContato)
}

export async function GET() {
    const contatos = await prisma.contato.findMany({
      include: {
        telefones: true
      }
    })
  
    return NextResponse.json(contatos)
  }

  export async function DELETE(request: Request) {
    const { id } = await request.json()
  
    try {
      // Deleta os telefones relacionados primeiro (opcional se estiver usando onDelete: Cascade no schema)
      await prisma.telefone.deleteMany({
        where: {
          contatoId: id
        }
      })
  
      // Depois deleta o contato
      await prisma.contato.delete({
        where: {
          id
        }
      })
  
      return NextResponse.json({ message: 'Contato deletado com sucesso' }, { status: 200 })
    } catch (error) {
      console.error(error)
      return NextResponse.json({ error: 'Erro ao deletar contato' }, { status: 500 })
    }
  }
  