"use client";

import { useState } from "react";
import {
  ModalCriarAvaliacao,
  ModalEditarAvaliacao,
} from "@/app/components/ModalAvaliacao";

export default function TesteModaisPage() {
  const [criarAberto, setCriarAberto] = useState(false);
  const [editarAberto, setEditarAberto] = useState(false);

  return (
    <main className="min-h-screen bg-[#F7F4E8] flex flex-col items-center justify-center gap-4 p-8">
      <h1 className="text-2xl font-bold text-[#171918] mb-2">
        Teste dos Modais de Avaliação
      </h1>

      <div className="flex gap-4">
        <button
          onClick={() => setCriarAberto(true)}
          className="bg-[#6735E8] text-white px-6 py-3 rounded-full font-semibold cursor-pointer"
        >
          Abrir Modal Criar
        </button>

        <button
          onClick={() => setEditarAberto(true)}
          className="bg-[#171918] text-white px-6 py-3 rounded-full font-semibold cursor-pointer"
        >
          Abrir Modal Editar
        </button>
      </div>

      
      <ModalCriarAvaliacao
        aberto={criarAberto}
        onFechar={() => setCriarAberto(false)}
        nomeLoja="CJR"
        onAvaliar={({ estrelas, comentario }) => {
          alert(`Criada! Estrelas: ${estrelas} | Comentário: ${comentario}`);
        }}
      />


      <ModalEditarAvaliacao
        aberto={editarAberto}
        onFechar={() => setEditarAberto(false)}
        nomeLoja="CJR"
        estrelasIniciais={4}
        comentarioInicial="Loja muito boa, entrega rápida!"
        onSalvar={({ estrelas, comentario }) => {
          alert(`Salva! Estrelas: ${estrelas} | Comentário: ${comentario}`);
        }}
        onDeletar={() => {
          alert("Avaliação deletada!");
        }}
      />
    </main>
  );
}