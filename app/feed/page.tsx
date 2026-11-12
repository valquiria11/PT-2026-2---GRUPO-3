"use client";

import Image from "next/image";
import { Search, ShoppingBag, Store, ChevronDown } from "lucide-react";
import CartaoProduto from "../components/CartaoProduto";


const CATEGORIAS = [
  { id: 1, nome: "Mercado", icone: "🍎" },
  { id: 2, nome: "Farmácia", icone: "💊" },
  { id: 3, nome: "Beleza", icone: "💄" },
  { id: 4, nome: "Moda", icone: "👗" },
  { id: 5, nome: "Eletrônicos", icone: "💻" },
  { id: 6, nome: "Jogos", icone: "🎮" },
  { id: 7, nome: "Brinquedos", icone: "🧸" },
  { id: 8, nome: "Casa", icone: "🏠" },
];


const PRODUTOS_MERCADO = [
  {
    id: 1,
    nome: "Brownie Meio A.",
    preco: "R$4,70",
    disponivel: true,
    imagemUrl: "/produtos/brownie.png",
    lojaSeloUrl: "/lojas/cjr.png",
  },
  {
    id: 2,
    nome: "Brownie Trad.",
    preco: "R$3,80",
    disponivel: false,
    imagemUrl: "/produtos/browniet.png",
    lojaSeloUrl: "/lojas/cjr.png",
  },
  {
    id: 3,
    nome: "Nozes",
    preco: "R$29,99",
    unidade: "/kg",
    disponivel: true,
    imagemUrl: "/produtos/nozes.png",
    lojaSeloUrl: "/lojas/db.png",
  },
  {
    id: 4,
    nome: "Banana",
    preco: "R$3,99",
    unidade: "/kg",
    disponivel: true,
    imagemUrl: "/produtos/banana.png",
    lojaSeloUrl: "/lojas/maumau.png",
  },
  {
    id: 5,
    nome: "Limão Siciliano",
    preco: "R$17,99",
    unidade: "/kg",
    disponivel: false,
    imagemUrl: "/produtos/limao.png",
    lojaSeloUrl: "/lojas/maumau.png",
  },
];

const PRODUTOS_BELEZA = [
  {
    id: 6,
    nome: "Limpador Facial",
    preco: "R$74,99",
    disponivel: true,
    imagemUrl: "/produtos/limpador.png",
    lojaSeloUrl: "/lojas/creamy.png",
  },
  {
    id: 7,
    nome: "Blush",
    preco: "R$199,99",
    disponivel: false,
    imagemUrl: "/produtos/blush.png",
    lojaSeloUrl: "/lojas/rare.png",
  },
  {
    id: 8,
    nome: "Sérum Facial",
    preco: "R$99,90",
    disponivel: true,
    imagemUrl: "/produtos/serum.png",
    lojaSeloUrl: "/lojas/creamy.png",
  },
  {
    id: 9,
    nome: "Iluminador",
    preco: "R$249,90",
    disponivel: true,
    imagemUrl: "/produtos/iluminador.png",
    lojaSeloUrl: "/lojas/rare.png",
  },
  {
    id: 10,
    nome: "Body Splash",
    preco: "R$179,99",
    disponivel: false,
    imagemUrl: "/produtos/bodysplash.png",
    lojaSeloUrl: "/lojas/roots.png",
  },
];

const PRODUTOS_MODA = [
  {
    id: 11,
    nome: "Saia",
    preco: "R$75,99",
    disponivel: true,
    imagemUrl: "/produtos/saia.png",
    lojaSeloUrl: "/lojas/melina.png",
  },
  {
    id: 12,
    nome: "New Balance",
    preco: "R$399,99",
    disponivel: false,
    imagemUrl: "/produtos/tenis.png",
    lojaSeloUrl: "/lojas/fsh.png",
  },
  {
    id: 13,
    nome: "Bota",
    preco: "R$115,90",
    disponivel: true,
    imagemUrl: "/produtos/bota.png",
    lojaSeloUrl: "/lojas/fsh.png",
  },
  {
    id: 14,
    nome: "Bolsa",
    preco: "R$349,90",
    disponivel: true,
    imagemUrl: "/produtos/bolsa.png",
    lojaSeloUrl: "/lojas/melina.png",
  },
  {
    id: 15,
    nome: "Calça Jeans",
    preco: "R$159,99",
    disponivel: false,
    imagemUrl: "/produtos/calca.png",
    lojaSeloUrl: "/lojas/melina.png",
  },
];


const LOJAS = [
  { id: 1, nome: "CJR", categoria: "mercado", logoUrl: "/lojas/cjr.png" },
  { id: 2, nome: "Rare Beauty", categoria: "beleza", logoUrl: "/lojas/rare.png" },
  { id: 3, nome: "The Croc Brew", categoria: "mercado", logoUrl: "/lojas/croc.png" },
  { id: 4, nome: "Mini Reno", categoria: "casa", logoUrl: "/lojas/minireno.png" },
  { id: 5, nome: "amoca", categoria: "moda", logoUrl: "/lojas/amoca.png" },
  { id: 6, nome: "Repiit", categoria: "eletrônicos", logoUrl: "/lojas/repiit.png" },
  { id: 7, nome: "Creamy", categoria: "beleza", logoUrl: "/lojas/creamy.png" },
];

