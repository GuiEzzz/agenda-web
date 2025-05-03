📒 Cadastro de Contatos
Este é um sistema simples de cadastro de contatos com Next.js, Prisma e PostgreSQL, que permite criar, visualizar, editar e excluir contatos com múltiplos números de telefone.

🚀 Tecnologias Utilizadas
Next.js 14

React

Prisma ORM

PostgreSQL

Tailwind CSS

TypeScript

🧰 Funcionalidades
Cadastro de novo contato

Edição de contato existente

Adição e remoção dinâmica de telefones

Exclusão de contatos

Validação de campos (ex: idade máxima de 100 anos)

Interface amigável com inputs flutuantes

📦 Instalação
Clone o repositório

bash
Copy
Edit
git clone https://github.com/seu-usuario/cadastro-contatos.git
cd cadastro-contatos
Instale as dependências

bash
Copy
Edit
npm install
Configure o banco de dados

Crie um banco de dados PostgreSQL local ou use um remoto.

Copie o arquivo .env.example para .env:

bash
Copy
Edit
cp .env.example .env
No .env, edite a variável DATABASE_URL com a URL do seu banco:

bash
Copy
Edit
DATABASE_URL=postgresql://usuario:senha@localhost:5432/nomedobanco
Rode as migrações com Prisma

bash
Copy
Edit
npx prisma migrate dev --name init
Execute o servidor

bash
Copy
Edit
npm run dev
🗃️ Estrutura do Banco (Prisma)
prisma
Copy
Edit
model Contato {
  id        Int        @id @default(autoincrement())
  nome      String
  idade     Int
  telefones Telefone[]
}

model Telefone {
  id        Int     @id @default(autoincrement())
  numero    String
  contatoId Int
  contato   Contato @relation(fields: [contatoId], references: [id], onDelete: Cascade)
}
🔄 Rotas da API
Método	Rota	Descrição
GET	/api/contatos	Lista todos os contatos
POST	/api/contatos	Cria novo contato
GET	/api/contatos/[id]	Retorna contato por ID
PUT	/api/contatos/[id]	Atualiza um contato existente
DELETE	/api/contatos/[id]	Remove um contato

🧪 Validações
A idade não pode ser maior que 100.

Telefones em branco são automaticamente ignorados.

Campos obrigatórios: nome e idade.

📸 Interface
A interface foi criada com Tailwind CSS e permite adicionar/remover campos de telefone dinamicamente com facilidade.

✍️ Contribuição
Pull requests são bem-vindos! Sinta-se livre para sugerir melhorias, corrigir bugs ou propor novas funcionalidades.