"use client";

import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, Pencil, Star, Send, User } from "lucide-react";
import { TODOS_PRODUTOS, Avaliacao, RespostaAvaliacao } from "@/app/data/produtos";
import {
  obterAvaliacoesDoProduto,
  salvarAvaliacaoNoProduto,
  formatarTempoRelativo,
} from "@/app/utils/avaliacoesStorage";

function ConteudoAvaliacao() {
  const params = useParams();
  const router = useRouter();
  const idProduto = Number(params.id);
  const idAvaliacao = Number(params.avaliacaoId);

  const produto = TODOS_PRODUTOS.find((p) => p.id === idProduto);

  const [avaliacao, setAvaliacao] = useState<Avaliacao | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [novoComentario, setNovoComentario] = useState("");
  const [editando, setEditando] = useState(false);
  const [textoAvaliacao, setTextoAvaliacao] = useState("");

  useEffect(() => {
    const todas = obterAvaliacoesDoProduto(idProduto);
    const encontrada = todas.find((a) => a.id === idAvaliacao) || null;
    setAvaliacao(encontrada);
    if (encontrada) {
      setTextoAvaliacao(encontrada.comentario);
    }
    setCarregando(false);
  }, [idProduto, idAvaliacao]);

  if (carregando) {
    return <div className="min-h-screen bg-[#F7F4E8]" />;
  }

  if (!avaliacao) {
    return (
      <main className="min-h-screen bg-[#F7F4E8] flex flex-col items-center justify-center p-6">
        <p className="text-xl font-bold text-[#171918] mb-4">
          Avaliação não encontrada.
        </p>
        <Link
          href={`/produto/${idProduto}`}
          className="bg-[#6735E8] text-white px-6 py-3 rounded-full font-bold text-sm"
        >
          Voltar para o Produto
        </Link>
      </main>
    );
  }

  const handleSalvarEdicao = () => {
    if (!textoAvaliacao.trim()) return;
    const atualizada: Avaliacao = {
      ...avaliacao,
      comentario: textoAvaliacao.trim(),
    };
    setAvaliacao(atualizada);
    salvarAvaliacaoNoProduto(idProduto, atualizada);
    setEditando(false);
  };

  const handleEnviarComentario = (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoComentario.trim()) return;

    // dados do usuario logado
    const usuarioLogadoNome =
      localStorage.getItem("usuarioNome") || "Usuário";
    const usuarioLogadoFoto =
      localStorage.getItem("usuarioFoto") || "";

    const novaResposta: RespostaAvaliacao = {
      id: Date.now(),
      usuario: usuarioLogadoNome,
      fotoUsuario: usuarioLogadoFoto,
      dataCriacao: new Date().toISOString(),
      texto: novoComentario.trim(),
    };

    const atualizada: Avaliacao = {
      ...avaliacao,
      respostas: [...(avaliacao.respostas || []), novaResposta],
    };

    setAvaliacao(atualizada);
    salvarAvaliacaoNoProduto(idProduto, atualizada);
    setNovoComentario("");
  };

  const respostas = avaliacao.respostas || [];

  return (
    <main className="min-h-screen bg-[#F7F4E8] flex flex-col justify-between">
      <div>
        {/* parte de cima- avaliação que abriu */}
        <section className="bg-black text-[#F7F4E8] px-6 md:px-14 pt-8 pb-14">
          <div className="max-w-6xl mx-auto relative">
            {/* botao de editar */}
            <button
              onClick={() => setEditando(!editando)}
              aria-label="Editar avaliação"
              className="absolute right-0 top-0 text-gray-300 hover:text-white transition-colors cursor-pointer"
            >
              <Pencil className="w-5 h-5" />
            </button>

            {/* autor e estrelas */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => router.back()}
                  aria-label="Voltar para o produto"
                  className="text-white hover:text-[#9CD62D] transition-colors cursor-pointer pr-1"
                >
                  <ChevronLeft className="w-7 h-7 stroke-[2.2]" />
                </button>

               
                <div className="relative w-14 h-14 rounded-full overflow-hidden bg-gray-800 shrink-0 flex items-center justify-center border border-gray-700">
                  {avaliacao.fotoUsuario ? (
                    <Image
                      src={avaliacao.fotoUsuario}
                      alt={avaliacao.usuario}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  ) : (
                    <User className="w-7 h-7 text-gray-400" />
                  )}
                </div>

                {/* nome usuario e o tempo q publicaram a avaliação */}
                <div className="flex items-baseline gap-2.5">
                  <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">
                    {avaliacao.usuario}
                  </h1>
                  <span className="text-xs text-gray-400">
                    {formatarTempoRelativo(
                      avaliacao.dataCriacao || avaliacao.tempo
                    )}
                  </span>
                </div>
              </div>

              {/* estrelas */}
              <div className="flex items-center gap-1.5 pl-11 sm:pl-0">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < avaliacao.estrelas
                        ? "fill-[#FFE600] text-[#FFE600]"
                        : "fill-gray-700 text-gray-700"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* texto */}
            <div className="mt-5 pl-11 max-w-4xl">
              {editando ? (
                <div className="flex flex-col gap-2">
                  <textarea
                    value={textoAvaliacao}
                    onChange={(e) => setTextoAvaliacao(e.target.value)}
                    rows={3}
                    className="w-full bg-zinc-900 text-white rounded-xl p-3 text-base border border-zinc-700 outline-none focus:border-[#6735E8]"
                  />
                  <button
                    onClick={handleSalvarEdicao}
                    className="self-end bg-[#6735E8] text-white text-xs font-bold px-4 py-1.5 rounded-full cursor-pointer"
                  >
                    Salvar
                  </button>
                </div>
              ) : (
                <p className="text-base md:text-lg text-gray-200 leading-relaxed">
                  {avaliacao.comentario}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* respostas a avaliação */}
        <section className="max-w-6xl mx-auto px-6 md:px-14 py-8">
          {respostas.length > 0 && (
            <div className="pl-6 md:pl-12">
              <div className="border-l border-gray-400 pl-6 md:pl-8 space-y-6">
                {respostas.map((resp) => (
                  <div key={resp.id} className="flex items-start gap-4">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden bg-white shadow-sm shrink-0 flex items-center justify-center border border-gray-200">
                      {resp.fotoUsuario ? (
                        <Image
                          src={resp.fotoUsuario}
                          alt={resp.usuario}
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      ) : (
                        <User className="w-6 h-6 text-gray-400" />
                      )}
                    </div>

                    <div>
                      <div className="flex items-baseline gap-2">
                        <h2 className="text-base md:text-lg font-bold text-[#171918]">
                          {resp.usuario}
                        </h2>
                        <span className="text-xs text-gray-500">
                          {formatarTempoRelativo(
                            resp.dataCriacao || resp.tempo
                          )}
                        </span>
                      </div>

                      {resp.cargo && (
                        <span className="block text-[11px] font-semibold text-[#6735E8] -mt-0.5 mb-1">
                          {resp.cargo}
                        </span>
                      )}

                      <p className="text-sm md:text-base text-gray-700 mt-1">
                        {resp.texto}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>

      {/* bara de adc comentario */}
      <div className="max-w-5xl w-full mx-auto px-6 pb-10 pt-4">
        <form onSubmit={handleEnviarComentario} className="relative">
          <input
            type="text"
            value={novoComentario}
            onChange={(e) => setNovoComentario(e.target.value)}
            placeholder="Adicionar comentário"
            className="w-full bg-white text-[#171918] placeholder-gray-400 rounded-full py-4 pl-7 pr-14 text-sm shadow-sm outline-none border border-transparent focus:border-[#6735E8]"
          />
          <button
            type="submit"
            aria-label="Enviar comentário"
            className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#6735E8] transition-colors cursor-pointer"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </main>
  );
}

export default function AvaliacaoDetalhePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F7F4E8]" />}>
      <ConteudoAvaliacao />
    </Suspense>
  );
}