'use client'

import { Suspense, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import CartaoProduto from "@/app/components/CartaoProduto";
import CartaoAvaliacao from "@/app/components/CartaoAvaliacao";
import { useProducts } from "@/app/hooks/useProducts";
import { imagemLoja, imagemProduto, type Produto } from "@/app/lib/products";
import api from "@/app/services/api";
import axios from "axios";
import { LuPen } from "react-icons/lu";

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

    usuario:{
      id: number;
      nome: string;
    }
};

type Categorias = {
  id: number;
  nome: string;
  categoria_principal_id?: number | null;
  created_at: string;
  updated_at?: string;
};

type Avaliacoes = {
  id: number;
  usuario_id: number;
  loja_id?: number;
  produto_id?: number;
  nota: number;
  comentario: string | null;
  created_at: string;

  usuario: {
    id: number;
    nome: string;
    username: string;
  };
}

type ResultadoAvaliacoes = {
  media: number;
  totalAvaliacoes: number;
  avaliacoes: Avaliacoes[];
}

type Usuario = {
  id: number;
  nome: string;
};


function propsCartao(produto: Produto) {
  return {
    id: produto.id,
    nome: produto.nome,
    preco: Number(produto.preco).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    }),
    disponivel: produto.stock > 0,
    imagemUrl: imagemProduto(produto) || "/img.png",
    lojaUrl: imagemLoja(produto.loja?.logo_url),
    nomeLoja: produto.loja?.nome || undefined,
  };
}

export default function LojaPage() {
  return (
    <Suspense fallback={<h1 className=" min-h-screen flex items-center justify-center">Carregando Loja...</h1>}>
      <LojaConteudo />
    </Suspense>
  );
}

