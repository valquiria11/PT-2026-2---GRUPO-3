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
  const [lojas, setLojas] = useState<Lojas[]>([]);
  const [categorias, setCategorias] = useState<Categorias[]>([])
  const { produtos, carregando, erro } = useProducts("");
  const [avaliacoes, setAvaliacoes] = useState<ResultadoAvaliacoes | null>(null);

  //API
  useEffect(() => {
    fetchLojas();
    fetchCategorias();
    fetchAvaliacoes();
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
  const fetchAvaliacoes = async () => {
    try {
      const res = await api.get<ResultadoAvaliacoes>(`avaliacao/loja?alvoId=${lojaId}`);
      setAvaliacoes(res.data);
    } catch (error) {
      console.error("Erro ao buscar avaliações.", error);
    }
  }

  //identificação
  const loja = lojas.find(
    (item) => item.id === lojaId
  );
  const categoriaLoja = categorias.find(
    (cat) => cat.id === loja?.categoria_id
  );
  const produtosLoja = produtos.filter(
    (produto) => produto.loja?.id === lojaId
  );

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
              className="object-cover"
            />
          )}
          <div className="flex flex-col justify-center text-[#F6F3E4] capitalize">
            <h1 className="text-9xl font-medium">{loja.nome}</h1>
            <Link
              key={categoriaLoja?.id}
              href={`/categoria/${categoriaLoja?.id}`}
              className="cursor-pointer hover:underline">
              <span className="text-2xl">{categoriaLoja?.nome}</span>
            </Link>
          </div>

          {/*Autor*/}
          <div className="absolute bottom-[35px] right-[150px]">
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
      </header>
    
      {/*Reviews e Comentários*/}
      <section className="w-full h-[600px] bg-black flex flex-col items-center justify-center">
        <h2 className="text-5xl text-white p-5">Reviews e Comentários</h2>
        
        {/*Nota média*/}  
        {avaliacoes && (
          <div className="flex flex-col items-center">
            <p className="text-7xl ">{avaliacoes.media}</p>
            {/*Estrelas*/}
            <div className="relative flex">
              <div className="text-7xl text-gray">
                ★★★★★
              </div>
              <div className="absolute text-[#FFE44D] text-7xl overflow-hidden" style={{width: `${avaliacoes.media/5*100}%`}}> 
                ★★★★★
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  )
}

