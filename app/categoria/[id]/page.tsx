
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";

import { useProducts } from "../../hooks/useProducts";
import {
  imagemLoja,
  imagemProduto,
  type Produto,
} from "../../lib/products";

type Categoria = {
  id: number;
  nome: string;
  categoria_principal_id: number | null;
  created_at: string;
  updated_at?: string;
};

type Loja = {
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

type Ordem = "default" | "menor" | "maior" | "nome";

const itensPorPagina = 15;
const semScrollbar = "scrollbar-none";

function formatPreco(preco: number) {
  return preco.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export default function CategoriaPage() {
  // ID da categoria principal na URL
  const params = useParams<{ id: string }>();
  const categoriaId = Number(params.id);

  // Dados do backend
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [lojas, setLojas] = useState<Loja[]>([]);
  const [carregandoDados, setCarregandoDados] = useState(true);
  const [erroDados, setErroDados] = useState("");

  // Busca e filtros
  const [busca, setBusca] = useState("");
  const [ordem, setOrdem] = useState<Ordem>("default");
  const [categoriaFilhaAtiva, setCategoriaFilhaAtiva] =
    useState<number | null>(null);
  const [pagina, setPagina] = useState(1);

  // Produtos obtidos pelo hook existente
  const {
    produtos,
    carregando,
    erro,
  } = useProducts(busca);

  // API
  useEffect(() => {
    let ativo = true;

    async function carregarDados() {
      setCarregandoDados(true);
      setErroDados("");

      try {
        const [resCategorias, resLojas] = await Promise.all([
          axios.get<Categoria[]>("/api/categorias"),
          axios.get<Loja[]>("/api/lojas"),
        ]);

        if (!ativo) return;

        setCategorias(resCategorias.data);
        setLojas(resLojas.data);
      } catch (error) {
        console.error("Erro ao carregar categoria:", error);

        if (ativo) {
          setErroDados(
            "Não foi possível carregar as categorias e lojas."
          );
        }
      } finally {
        if (ativo) {
          setCarregandoDados(false);
        }
      }
    }

    carregarDados();

    return () => {
      ativo = false;
    };
  }, []);

  // Reiniciar os filtros ao mudar de categoria principal
  useEffect(() => {
    setCategoriaFilhaAtiva(null);
    setPagina(1);
    setBusca("");
    setOrdem("default");
  }, [categoriaId]);

  // Categoria principal atual
  const categoriaPrincipal = categorias.find(
    (categoria) =>
      categoria.id === categoriaId &&
      categoria.categoria_principal_id == null
  );

  // Categorias filhas da categoria principal
  const categoriasFilhas = categorias.filter(
    (categoria) =>
      categoria.categoria_principal_id === categoriaId
  );

  // IDs aceitos para os produtos
  const idsCategorias = new Set([
    categoriaId,
    ...categoriasFilhas.map((categoria) => categoria.id),
  ]);

  // Relacionamento entre nome da categoria e ID
  const categoriaPorNome = new Map(
    categorias.map((categoria) => [
      categoria.nome,
      categoria.id,
    ])
  );

  const categoriaPorId = new Map(
    categorias.map((categoria) => [
      categoria.id,
      categoria.nome,
    ])
  );

  // Produtos da categoria principal e de suas filhas
  const produtosDaCategoria = produtos.filter((produto) => {
    // Preferencialmente, a API deve retornar categoria.id.
    // O nome é usado como fallback.
    const categoriaProduto = produto.categoria as {
      id?: number;
      nome?: string;
    };

    const idProduto =
      categoriaProduto?.id ??
      categoriaPorNome.get(categoriaProduto?.nome ?? "");

    return (
      categoriaPrincipal !== undefined &&
      idProduto !== undefined &&
      idsCategorias.has(idProduto)
    );
  });

  // Filtro da subcategoria + ordenação
  const produtosFiltrados = produtosDaCategoria
    .filter((produto) => {
      if (categoriaFilhaAtiva === null) {
        return true;
      }

      const categoriaProduto = produto.categoria as {
        id?: number;
        nome?: string;
      };

      const idProduto =
        categoriaProduto?.id ??
        categoriaPorNome.get(categoriaProduto?.nome ?? "");

      return idProduto === categoriaFilhaAtiva;
    })
    .sort((a, b) => {
      if (ordem === "menor") {
        return a.preco - b.preco;
      }

      if (ordem === "maior") {
        return b.preco - a.preco;
      }

      if (ordem === "nome") {
        return a.nome.localeCompare(b.nome);
      }

      return 0;
    });

  // Lojas da categoria principal
  const lojasDaCategoria = lojas.filter(
    (loja) => loja.categoria_id === categoriaId
  );

  // Carrosséis (sempre limitados à categoria atual)
  const populares = produtosDaCategoria.slice(0, 5);

  const recentes = [...produtosDaCategoria]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
    )
    .slice(0, 8);

  // Paginação
  const totalPaginas = Math.max(
    1,
    Math.ceil(produtosFiltrados.length / itensPorPagina)
  );

  const produtosDaPagina = produtosFiltrados.slice(
    (pagina - 1) * itensPorPagina,
    pagina * itensPorPagina
  );

  const primeiro = Math.max(
    1,
    Math.min(pagina - 2, totalPaginas - 4)
  );

  const ultimo = Math.min(
    totalPaginas,
    primeiro + 4
  );

  const numeros = Array.from(
    { length: ultimo - primeiro + 1 },
    (_, i) => primeiro + i
  );

  if (!Number.isInteger(categoriaId) || categoriaId <= 0) {
    return (
      <main className="p-10 text-center">
        ID de categoria inválido.
      </main>
    );
  }

  if (carregandoDados) {
    return (
      <main className="min-h-screen bg-[#F6F3E4] p-10 text-center">
        Carregando categoria...
      </main>
    );
  }

  if (erroDados) {
    return (
      <main className="min-h-screen bg-[#F6F3E4] p-10 text-center">
        {erroDados}
      </main>
    );
  }

  if (!categoriaPrincipal) {
    return (
      <main className="min-h-screen bg-[#F6F3E4] p-10 text-center">
        Categoria principal não encontrada.
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F6F3E4]">

      {/* Banner da categoria */}
      <section className="relative w-full overflow-hidden bg-black lg:h-[540px]">

        <div className="absolute inset-x-0 top-0 z-20">
          {/* Navbar */}
        </div>

        <div className="mx-auto flex h-full w-full max-w-[1058px] flex-col items-center px-6 pt-28 lg:flex-row lg:items-start lg:px-0 lg:pt-0">

          <h1 className="text-center text-3xl font-semibold leading-tight text-[#F7F4E8] sm:text-5xl lg:flex-1 lg:pr-2 lg:pt-[216px] lg:text-right lg:text-[48px] lg:leading-[61px]">
            O universo de{" "}
            <strong className="font-bold">
              {categoriaPrincipal.nome}
            </strong>
            <br />
            em um só lugar
          </h1>

          <div className="relative mt-8 h-72 w-48 shrink-0 sm:h-80 lg:mt-[114px] lg:h-[766px] lg:w-[296px]">
            <Image
              src="/mascote2.png"
              alt="Mascote da plataforma"
              fill
              priority
              sizes="(max-width: 1024px) 192px, 296px"
              className="object-contain object-top"
            />
          </div>

        </div>
      </section>

      {/* Área de produtos */}
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
              onChange={(e) => {
                setBusca(e.target.value);
                setPagina(1);
              }}
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

        {/* Filtros por categoria filha */}
        <div className="mt-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

          <div className="flex flex-wrap gap-3 lg:gap-[25px]">

            <button
              type="button"
              onClick={() => {
                setCategoriaFilhaAtiva(null);
                setPagina(1);
              }}
              className={`cursor-pointer rounded-full px-5 py-2 text-base transition-colors lg:h-[37px] lg:px-5 lg:py-0 ${
                categoriaFilhaAtiva === null
                  ? "bg-[#6A38F3] text-white"
                  : "bg-white text-[#A78BFA] hover:bg-[#EDE7FF]"
              }`}
            >
              Todos
            </button>

            {categoriasFilhas.map((categoria) => {
              const ativa =
                categoriaFilhaAtiva === categoria.id;

              return (
                <button
                  key={categoria.id}
                  type="button"
                  onClick={() => {
                    setCategoriaFilhaAtiva(
                      ativa ? null : categoria.id
                    );
                    setPagina(1);
                  }}
                  className={`cursor-pointer rounded-full px-5 py-2 text-base transition-colors lg:h-[37px] lg:px-5 lg:py-0 ${
                    ativa
                      ? "bg-[#6A38F3] text-white"
                      : "bg-white text-[#A78BFA] hover:bg-[#EDE7FF]"
                  }`}
                >
                  {categoria.nome}
                </button>
              );
            })}
          </div>

          {/* Ordenação */}
          <div className="relative w-full lg:w-[467px]">
            <label className="sr-only" htmlFor="ordem">
              Ordenar por
            </label>

            <select
              id="ordem"
              name="ordem"
              value={ordem}
              onChange={(e) => {
                setOrdem(e.target.value as Ordem);
                setPagina(1);
              }}
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

        {/* Grid de produtos */}
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 lg:gap-x-[17px] lg:gap-y-4">

          {produtosDaPagina.map((produto) => (
            <CardProduto
              key={produto.id}
              produto={produto}
            />
          ))}

        </div>

        {carregando && (
          <p role="status" className="mt-10 text-center text-lg">
            Buscando produtos...
          </p>
        )}

        {erro && (
          <p
            role="alert"
            className="mt-10 text-center text-lg text-[#C4002B]"
          >
            {erro}
          </p>
        )}

        {!carregando &&
          !erro &&
          produtosFiltrados.length === 0 && (
            <p className="mt-10 text-center text-lg text-zinc-500">
              Nenhum produto encontrado nesta categoria.
            </p>
          )}

        {/* Paginação */}
        {totalPaginas > 1 && (
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
              <svg
                width="24"
                height="32"
                viewBox="0 0 24 32"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <polyline points="20 4 6 16 20 28" />
              </svg>
            </button>

            {numeros.map((numero) => (
              <button
                key={numero}
                type="button"
                aria-current={
                  numero === pagina ? "page" : undefined
                }
                onClick={() => setPagina(numero)}
                className={`cursor-pointer ${
                  numero === pagina
                    ? "font-bold"
                    : "font-light"
                }`}
              >
                {numero}
              </button>
            ))}

            <button
              type="button"
              aria-label="Próxima página"
              disabled={pagina === totalPaginas}
              onClick={() => setPagina(pagina + 1)}
              className="cursor-pointer disabled:cursor-default disabled:opacity-30"
            >
              <svg
                width="24"
                height="32"
                viewBox="0 0 24 32"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <polyline points="4 4 18 16 4 28" />
              </svg>
            </button>
          </nav>
        )}
      </section>

      {/* Lojas da categoria principal */}
      <section className="w-full bg-black pb-24 pt-[50px]">
        <div className="mx-auto w-full max-w-[1212px] px-6 xl:px-0">

          <div className="flex items-baseline justify-between">
            <h2 className="text-3xl font-bold text-[#F7F4E8] lg:text-[32px]">
              Principais Lojas
            </h2>

            <Link
              href="/lojas"
              className="text-sm font-semibold text-[#6A38F3]"
            >
              ver mais
            </Link>
          </div>

          {lojasDaCategoria.length === 0 ? (
            <p className="mt-10 text-white">
              Nenhuma loja cadastrada nesta categoria.
            </p>
          ) : (
            <div
              className={`mt-14 flex gap-14 overflow-x-auto ${semScrollbar}`}
            >
              {lojasDaCategoria.map((loja) => (
                <Link
                  href={`/lojas/${loja.id}`}
                  key={loja.id}
                  className="flex w-[135px] shrink-0 flex-col items-center text-center"
                >
                  <div className="relative h-[135px] w-[135px] overflow-hidden rounded-full bg-white">

                    {loja.logo_url ? (
                      <Image
                        src={imagemLoja(loja.logo_url)!}
                        alt={`Logo ${loja.nome}`}
                        fill
                        sizes="135px"
                        unoptimized
                        className="object-cover"
                      />
                    ) : (
                      <span className="flex h-full w-full items-center justify-center text-5xl font-bold text-black">
                        {loja.nome[0]}
                      </span>
                    )}
                  </div>

                  <p className="mt-2 text-xl text-[#F7F4E8]">
                    {loja.nome}
                  </p>

                  <p className="text-base text-[#6A38F3]">
                    {categoriaPorId.get(loja.categoria_id)}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Carrosséis de produtos da categoria */}
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

// Card de produto
function CardProduto({
  produto,
  className = "",
}: {
  produto: Produto;
  className?: string;
}) {
  const disponivel = produto.stock > 0;
  const loja = produto.loja;
  const imagem = imagemProduto(produto);

  return (
    <Link
      href={`/produto/${produto.id}`}
      className={`relative flex h-[311px] flex-col overflow-hidden rounded-[40px] bg-white p-[22px] text-black ${className}`}
    >
      <div className="relative h-[170px] w-full">
        {imagem ? (
          <Image
            src={imagem}
            alt={produto.nome}
            fill
            sizes="229px"
            unoptimized
            className="object-contain"
          />
        ) : (
          <span className="flex h-full items-center justify-center text-sm text-zinc-500">
            Sem imagem
          </span>
        )}
      </div>

      {loja?.logo_url && (
        <div className="absolute right-4 top-4 z-10 h-[68px] w-[68px] overflow-hidden rounded-full">
          <Image
            src={imagemLoja(loja.logo_url)!}
            alt={`Logo ${loja.nome}`}
            fill
            sizes="68px"
            unoptimized
            className="object-cover"
          />
        </div>
      )}

      <div className="mt-auto">
        <h3 className="text-2xl font-medium leading-tight">
          {produto.nome}
        </h3>

        <p className="text-[22px] font-medium leading-tight">
          {formatPreco(produto.preco)}
        </p>

        <span
          className={`text-sm font-medium uppercase ${
            disponivel
              ? "text-[#B6E100]"
              : "text-[#C4002B]"
          }`}
        >
          {disponivel
            ? "Disponível"
            : "Indisponível"}
        </span>
      </div>
    </Link>
  );
}

// Carrossel de produtos
function CarrosselProdutos({
  titulo,
  href,
  itens,
  className = "",
}: {
  titulo: string;
  href: string;
  itens: Produto[];
  className?: string;
}) {
  if (itens.length === 0) {
    return null;
  }

  return (
    <div className={className}>
      <div className="flex items-baseline justify-between">
        <h2 className="text-3xl font-semibold text-black lg:text-[32px]">
          {titulo}
        </h2>

        <Link
          href={href}
          className="text-sm font-semibold text-[#6A38F3]"
        >
          ver mais
        </Link>
      </div>

      <div
        className={`mt-7 flex gap-8 overflow-x-auto ${semScrollbar}`}
      >
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
