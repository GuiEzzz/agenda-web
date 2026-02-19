"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import FloatingInput from "@/components/FloatingInput";

export default function CadastroContato() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [nome, setNome] = useState("");
  const [idade, setIdade] = useState(0);
  const [telefones, setTelefones] = useState([""]);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const isSavingRef = useRef(false);

  useEffect(() => {
    if (id) {
      fetch(`/api/contatos/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setNome(data.nome);
          setIdade(data.idade);
          setTelefones(data.telefones.map((t: any) => t.numero));
        });
    }
  }, [id]);

  const handleSalvar = async () => {
    if (isSavingRef.current) return;
    isSavingRef.current = true;
    setIsSaving(true);
    setError("");

    // Validações (mantidas conforme sua lógica original)
    if (idade > 100 || idade <= 0 || !nome.trim() || telefones.every((t) => !t.trim())) {
      setError("Por favor, preencha os campos corretamente.");
      setIsSaving(false);
      isSavingRef.current = false;
      return;
    }

    const payload = {
      nome,
      idade,
      telefones: telefones.filter((t) => t.trim() !== ""),
    };

    try {
      const method = id ? "PUT" : "POST";
      const url = id ? `/api/contatos/${id}` : "/api/contatos";
      
      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      router.push("/");
    } catch (error) {
      setError("Ocorreu um erro ao salvar o contato.");
    } finally {
      setIsSaving(false);
      isSavingRef.current = false;
    }
  };

  const handleAddTelefone = () => setTelefones([...telefones, ""]);
  const handleChangeTelefone = (i: number, value: string) => {
    const novos = [...telefones];
    novos[i] = value;
    setTelefones(novos);
  };
  const handleRemoverTelefone = (i: number) => {
    const novos = [...telefones];
    novos.splice(i, 1);
    setTelefones(novos);
  };

  return (
    <main className="min-h-screen bg-[#0f172a] text-slate-200 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Link para Voltar */}
        <Link 
          href="/" 
          className="inline-flex items-center text-slate-400 hover:text-white mb-6 transition-colors text-sm"
        >
          ← Voltar para a lista
        </Link>

        <div className="bg-slate-800 border border-slate-700 shadow-2xl rounded-3xl overflow-hidden">
          {/* Header do Card */}
          <div className="bg-slate-700/30 p-8 border-b border-slate-700">
            <h1 className="text-2xl font-bold text-white text-center">
              {id ? "👤 Editar Contato" : "👤 Novo Contato"}
            </h1>
            <p className="text-center text-slate-400 text-sm mt-1">
              {id ? "Atualize as informações do seu contato" : "Preencha os dados abaixo"}
            </p>
          </div>

          <div className="p-8 space-y-6">
            {/* Campos Principais */}
            <div className="space-y-4">
              <FloatingInput
                label="Nome Completo"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
              <FloatingInput
                type="number"
                label="Idade"
                value={idade === 0 ? "" : idade.toString()}
                onChange={(e) => setIdade(Number(e.target.value))}
              />
            </div>

            {/* Seção de Telefones */}
            <div className="pt-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Telefones</h2>
                <button
                  onClick={handleAddTelefone}
                  className="text-xs bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white px-3 py-1 rounded-full transition-all"
                >
                  + Adicionar
                </button>
              </div>
              
              <div className="space-y-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                {telefones.map((t, i) => (
                  <div key={i} className="flex gap-2 group animate-in fade-in slide-in-from-left-2">
                    <input
                      className="flex-1 bg-slate-900/50 border border-slate-700 text-white p-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all placeholder-slate-600"
                      value={t}
                      onChange={(e) => handleChangeTelefone(i, e.target.value)}
                      placeholder={`Número ${i + 1}`}
                    />
                    {telefones.length > 1 && (
                      <button
                        onClick={() => handleRemoverTelefone(i)}
                        className="p-3 text-slate-500 hover:text-red-400 transition-colors"
                        title="Remover"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Botão de Ação e Erro */}
            <div className="pt-6 border-t border-slate-700/50">
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm mb-4 text-center">
                  {error}
                </div>
              )}
              
              <button
                onClick={handleSalvar}
                disabled={isSaving}
                className={`w-full py-4 rounded-xl font-bold text-white transition-all shadow-lg ${
                  isSaving 
                    ? "bg-slate-700 cursor-not-allowed" 
                    : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:scale-[0.98] shadow-blue-900/20"
                }`}
              >
                {isSaving ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Salvando...
                  </span>
                ) : (
                  "Salvar Contato"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}