export default function FeedPage() {
  return (
    <main className="min-h-screen bg-[#F7F4E8] overflow-x-hidden">
      
      <section className="bg-black text-[#F7F4E8] px-1 pt-1 rounded-b-[35px] relative overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between mt-1 mb-4 px-1">
          <div className="max-w-7xl mx-auto w-full flex items-start justify-center h-[410px] relative">
            <div className="relative w-full h-[350px] md:h-[700px] -mb-40">
              <Image
                src="/feed-completo.png"
                alt="Mascote Stock.io"
                fill
                className="object-contain object-bottom"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* caixa main */}
      <div className="max-w-6xl mx-auto px-6 mt-6">
        {/* pesquisa */}
        <div className="flex justify-end mb-8">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Procurar por..."
              className="w-full bg-white text-gray-800 rounded-full py-3.5 px-6 pr-12 text-sm shadow-sm outline-none border border-transparent focus:border-[#6735E8]"
            />
            <Search className="w-5 h-5 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* categorias */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[#171918] mb-6">Categoria</h2>
          <div className="flex items-center gap-4 overflow-x-auto pb-4 scrollbar-none -mr-6 pr-6">
            {CATEGORIAS.map((cat) => (
              <div
                key={cat.id}
                className="bg-white rounded-3xl p-4 min-w-[130px] h-[130px] flex flex-col items-center justify-center shadow-sm cursor-pointer hover:scale-105 transition-transform shrink-0"
              >
                <span className="text-3xl mb-2">{cat.icone}</span>
                <span className="text-xs font-bold text-[#171918]">{cat.nome}</span>
              </div>
            ))}
          </div>
        </section>

        {/* mercado */}
        <section className="mb-12">
          <div className="flex justify-between items-baseline mb-6">
            <h2 className="text-2xl font-bold text-[#171918]">
              Produtos <span className="text-xs text-[#6735E8] font-normal">em Mercado</span>
            </h2>
            <button className="text-xs text-[#6735E8] font-bold hover:underline">
              ver mais
            </button>
          </div>

          <div className="flex gap-5 overflow-x-auto pb-4 scrollbar-none -mr-6 pr-6">
            {PRODUTOS_MERCADO.map((prod) => (
              <CartaoProduto key={prod.id} {...prod} />
            ))}
          </div>
        </section>

        {/* beleza */}
        <section className="mb-12">
          <div className="flex justify-between items-baseline mb-6">
            <h2 className="text-2xl font-bold text-[#171918]">
              Produtos <span className="text-xs text-[#6735E8] font-normal">em Beleza</span>
            </h2>
            <button className="text-xs text-[#6735E8] font-bold hover:underline">
              ver mais
            </button>
          </div>

          <div className="flex gap-5 overflow-x-auto pb-4 scrollbar-none -mr-6 pr-6">
            {PRODUTOS_BELEZA.map((prod) => (
              <CartaoProduto key={prod.id} {...prod} />
            ))}
          </div>
        </section>

        {/* moda */}
        <section className="mb-12">
          <div className="flex justify-between items-baseline mb-6">
            <h2 className="text-2xl font-bold text-[#171918]">
              Produtos <span className="text-xs text-[#6735E8] font-normal">em Moda</span>
            </h2>
            <button className="text-xs text-[#6735E8] font-bold hover:underline">
              ver mais
            </button>
          </div>

          <div className="flex gap-5 overflow-x-auto pb-4 scrollbar-none -mr-6 pr-6">
            {PRODUTOS_MODA.map((prod) => (
              <CartaoProduto key={prod.id} {...prod} />
            ))}
          </div>
        </section>

        {/* lojas */}
        <section className="mb-16 pt-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-[#171918]">Lojas</h2>
            <div className="flex items-center gap-6">
              <div className="bg-white rounded-full px-5 py-2 flex items-center gap-4 shadow-sm text-sm text-gray-400 border border-gray-100 cursor-pointer">
                <span>filtros</span>
                <ChevronDown className="w-4 h-4" />
              </div>
              <button className="text-xs text-[#6735E8] font-bold hover:underline">
                ver mais
              </button>
            </div>
          </div>

          {/* imagens loja */}
          <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-none -mr-6 pr-6">
            {LOJAS.map((loja) => (
              <div key={loja.id} className="flex flex-col items-center min-w-[110px] shrink-0">
                <div className="relative w-36 h-36 rounded-full overflow-hidden bg-white shadow-sm border border-gray-100 cursor-pointer hover:scale-105 transition-transform">
                  <Image
                    src={loja.logoUrl}
                    alt={loja.nome}
                    fill
                    className="object-cover"
                  />
                </div>
                <span className="text-sm font-bold text-[#171918] mt-2 text-center">
                  {loja.nome}
                </span>
                <span className="text-xs text-[#6735E8] capitalize">
                  {loja.categoria}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}