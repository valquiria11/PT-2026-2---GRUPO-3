'use client'

import { Suspense, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import CartaoProduto from "@/app/components/CartaoProduto";
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

  //API
  useEffect(() => {
    fetchLojas();
    fetchCategorias();
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

      {/*Banner*/}
      <header className="relative w-full h-[540px] bg-black flex justify-center">
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

        <div className="absolute bottom-[35px] right-[150px]">
          {loja.usuario?.nome && (
            <Link
              key={loja.usuario.nome}
              href={`/perfil/${loja.usuario.id}`}
              className="text-xl flex items-baseline-last gap-2"
              >
              by<p className="cursor-pointer hover:underline capitalize">{loja.usuario.nome}</p>
            </Link>
          )}
        </div>
        
      </header>
    </main>
  
  )
}