function LojaConteudo(){
  const params = useParams<{ id: string }>();
  const lojaId = Number(params.id);
  const [usuarioLogado, setUsuarioLogado] = useState<Usuario | null>(null);

  const [lojas, setLojas] = useState<Lojas[]>([]);
  const [categorias, setCategorias] = useState<Categorias[]>([])
  const { produtos, carregando, erro } = useProducts("");


  const [avaliacoesLojas, setAvaliacoesLojas] = useState<ResultadoAvaliacoes | null>(null);
  const [avaliacoesProd, setAvaliacoesProd] = useState<ResultadoAvaliacoes | null>(null);


  //API
  useEffect(() => {
    fetchLojas();
    fetchCategorias();
    fetchAvaliacoesLoja();
    fetchAvaliacoesProd();
  }, []);

  const fetchLojas = async () => {
    try {
      const res = await api.get("/lojas");
      setLojas(res.data);
    } catch (error) {
      console.error("Erro ao buscar lojas", error);
    }
  }
  const fetchCategorias = async () => {
    try {
      const res = await api.get("/categorias");
      setCategorias(res.data);
    } catch (error) {
      console.error("Erro ao buscar categorias", error);
    }
  }
  const fetchAvaliacoesLoja = async () => {
    try {
      const res = await api.get<ResultadoAvaliacoes>(`avaliacao/loja?alvoId=${lojaId}`);
      setAvaliacoesLojas(res.data);
    } catch (error) {
      console.error("Erro ao buscar avaliações da loja.", error);
    }
  }
  const fetchAvaliacoesProd = async () => {
    try {
      const res = await api.get<ResultadoAvaliacoes>("avaliacao/produto");
      setAvaliacoesProd(res.data);
    } catch (error) {
      console.error("Erro ao buscar avaliações dos produtos.")
    }
  }

  useEffect(() => {
    async function login() {
      try {
        const res = await axios.get<Usuario>("/api/session");
        console.log("Resposta completa:", res.data);
        setUsuarioLogado(res.data)
      } catch {
        setUsuarioLogado(null);
      }
    }
    login();
  }, []);

  //identificação
  const loja = lojas.find((item) => item.id === lojaId);
  const categoriaLoja = categorias.find((cat) => cat.id === loja?.categoria_id);
  const produtosdaLoja = produtos.filter((produto) => produto.loja?.id === lojaId);
  const donoDaLoja = usuarioLogado !== null && usuarioLogado.id === loja?.usuario_id;
  

  //validação
  if (!Number.isInteger(lojaId) || lojaId <= 0) {
    return (
      <p className="p-10 text-center">ID de loja inválido.</p>
    );
  }
  if (!loja) {
    return <p>Loja não encontrada.</p>
  }

  const banner = imagemLoja(loja.banner_url);

  //melhores avaliados
  const notasPorProduto = new Map<
    number,
    { soma: number; total: number }
  >();

  for (const avaliacao of avaliacoesProd?.avaliacoes ?? []) {
    if (avaliacao.produto_id === undefined) continue;

    const atual = notasPorProduto.get(avaliacao.produto_id) ?? {
      soma: 0,
      total: 0,
    };

    notasPorProduto.set(avaliacao.produto_id, {
      soma: atual.soma + avaliacao.nota,
      total: atual.total + 1,
    });
  }

  const melhoresAvaliados = [...produtosdaLoja]
  .filter((produto) => notasPorProduto.has(produto.id))
  .sort((a, b) => {
      const notaA = notasPorProduto.get(a.id)!;
      const notaB = notasPorProduto.get(b.id)!;

      const mediaA = notaA.soma / notaA.total;
      const mediaB = notaB.soma / notaB.total;

      return mediaB - mediaA || notaB.total - notaA.total;
    })
    .slice(0, 6);

  return (
    <main className="min-h-screen bg-[#F6F3E4]">

      {/*Header*/}
      <header className="relative w-full h-[540px] bg-black flex justify-center">

        {/*Banner*/}
        <div className="relative h-[540px] w-full flex justify-center">
          {banner && (
            <Image
              src={banner}
              alt={loja.nome}
              fill
              unoptimized
              className="object-cover object-center"
            />
          )}

          <div className="absolute inset-0 bg-linear-to-b from-black/100 to-black/40 flex justify-center">
            <div className="flex flex-col justify-center text-[#F6F3E4] capitalize z-10 mx-10">
              <h1 className="text-8xl font-medium">{loja.nome}</h1>
              <Link
                key={categoriaLoja?.id}
                href={`/categoria/${categoriaLoja?.id}`}
                className="cursor-pointer hover:underline">
                <span className="text-2xl">{categoriaLoja?.nome}</span>
              </Link>
            </div>

          {/*Botões modais*/}
          {donoDaLoja &&  
              <div className="absolute right-0 px-25 flex flex-col gap-3">
                <button
                  type="button"
                  // onClick={() => setModalAberto(true)}
                  className="rounded-full w-[45px] h-[45px] bg-[#6A38F3] flex justify-center items-center text-white text-6xl">
                  <LuPen size={30}></LuPen>
                </button>
                <button
                  type="button"
                  // onClick={() => setModalAberto(true)}
                  className="rounded-full w-[45px] h-[45px] bg-[#6A38F3] flex justify-center text-white text-6xl">
                  <span>+</span>
                </button>
              </div>
          }

            {/*Autor*/}
            <div className="absolute bottom-[35px] right-0 mx-25">
              {loja.usuario?.nome && (
                <Link
                  key={loja.usuario.nome}
                  href={`/perfil/${loja.usuario.id}`}
                  className="text-xl text-[#F6F3E4] flex items-baseline-last gap-2"
                  >
                  by<p className="cursor-pointer hover:underline capitalize">{loja.usuario.nome}</p>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>
    
      {/*Reviews e Comentários*/}
      <section className="relative w-full h-[600px] bg-black flex flex-col justify-center items-center">
        <h2 className="text-5xl text-white p-5">Reviews e Comentários</h2>
          
        {avaliacoesLojas && (
          <div className="flex flex-col items-center gap-2">
            <p className="text-7xl ">{avaliacoesLojas.media}</p>

            {/*Estrelas*/}
            <div className="relative flex">
              <div className="text-7xl text-gray">
                ★★★★★
              </div>
              <div className="absolute text-[#FFE44D] text-7xl overflow-hidden" style={{width: `${avaliacoesLojas.media/5*100}%`}}> 
                ★★★★★
              </div>
            </div>
          </div>
          )}

        {/*Cartões de Avaliação*/}
        {avaliacoesLojas?.avaliacoes.length ? (
          <div className="flex gap-5 overflow-x-auto py-15 scrollbar-none w-full max-w-[1212px]">
          
            {avaliacoesLojas.avaliacoes.map((avaliacao) => (
            <div key={avaliacao.id} className="w-full">
              <CartaoAvaliacao
                id={avaliacao.id}
                autorNome={avaliacao.usuario.nome}
                nota={avaliacao.nota}
                comentario={avaliacao.comentario ?? ""}
              />
            </div>
            ))};

          </div>
        ) : ( <p className="text-gray-500 text-3xl">
              Esta loja ainda não possui avaliações.
              </p>
        )}
      </section>
      
      {/*Melhor Avaliados*/}
      <section className="w-full px-[100px] my-10">
        <div className="flex items-baseline">
          <h3 className="text-black text-5xl font-medium">Produtos</h3><p className="text-2xl m-1 text-black">melhor avaliados</p>
        </div>

        {melhoresAvaliados.length > 0 ? (
          <div className="flex gap-6 overflow-x-auto py-5">
            {melhoresAvaliados.map((produto) => (
              <div key={produto.id}>
                <CartaoProduto {...propsCartao(produto)}/>
              </div>
            ))}
          </div>
        ) : ( <p className="text-red-400 text-3xl">Produtos avaliados nesta loja.</p>
        )}

      </section>

      {/*Produtos da Loja*/}
      <section className="w-full px-[100px] my-10">
        <div className="flex items-baseline">
          <h3 className="text-black text-5xl font-medium">Produtos</h3><p className="text-2xl m-1 text-black lowercase">de {loja.nome}</p>
        </div>
        <div className="grid sm:grid-cols-3 lg:grid-cols-5 gap-10">
        {produtosdaLoja.map((produto) => (
          <CartaoProduto
            key={produto.id}
            {...propsCartao(produto)}
          />
        ))}
       </div>
        

      </section>
    </main>
  )
}