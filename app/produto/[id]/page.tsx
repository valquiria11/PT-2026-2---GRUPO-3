"use client";

import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, Star, ShoppingBag, Store, User } from "lucide-react";
import { TODOS_PRODUTOS, Avaliacao } from "@/app/data/produtos";
import RolagemHorizontal from "@/app/components/setaRolarProdutos";
import {
  obterAvaliacoesDoProduto,
  formatarTempoRelativo,
} from "@/app/utils/avaliacoesStorage";

function ConteudoProduto() {
  const params = useParams();
  const router = useRouter();
  const idProduto = Number(params.id);

  const produto = TODOS_PRODUTOS.find((p) => p.id === idProduto);

  const fotosGaleria =
    produto?.galeria && produto.galeria.length > 0
      ? produto.galeria
      : produto
      ? [produto.imagemUrl]
      : [];

  const [fotoSelecionada, setFotoSelecionada] = useState<string>(
    produto?.imagemUrl || ""
  );

  const [listaAvaliacoes, setListaAvaliacoes] = useState<Avaliacao[]>([]);

  useEffect(() => {
      if (produto) {
        setListaAvaliacoes(obterAvaliacoesDoProduto(produto.id));
      }
    }, [produto]);

  if (!produto) {
    return (
      <main className="min-h-screen bg-[#F7F4E8] flex flex-col items-center justify-center p-6">
        <p className="text-xl font-bold text-[#171918] mb-4">
          Produto não encontrado.
        </p>
        <Link
          href="/feed"
          className="bg-[#6735E8] text-white px-6 py-3 rounded-full font-bold text-sm"
        >
          Voltar para o Feed
        </Link>
      </main>
    );
  }

  const imagemAtiva = fotoSelecionada || produto.imagemUrl;


  return (
    <main className="min-h-screen bg-[#F7F4E8] overflow-x-hidden">

      {/* meiao */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row items-start gap-7">
         
          <div className="flex flex-col lg:flex-row items-start gap-5 shrink-0">
            <button
              onClick={() => router.back()}
              aria-label="Voltar"
              className="pt-2 pr-2 text-[#171918] hover:text-[#6735E8] transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-12 h-12 stroke-[2]" />
            </button>

            <div className="flex flex-row lg:flex-col justify-between gap-3.5 lg:h-[540px]">
              {fotosGaleria.map((foto, index) => (
                <button
                  key={index}
                  onClick={() => setFotoSelecionada(foto)}
                  className={`relative w-24 h-24 lg:w-[122px] lg:h-[122px] rounded-[28px] bg-white p-2 overflow-hidden shadow-sm border-2 transition-all cursor-pointer shrink-0 ${
                    imagemAtiva === foto
                      ? "border-[#6735E8]"
                      : "border-transparent opacity-85 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={foto}
                    alt={`${produto.nome} miniatura ${index + 1}`}
                    fill
                    unoptimized
                    className="object-contain p-1.5"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* foto grande e loja em cima */}
          <div className="bg-white rounded-[35px] p-6 shadow-sm relative w-full lg:w-[540px] h-[540px] flex items-center justify-center shrink-0">
            {/* foto circulo da loja */}
            <Link
              href="/avaliacoes"
              title={`Loja: ${produto.nomeLoja}`}
              className="absolute top-6 right-6 z-20 w-16 h-16 rounded-full overflow-hidden border border-gray-100 shadow-md bg-white hover:scale-105 transition-transform"
            >
              <Image
                src={produto.lojaSeloUrl}
                alt={produto.nomeLoja}
                fill
                unoptimized
                className="object-cover"
              />
            </Link>

            {/* foto prod */}
            <div className="relative w-full h-full">
              <Image
                src={imagemAtiva}
                alt={produto.nome}
                fill
                unoptimized
                className="object-contain p-2"
                priority
              />
            </div>
          </div>

          {/* info do prod */}
          <div className="flex-1 text-[#171918] pt-1 max-w-md">
            <h1 className="text-4xl md:text-[42px] font-normal tracking-tight leading-tight">
              {produto.nome}
            </h1>

            <div className="flex flex-wrap items-center gap-8  text-[18px]">
              <div className="flex items-center gap-1 font-medium">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{produto.nota?.toFixed(1) || "4.5"}</span>
                <span className="text-gray-500">
                  | {listaAvaliacoes.length || produto.totalReviews || 0} reviews
                </span>
              </div>

              <span className="text-[#6735E8] font-medium capitalize">
                {produto.categoria}
              </span>

              <span
                className={`font-medium ${
                  produto.disponivel ? "text-[#6735E8]" : "text-[#E63956]"
                }`}
              >
                {produto.disponivel
                  ? `${produto.quantidadeDisponivel ?? 1} disponíveis`
                  : "Indisponível"}
              </span>
            </div>

            <div className="mt-3 flex items-baseline gap-1">
              <span className="text-3xl md:text-[40px] font-normal">
                {produto.preco}
              </span>
              {produto.unidade && (
                <span className="text-sm text-[#6735E8] font-medium">
                  {produto.unidade}
                </span>
              )}
            </div>

            <div className="mt-5  text-xs text-gray-800 leading-snug text-[14px]">
              <h2 className="text-base font-medium text-[#171918]">Descrição</h2>

              {produto.descricao && (
                <p className="whitespace-pre-line">{produto.descricao}</p>
              )}

              {produto.ingredientes && (
                <div>
                  <p className="font-medium text-[#171918]">Ingredientes</p>
                  <p>{produto.ingredientes}</p>
                </div>
              )}

              {produto.alergicos && (
                <p className="whitespace-pre-line font-normal text-gray-900 pt-1">
                  {produto.alergicos}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* avalaiaçoes embaixo */}
        <section className="mt-16 pt-4">
          <h2 className="text-2xl md:text-3xl font-bold text-[#171918] mb-6">
            Avaliações
          </h2>

        {listaAvaliacoes.length === 0 ? (
            <p className="text-gray-500 text-base">
              Esta loja ainda não possui avaliações.
            </p>
          ) : (
            <RolagemHorizontal className="gap-6 pb-4">
              {listaAvaliacoes.map((av) => (
                <Link
                  key={av.id}
                  href={`/produto/${produto.id}/avaliacao/${av.id}`}
                  className="bg-white rounded-[32px] p-6 shadow-sm hover:shadow-md transition-shadow flex items-start justify-between gap-6 min-w-[680px] md:min-w-[780px] max-w-[820px] shrink-0 cursor-pointer"
                >
                
                  <div className="flex items-start gap-5">
                    <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-gray-100 shrink-0 flex items-center justify-center">
                      {av.fotoUsuario ? (
                        <Image
                          src={av.fotoUsuario}
                          alt={av.usuario}
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      ) : (
                        <User className="w-10 h-10 text-gray-400" />
                      )}
                    </div>

                    <div className="pt-1">
                      <div className="flex items-baseline gap-2.5">
                        <h3 className="text-xl font-bold text-[#171918]">
                          {av.usuario}
                        </h3>
                        <span className="text-xs text-gray-400">
                          {formatarTempoRelativo(av.dataCriacao || av.tempo)}
                        </span>
                      </div>
                      <p className="text-base text-gray-700 mt-2 leading-relaxed">
                        {av.comentario}
                      </p>
                    </div>
                  </div>

                  {/* estrelas da avaliação */}
                  <div className="flex items-center gap-1.5 pt-2 shrink-0">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-6 h-6 ${
                          i < av.estrelas
                            ? "fill-[#FFE600] text-[#FFE600]"
                            : "fill-gray-200 text-gray-200"
                        }`}
                      />
                    ))}
                  </div>
                </Link>
              ))}
            </RolagemHorizontal>
          )}
        </section>
      </div>
    </main>
  );
}

export default function ProdutoDetalhePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F7F4E8]" />}>
      <ConteudoProduto />
    </Suspense>
  );
}