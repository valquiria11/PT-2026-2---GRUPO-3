"use client";

import Image from "next/image";
import Link from "next/link";

export interface ProdutoProps {
  id: number;
  nome: string;
  preco: string;
  unidade?: string;
  disponivel: boolean;
  imagemUrl: string;
  lojaSeloUrl?: string;
  lojaUrl?: string;
  nomeLoja?: string;
}

export default function CartaoProduto({
  id,
  nome,
  preco,
  unidade,
  disponivel,
  imagemUrl,
  lojaSeloUrl,
  lojaUrl,
  nomeLoja,
}: ProdutoProps) {
  const logo = lojaUrl ?? lojaSeloUrl;

  return (
    <Link
      href={`/produto/${id}`}
      className="bg-white rounded-[28px] p-5 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow relative min-w-[220px] max-w-[240px] h-[310px] shrink-0 cursor-pointer"
    >
      {/* Logo da loja (canto superior direito) */}
      {logo && (
        <div className="absolute top-3 right-3 z-20 w-10 h-10 rounded-full overflow-hidden border border-gray-100 shadow-md bg-white">
          <Image
            src={logo}
            alt={nomeLoja || "Logo da Loja"}
            fill
            unoptimized
            className="object-cover"
          />
        </div>
      )}

      {/* Foto do produto */}
      <div className="relative w-full h-36 mt-2 flex items-center justify-center">
        {imagemUrl ? (
          <Image
            src={imagemUrl}
            alt={nome}
            fill
            unoptimized
            className="object-contain p-2"
          />
        ) : (
          <span className="text-sm text-gray-500">Sem imagem</span>
        )}
      </div>

      {/* Info do produto */}
      <div className="mt-3">
        <h3 className="font-bold text-[#171918] text-base line-clamp-1">
          {nome}
        </h3>

        <div className="flex items-baseline gap-1 mt-1">
          <span className="font-extrabold text-[#171918] text-lg">
            {preco}
          </span>
          {unidade && (
            <span className="text-xs text-[#6735E8] font-semibold">
              {unidade}
            </span>
          )}
        </div>

        {/* Estoque */}
        <span
          className={`text-[11px] font-bold tracking-wider block mt-1 uppercase ${
            disponivel ? "text-[#9CD62D]" : "text-[#E63956]"
          }`}
        >
          {disponivel ? "DISPONÍVEL" : "INDISPONÍVEL"}
        </span>
      </div>
    </Link>
  );
}