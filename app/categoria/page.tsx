'use client'

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

type  Produtos = {
  id: number;
  loja_id: number;
  categoria_id: number;
  nome: string;
  descricao?: string | null;
  preco: number;
  stock: number;
  createdAt: string;
  updatedAt?: string;
}

const produtos: Produtos[] = [
  {
    id: 1,
    nome: "Comp. Lenovo",
    loja_id: 1,
    categoria_id: 3,
    preco: 3200,
    stock: 10,
    createdAt: "2023-01-01T00:00:00Z",
  },
  {
    id: 2,
    nome: "Comp. Samsung",
    loja_id: 2,
    categoria_id: 3,
    preco: 4500,
    stock: 0,
    createdAt: "2023-01-01T00:00:00Z",
  },
  {
    id: 3,
    nome: "iPhone 15",
    loja_id: 3,
    categoria_id: 2,
    preco: 3900,
    stock: 8,
    createdAt: "2023-01-01T00:00:00Z",
  },
  {
    id: 4,
    nome: "Smart TV Philips",
    loja_id: 4,
    categoria_id: 4,
    preco: 2800,
    stock: 15,
    createdAt: "2023-01-01T00:00:00Z",
  },
  {
    id: 5,
    nome: "Xbox Series X",
    loja_id: 5,
    categoria_id: 6,
    preco: 4200,
    stock: 5,
    createdAt: "2023-01-01T00:00:00Z",
  },
  { 
    id: 6, 
    nome: "Headset Gamer", 
    loja_id: 7, 
    categoria_id: 5, 
    preco: 899.99, 
    stock: 0, 
    createdAt: "2023-02-01T00:00:00Z" 
  },
  { 
    id: 7, 
    nome: "Micro SD", 
    loja_id: 1, 
    categoria_id: 5, 
    preco: 179.9, 
    stock: 20, 
    createdAt: "2024-05-05T00:00:00Z" 
  },
  { id: 8, 
    nome: "Playstation 5", 
    loja_id: 7, 
    categoria_id: 6, 
    preco: 4992.98, 
    stock: 4, 
    createdAt: "2024-05-04T00:00:00Z" 
  },
  { 
    id: 9, 
    nome: "Iphone 4", 
    loja_id: 2, 
    categoria_id: 2, 
    preco: 469.99, 
    stock: 3, 
    createdAt: "2024-05-02T00:00:00Z"
   },
  { id: 10, 
    nome: "Nintendo 3DS", 
    loja_id: 7, 
    categoria_id: 6, 
    preco: 2089.99, 
    stock: 0, 
    createdAt: "2024-05-01T00:00:00Z" 
  },
];

type Categorias = {
  id: number;
  nome: string;
  categoria_principal_id?: number | null;
  created_at: string;
  updated_at?: string;
};

const categorias: Categorias[] = [
  {
    id: 1,
    nome: "Eletrônicos",
    categoria_principal_id: null,
    created_at: "2023-01-01T00:00:00Z",
  },
  {
    id: 2,
    nome: "Celulares",
    categoria_principal_id: 1,
    created_at: "2023-01-01T00:00:00Z",
  },
  {
    id: 3,
    nome: "Notebooks",
    categoria_principal_id: 1,
    created_at: "2023-01-01T00:00:00Z",
  },
  {
    id: 4,
    nome: "TVs",
    categoria_principal_id: 1,
    created_at: "2023-01-01T00:00:00Z",
  },
  {
    id: 5,
    nome: "Acessórios",
    categoria_principal_id: 1,
    created_at: "2023-01-01T00:00:00Z",
  },
  {
    id: 6,
    nome: "Outros",
    categoria_principal_id: 1,
    created_at: "2023-01-01T00:00:00Z",
  }
];

type Lojas = {
  id: number;
  usuario_id: number;
  categoria_id: number;
  nome: string;
  descricao?: string | null;
  logo_url?: string | null;
  banner_url?: string | null;
  sticker_url?: string | null;
  createdAt: string;
  updatedAt?: string;
};

