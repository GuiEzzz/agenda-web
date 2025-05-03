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
  ).sort((a, b) => a.nome.localeCompare(b.nome));

  return (
    <main className="max-w-3xl mx-auto p-6 min-h-screen bg-gray-900 text-white">
      <h1 className="text-3xl font-bold text-center mb-6">Agenda Telefônica</h1>

      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Buscar por nome ou telefone..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="flex-1 bg-gray-800 border border-gray-700 p-2 rounded-md shadow-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
        <Link
          href="/cadastro"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition"
        >
          Novo Contato
        </Link>
      </div>

      {/* Contêiner com rolagem quando houver muitos contatos */}
      <div className="max-h-[500px] overflow-y-auto space-y-4">
        <ul>
          {filtrados.map((contato, index) => (
            <li
              key={contato.id}
              className={`${
                index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-700'
              } shadow-md rounded-lg p-2 flex justify-between items-start transition-all transform hover:scale-100 hover:shadow-lg overflow-hidden`}
            >
              <div className="max-w-full overflow-hidden">
                <p className="font-semibold text-md text-white truncate">{contato.nome}</p>
                <p className="text-xs text-gray-400 mb-1">{contato.idade} anos</p>
                <p className="text-xs text-gray-300">
                  Telefones:{" "}
                  <span className="font-medium text-white">
                    {contato.telefones.map((t) => t.numero).join(", ")}
                  </span>
                </p>
              </div>
              <div className="flex flex-col gap-1 items-end text-xs">
                <Link
                  href={`/cadastro?id=${contato.id}`}
                  className="text-blue-400 hover:underline transition-all duration-200"
                >
                  Editar
                </Link>
                <button
                  onClick={() => excluirContato(contato.id)}
                  className="text-red-400 hover:text-red-600 transition-all duration-200"
                >
                  Excluir
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {filtrados.length === 0 && (
        <p className="text-center text-gray-500 mt-6">
          Nenhum contato encontrado.
        </p>
      )}
    </main>
  );
}
