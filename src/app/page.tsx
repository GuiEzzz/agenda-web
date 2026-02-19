"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

// Interfaces mantidas...
interface Telefone { id: number; numero: string; }
interface Contato { id: number; nome: string; idade: number; telefones: Telefone[]; }

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
    await fetch(`/api/contatos/${id}`, { method: "DELETE" });
    setContatos((prev) => prev.filter((c) => c.id !== id));
  };

  const apenasNumeros = (valor: string) => valor.replace(/\D/g, "");
  const buscaNormalizada = apenasNumeros(busca);

  const filtrados = contatos
    .filter((c) => {
      const nomeMatch = c.nome.toLowerCase().includes(busca.toLowerCase());
      const telefoneMatch = c.telefones.some((t) => apenasNumeros(t.numero).includes(buscaNormalizada));
      return nomeMatch || telefoneMatch;
    })
    .sort((a, b) => a.nome.localeCompare(b.nome));

  return (
    <main className="min-h-screen bg-[#0f172a] text-slate-200 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
              Minha Agenda
            </h1>
            <p className="text-slate-400 text-sm mt-1">Gerencie seus contatos com facilidade</p>
          </div>
          
          <Link
            href="/cadastro"
            className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-lg shadow-blue-900/20 active:scale-95"
          >
            + Novo Contato
          </Link>
        </header>

        {/* Search Bar */}
        <div className="relative mb-8">
          <input
            type="text"
            placeholder="Buscar por nome ou telefone..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full bg-slate-800/50 border border-slate-700 p-4 pl-12 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder-slate-500"
          />
          <span className="absolute left-4 top-4 text-slate-500">🔍</span>
        </div>

        {/* Contacts Grid/List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtrados.map((contato) => (
            <div
              key={contato.id}
              className="bg-slate-800 border border-slate-700/50 p-5 rounded-2xl hover:border-slate-500 transition-all group"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                    {contato.nome}
                  </h3>
                  <span className="text-xs font-medium px-2 py-1 bg-slate-700 rounded-full text-slate-300">
                    {contato.idade} anos
                  </span>
                </div>
                
                <div className="flex gap-2">
                  <Link
                    href={`/cadastro?id=${contato.id}`}
                    className="p-2 bg-slate-700 hover:bg-blue-900/40 text-blue-400 rounded-lg transition-colors"
                    title="Editar"
                  >
                    ✎
                  </Link>
                  <button
                    onClick={() => excluirContato(contato.id)}
                    className="p-2 bg-slate-700 hover:bg-red-900/40 text-red-400 rounded-lg transition-colors"
                    title="Excluir"
                  >
                    🗑
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-xs uppercase tracking-wider text-slate-500 font-bold">Telefones</p>
                <div className="flex flex-wrap gap-2">
                  {contato.telefones.map((t) => (
                    <span key={t.id} className="text-sm text-slate-300 bg-slate-900/50 px-3 py-1 rounded-md border border-slate-700">
                      {t.numero}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filtrados.length === 0 && (
          <div className="text-center py-20 bg-slate-800/20 rounded-3xl border-2 border-dashed border-slate-700">
            <p className="text-slate-500 text-lg">Nenhum contato encontrado.</p>
          </div>
        )}
      </div>
    </main>
  );
}