const lojas: Lojas[] = [
  { 
    id: 1, 
    usuario_id: 1,
    categoria_id: 1, 
    nome: "Repiit", 
    logo_url: "/lojas/repiit.png", 
    sticker_url: "/lojas/repiit.png", 
    createdAt: "2023-01-01T00:00:00Z" 
  },
  { 
    id: 2, 
    usuario_id: 2, 
    categoria_id: 1, 
    nome: "Bersay", 
    logo_url: "/lojas/bersay.png", 
    sticker_url: "/lojas/bersay.png", 
    createdAt: "2023-01-01T00:00:00Z" 
  },
  { 
    id: 3, 
    usuario_id: 3, 
    categoria_id: 1, 
    nome: "electree", 
    logo_url: "/lojas/electree.png", 
    sticker_url: "/lojas/electree.png", 
    createdAt: "2023-01-01T00:00:00Z" 
  },
  { 
    id: 4, 
    usuario_id: 4, 
    categoria_id: 1, 
    nome: "Speed X", 
    logo_url: "/lojas/speedx.png", 
    sticker_url: "/lojas/speedx.png", 
    createdAt: "2023-01-01T00:00:00Z" 
  },
  { 
    id: 5, 
    usuario_id: 5, 
    categoria_id: 1, 
    nome: "Next Computer", 
    logo_url: "/lojas/nextcomputer.png", 
    sticker_url: "/lojas/nextcomputer.png", 
    createdAt: "2023-01-01T00:00:00Z" 
  },
  { 
    id: 6, 
    usuario_id: 6, 
    categoria_id: 1, 
    nome: "Oh my!", 
    logo_url: "/lojas/ohmy.png", 
    sticker_url: "/lojas/ohmy.png", 
    createdAt: "2023-01-01T00:00:00Z" 
  },
  { 
    id: 7, 
    usuario_id: 7, 
    categoria_id: 1, 
    nome: "Hobby", 
    logo_url: "/lojas/hobby.png", 
    sticker_url: "/lojas/hobby.png", 
    createdAt: "2023-01-01T00:00:00Z" 
  },
];

const lojaPorId = new Map(lojas.map((l) => [l.id, l]));

const categoriaPorId = new Map(categorias.map((c) => [c.id, c.nome]));

const populares = produtos.filter((p) => [1, 2, 4, 5, 6].includes(p.id));

const recentes = [...produtos]
  .sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
  .slice(0, 8);

const itens_por_pagina = 15; // 5 colunas x 3 linhas

const semScrollbar =
  "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden";

const formatPreco = (preco: number) =>
  preco.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const filtros = categorias.filter((c) => c.categoria_principal_id != null);

