"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, Star, ShoppingBag, Store } from "lucide-react";
import { TODOS_PRODUTOS } from "@/app/data/produtos";
import CartaoProduto from "@/app/components/CartaoProduto";
import RolagemHorizontal from "@/app/components/setaRolarProdutos";

export default function ProdutoDetalhePage() {
  const params = useParams();
  const router = useRouter();
  const idProduto = Number(params.id);

  // busca o produto clicado no feed pelo ID da URL
  const produto = TODOS_PRODUTOS.find((p) => p.id === idProduto);

  // pega os outros produtos da mesma loja
  const produtosDaMesmaLoja = produto
    ? TODOS_PRODUTOS.filter(
        (p) => p.nomeLoja === produto.nomeLoja && p.id !== produto.id
      )
    : [];

  // minis- galeria
  const fotosGaleria =
    produto?.galeria && produto.galeria.length > 0
      ? produto.galeria
      : produto
      ? [produto.imagemUrl]
      : [];

  const [fotoSelecionada, setFotoSelecionada] = useState<string>(
    produto?.imagemUrl || ""
  );

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
      

      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="flex flex-col lg:flex-row items-start gap-4">
          {/* fotos minis */}
          <div className="flex flex-row lg:flex-col items-center gap-4">
            <button
              onClick={() => router.back()}
              aria-label="Voltar"
              className="p-2 text-[#171918] hover:text-[#6735E8] transition-colors cursor-pointer mb-2"
            >
              <ChevronLeft className="w-8 h-8 stroke-[2.5]" />
            </button>

            <div className="flex flex-row lg:flex-col gap-3">
              {fotosGaleria.map((foto, index) => (
                <button
                  key={index}
                  onClick={() => setFotoSelecionada(foto)}
                  className={`relative w-20 h-20 rounded-2xl bg-white p-2 overflow-hidden shadow-sm border-2 transition-all cursor-pointer ${
                    imagemAtiva === foto
                      ? "border-[#6735E8] scale-105"
                      : "border-transparent opacity-80 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={foto}
                    alt={`${produto.nome} miniatura ${index + 1}`}
                    fill
                    className="object-contain p-1.5"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* centro com a foto */}
          <div className="bg-white rounded-[35px] p-8 shadow-sm relative w-full lg:w-[560px] h-[540px] flex items-center justify-center shrink-0">
            {/* loja */}
            <Link
              href="/avaliacoes"
              title={`Loja: ${produto.nomeLoja}`}
              className="absolute top-6 right-6 z-20 w-16 h-16 rounded-full overflow-hidden border border-gray-100 shadow-md bg-white hover:scale-105 transition-transform"
            >
              <Image
                src={produto.lojaSeloUrl}
                alt={produto.nomeLoja}
                fill
                className="object-cover"
              />
            </Link>

            <div className="relative w-full h-full">
              <Image
                src={imagemAtiva}
                alt={produto.nome}
                fill
                className="object-contain p-2"
                priority
              />
            </div>
          </div>

          {/* infos na direita */}
          <div className="flex-1 text-[#171918] pt-1 max-w-md">
            <h1 className="text-3xl font-extrabold tracking-tight">
              {produto.nome}
            </h1>

            <div className="flex flex-wrap items-center gap-4 mt-1.5 text-xs">
              <Link
                href="/avaliacoes"
                className="flex items-center gap-1 font-semibold hover:underline"
              >
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{produto.nota?.toFixed(1) || "4.5"}</span>
                <span className="text-gray-500">
                  | {produto.totalReviews || 15} reviews
                </span>
              </Link>

              <span className="text-[#6735E8] font-medium capitalize">
                {produto.categoria}
              </span>

              <span
                className={`font-semibold ${
                  produto.disponivel ? "text-[#6735E8]" : "text-[#E63956]"
                }`}
              >
                {produto.disponivel
                  ? `${produto.quantidadeDisponivel ?? 1} disponíveis`
                  : "Indisponível"}
              </span>
            </div>

            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-3xl md:text-4xl font-extrabold">
                {produto.preco}
              </span>
              {produto.unidade && (
                <span className="text-base text-[#6735E8] font-bold">
                  {produto.unidade}
                </span>
              )}
            </div>

            <div className="mt-5 space-y-2.5 text-xs text-gray-800 leading-snug">
              <h2 className="text-lg font-bold text-[#171918]">Descrição</h2>

              {produto.descricao && (
                <p className="whitespace-pre-line">{produto.descricao}</p>
              )}

              {produto.ingredientes && (
                <div>
                  <p className="font-semibold text-[#171918]">Ingredientes</p>
                  <p>{produto.ingredientes}</p>
                </div>
              )}

              {produto.alergicos && (
                <p className="whitespace-pre-line font-medium text-gray-900 pt-1">
                  {produto.alergicos}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* SEÇÃO INFERIOR: DA MESMA LOJA */}
        {produtosDaMesmaLoja.length > 0 && (
          <section className="mt-16 pt-4">
            <h2 className="text-2xl md:text-3xl font-bold text-[#171918] mb-6">
              Da mesma loja
            </h2>

            <RolagemHorizontal className="gap-5 pb-4">
              {produtosDaMesmaLoja.map((item) => (
                <CartaoProduto key={item.id} {...item} />
              ))}
            </RolagemHorizontal>
          </section>
        )}
      </div>
    </main>
  );
}