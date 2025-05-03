"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import FloatingInput from "@/components/FloatingInput";

export default function CadastroContato() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [nome, setNome] = useState("");
  const [idade, setIdade] = useState(0);
  const [telefones, setTelefones] = useState([""]);
  const [error, setError] = useState("");

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
    setError("");

    if (idade > 100) {
      setError("A idade não pode ser maior que 100.");
      return;
    }
    if (idade <= 0) {
      setError("A idade não pode ser menor ou igual à zero.");
      return;
    }
    if (!nome.trim()) {
      setError("O campo Nome é obrigatório!");
      return;
    }
    if (telefones.length === 0 || telefones.every((t) => !t.trim())) {
      setError("O campo Telefone é obrigatório!");
      return;
    }

    const payload = {
      nome,
      idade,
      telefones: telefones.filter((t) => t.trim() !== ""),
    };

    if (id) {
      await fetch(`/api/contatos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } else {
      await fetch("/api/contatos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }

    router.push("/");
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
    <main className="max-w-2xl mx-auto p-6 min-h-screen flex flex-col justify-center bg-gray-800 text-white">
      <h1 className="text-3xl font-bold text-center mb-6">
        {id ? "Editar Contato" : "Novo Contato"}
      </h1>

      <div className="bg-gray-900 rounded-xl shadow-lg p-6 space-y-4">
        <FloatingInput
          label="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
        <FloatingInput
          type="number"
          label="Idade"
          value={idade.toString()}
          onChange={(e) => setIdade(Number(e.target.value))}
        />

        <div>
          <h2 className="font-semibold text-gray-200 mb-2">Telefones:</h2>
          {telefones.map((t, i) => (
            <div key={i} className="flex gap-2 items-center mb-2">
              <input
                className="flex-1 border border-gray-600 bg-gray-800 text-white p-2 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                value={t}
                onChange={(e) => handleChangeTelefone(i, e.target.value)}
                placeholder={`Telefone ${i + 1}`}
              />
              <button
                onClick={() => handleRemoverTelefone(i)}
                className="text-red-500 hover:text-red-700 transition"
              >
                Remover
              </button>
            </div>
          ))}
          <button
            onClick={handleAddTelefone}
            className="text-blue-600 hover:text-blue-800 font-medium transition"
          >
            + Adicionar telefone
          </button>
        </div>

        <div className="pt-4">
          <button
            onClick={handleSalvar}
            className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition"
          >
            Salvar
          </button>
          {error && <p className="text-red-600 mt-2 text-sm">{error}</p>}
        </div>
      </div>
    </main>
  );
}