export default function CategoriaPage() {
    const [categoriaAtiva, setCategoriaAtiva] = useState<number | null>(null);
    const [ordem, setOrdem] = useState<string>("default");
    const [busca, setBusca] = useState("");
    const [pagina, setPagina] = useState(1);

    const produtosFiltrados = produtos
      .filter((p) => p.nome.toLowerCase().includes(busca.toLowerCase()))
      .filter((p) => categoriaAtiva === null || p.categoria_id === categoriaAtiva)
      .sort((a, b) => {
        if (ordem === "menor") return a.preco - b.preco;
        if (ordem === "maior") return b.preco - a.preco;
        if (ordem === "nome") return a.nome.localeCompare(b.nome);
      return 0;
  });

    const totalPaginas = Math.max(
      1,
      Math.ceil(produtosFiltrados.length / itens_por_pagina)
    );
    const produtosDaPagina = produtosFiltrados.slice(
      (pagina - 1) * itens_por_pagina,
      pagina * itens_por_pagina
    );

    const primeiro = Math.max(1, Math.min(pagina - 2, totalPaginas - 4));
    const ultimo = Math.min(totalPaginas, primeiro + 4);
    const numeros = Array.from(
      { length: ultimo - primeiro + 1 },
      (_, i) => primeiro + i
    );

    return (
      <main className="min-h-screen bg-[#F6F3E4]">
        
      <section className="relative w-full overflow-hidden bg-black lg:h-[540px]">

        <div className="absolute inset-x-0 top-0 z-20">
          {/* navbar */}
        </div>

        <div className="mx-auto flex h-full w-full max-w-[1058px] flex-col items-center px-6 pt-28 lg:flex-row lg:items-start lg:px-0 lg:pt-0">
          <h1 className="text-center text-3xl font-semibold leading-tight text-[#F7F4E8] sm:text-5xl lg:flex-1 lg:pr-2 lg:pt-[216px] lg:text-right lg:text-[48px] lg:leading-[61px]">
            O universo da <strong className="font-bold">tecnologia</strong>
            <br />
            em um só lugar
          </h1>

          <div className="relative mt-8 h-72 w-48 shrink-0 sm:h-80 lg:mt-[114px] lg:h-[766px] lg:w-[296px]">
            <Image
              src="/mascote2.png"
              alt="Mascote segurando um celular"
              fill
              priority
              className="object-contain object-top"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1212px] px-6 pb-16 pt-8">

        {/* Busca */}
        <div className="flex lg:justify-end">
          <div className="relative w-full lg:w-[604px]">
            <label className="sr-only" htmlFor="busca">
              Procurar produtos
            </label>
            <input
              id="busca"
              name="busca"
              type="text"
              value={busca}
              onChange={(e) => { setBusca(e.target.value); setPagina(1); }}
              placeholder="Procurar por..."
              className="block w-full rounded-full bg-white py-2 pl-7 pr-14 text-base text-[#6A38F3] outline-none placeholder:text-[#B9A5FA] lg:h-[38px]"
            />
            <svg
              className="pointer-events-none absolute right-5 top-1/2 h-5 w-5 -translate-y-1/2 text-[#B9A5FA]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
        </div>

        {/* Filtros */}
        <div className="mt-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-3 lg:gap-[25px]">
            {filtros.map((cat) => {
              const ativa = categoriaAtiva === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => { setCategoriaAtiva(ativa ? null : cat.id); setPagina(1); }}
                  className={`cursor-pointer rounded-full px-5 py-2 text-base transition-colors lg:h-[37px] lg:w-[121px] lg:px-0 lg:py-0 ${
                    ativa
                      ? "bg-[#6A38F3] text-white"
                      : "bg-white text-[#A78BFA] hover:bg-[#EDE7FF]"
                  }`}
                >
                  {cat.nome}
                </button>
              );
            })}
          </div>

          {/* Ordem */}
          <div className="relative w-full lg:w-[467px]">
            <label className="sr-only" htmlFor="ordem">
              Ordenar por
            </label>
            <select
              id="ordem"
              name="ordem"
              value={ordem}
              onChange={(e) => { setOrdem(e.target.value); setPagina(1); }}
              className="block w-full cursor-pointer appearance-none rounded-full bg-white py-2 pl-7 pr-14 text-xl text-[#A78BFA] outline-none lg:h-[44px] lg:text-2xl"
            >
              <option value="default">ordenar por</option>
              <option value="menor">menor preço</option>
              <option value="maior">maior preço</option>
              <option value="nome">nome (A-Z)</option>
            </select>
            <svg
              className="pointer-events-none absolute right-5 top-1/2 h-5 w-5 -translate-y-1/2 text-[#A78BFA]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        </div>

        {/* Produtos */}
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 lg:gap-x-[17px] lg:gap-y-4">
          {produtosDaPagina.map((produto) => (
            <CardProduto key={produto.id} produto={produto} />
          ))}
        </div>

        {produtosFiltrados.length === 0 && (
          <p className="mt-10 text-center text-lg text-zinc-500">
            Nenhum produto encontrado. Tente outra busca ou outro filtro.
          </p>
        )}

        {/* Paginação */}
        <nav
          aria-label="Paginação"
          className="mt-9 flex items-center justify-center gap-6 text-4xl leading-none text-black lg:gap-[44px] lg:text-[40px]"
        >
          <button
            type="button"
            aria-label="Página anterior"
            disabled={pagina === 1}
            onClick={() => setPagina(pagina - 1)}
            className="cursor-pointer disabled:cursor-default disabled:opacity-30"
          >
            <svg width="24" height="32" viewBox="0 0 24 32" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="20 4 6 16 20 28" />
            </svg>
          </button>

          {numeros.map((n) => (
            <button
              key={n}
              type="button"
              aria-current={n === pagina ? "page" : undefined}
              onClick={() => setPagina(n)}
              className={`cursor-pointer ${n === pagina ? "font-bold" : "font-light"}`}
            >
              {n}
            </button>
          ))}

          <button
            type="button"
            aria-label="Próxima página"
            disabled={pagina === totalPaginas}
            onClick={() => setPagina(pagina + 1)}
            className="cursor-pointer disabled:cursor-default disabled:opacity-30"
          >
            <svg width="24" height="32" viewBox="0 0 24 32" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="4 4 18 16 4 28" />
            </svg>
          </button>
        </nav>
      </section>

      {/* Principais lojas */}
      <section className="w-full bg-black pb-24 pt-[50px]">
        <div className="mx-auto w-full max-w-[1212px] px-6 xl:px-0">
          <div className="flex items-baseline justify-between">
            <h2 className="text-3xl font-bold text-[#F7F4E8] lg:text-[32px]">
              Principais Lojas
            </h2>
            <Link href="/lojas" className="text-sm font-semibold text-[#6A38F3]">
              ver mais
            </Link>
          </div>

          
          <div className={`mt-14 flex gap-14 overflow-x-auto ${semScrollbar}`}>
            {lojas.map((loja) => (
              <div
                key={loja.id}
                className="flex w-[135px] shrink-0 flex-col items-center text-center"
              >
                <div className="relative h-[135px] w-[135px] overflow-hidden rounded-full bg-white">
                  {loja.logo_url ? (
                    <Image
                      src={loja.logo_url}
                      alt={`Logo ${loja.nome}`}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center text-5xl font-bold text-black">
                      {loja.nome[0]}
                    </span>
                  )}
                </div>
                <p className="mt-2 whitespace-nowrap text-xl text-[#F7F4E8]">{loja.nome}</p>
                <p className="text-base text-[#6A38F3]">
                  {categoriaPorId.get(loja.categoria_id)?.toLowerCase()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mais populares */}
      <section className="mx-auto w-full max-w-[1212px] px-6 pb-20 pt-[55px] xl:px-0">
        <CarrosselProdutos
          titulo="Mais populares"
          href="/produtos"
          itens={populares}
        />
        <CarrosselProdutos
          titulo="Recém adicionados"
          href="/produtos"
          itens={recentes}
          className="mt-10"
        />
      </section>
    </main>
  );
}

function CardProduto({
  produto,
  className = "",
}: {
  produto: Produtos;
  className?: string;
}) {
  const disponivel = produto.stock > 0;
  const loja = lojaPorId.get(produto.loja_id);

  return (
    <article
      className={`relative flex h-[311px] flex-col overflow-hidden rounded-[40px] bg-white p-[22px] text-black ${className}`}
    >
      <div className="relative h-[170px] w-full">
        <Image
          src={`/produtos/${produto.id}.png`}
          alt={produto.nome}
          fill
          className="object-contain"
        />
      </div>

      {loja?.sticker_url && (
         <div className="absolute right-4 top-4 z-10 h-[68px] w-[68px] overflow-hidden rounded-full">
           <Image
             src={loja.sticker_url}
             alt={`Logo ${loja.nome}`}
             fill
             className="object-cover"
           />
         </div>
        )}

      <div className="mt-auto">
        <h3 className="text-2xl font-medium leading-tight">{produto.nome}</h3>
        <p className="text-[22px] font-medium leading-tight">
          {formatPreco(produto.preco)}
        </p>
        <span
          className={`text-sm font-medium uppercase ${
            disponivel ? "text-[#B6E100]" : "text-[#C4002B]"
          }`}
        >
          {disponivel ? "Disponível" : "Indisponível"}
        </span>
      </div>
    </article>
  );
}

function CarrosselProdutos({
  titulo,
  href,
  itens,
  className = "",
}: {
  titulo: string;
  href: string;
  itens: Produtos[];
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="flex items-baseline justify-between">
        <h2 className="text-3xl font-semibold text-black lg:text-[32px]">
          {titulo}
        </h2>
        <Link href={href} className="text-sm font-semibold text-[#6A38F3]">
          ver mais
        </Link>
      </div>

      <div className={`mt-7 flex gap-8 overflow-x-auto ${semScrollbar}`}>
        {itens.map((produto) => (
          <CardProduto
            key={produto.id}
            produto={produto}
            className="w-[229px] shrink-0"
          />
        ))}
      </div>
    </div>
  );
}