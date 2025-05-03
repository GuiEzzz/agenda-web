"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface Telefone {
  id: number;
  numero: string;
}

interface Contato {
  id: number;
  nome: string;
  idade: number;
  telefones: Telefone[];
}

export default function HomePage() {
  const [contatos, setContatos] = useState<Contato[]>([]);
  const [busca, setBusca] = useState("");

  useEffect(() => {
    fetch("/api/contatos")
      .then((res) => res.json())
      .then(setContatos);
  }, []);

  const excluirContato = async (id: number) => {
    if (!confirm("Deseja excluir este contato?")) return;

    await fetch(`/api/contatos/${id}`, {
      method: "DELETE",
    });

    setContatos((prev) => prev.filter((c) => c.id !== id));
  };

  const filtrados = contatos.filter(
    (c) =>
      c.nome.toLowerCase().includes(busca.toLowerCase()) ||
      c.telefones.some((t) => t.numero.includes(busca))
  );

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Agenda Telefônica</h1>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Buscar por nome ou telefone..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="flex-1 border p-2 rounded"
        />
        <Link
          href="/cadastro"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Novo Contato
        </Link>
      </div>

      <ul className="space-y-2">
        {filtrados.map((contato) => (
          <li
            key={contato.id}
            className="border p-4 rounded flex justify-between items-center"
          >
            <div>
              <strong>{contato.nome}</strong> ({contato.idade} anos)<br />
              Telefones:{" "}
              {contato.telefones.map((t) => t.numero).join(", ")}
            </div>
            <div className="flex gap-2">
              <Link href={`/cadastro?id=${contato.id}`} className="text-blue-600">
                Editar
              </Link>
              <button
                onClick={() => excluirContato(contato.id)}
                className="text-red-600"
              >
                Excluir
              </button>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}