"use client";

import CartaoProduto, { ProdutoProps } from "./CartaoProduto";
import CartaoLoja, { LojaProps } from "./CartaoLoja";
import CartaoAvaliacao, { AvaliacaoProps } from "./CartaoAvaliacao";

interface Usuario {
  id: number;
  nome: string;
  username: string;
  email?: string;
  profile_picture_url: string | null;
  createdAt?: string;
  updatedAt?: string;
}

interface PerfilProps {
  isOwner?: boolean;
  usuario: Usuario;
  produtos?: ProdutoProps[];
  lojas?: LojaProps[];
  avaliacoes?: AvaliacaoProps[];
}

function CabecalhoSecao({
  titulo,
  acao,
}: {
  titulo: string;
  acao?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-bold text-[#252525]">{titulo}</h2>
      {acao}
    </div>
  );
}

function VerMais({ onClick }: { onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-xs text-[#6A38F3] hover:underline"
    >
      ver mais
    </button>
  );
}

function Vazio({ texto }: { texto: string }) {
  return <p className="mt-4 text-sm text-gray-500">{texto}</p>;
}

export default function Perfil({
  isOwner = true,
  usuario,
  produtos = [],
  lojas = [],
  avaliacoes = [],
}: PerfilProps) {
  return (
    <main className="min-h-screen bg-[#F5F0E8] px-6 py-12">
      <div className="mx-auto max-w-6xl">
        {/* Cabeçalho do perfil */}
        <section className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex flex-col items-center gap-6 sm:flex-row">
            <img
              src={usuario.profile_picture_url || "/img.png"}
              alt={`Foto de perfil de ${usuario.nome}`}
              className="h-36 w-36 rounded-full border-4 border-white object-cover shadow-md"
            />

            <div className="text-center sm:text-left">
              <h1 className="text-3xl font-bold text-[#252525]">{usuario.nome}</h1>
              <p className="mt-2 text-gray-500">@{usuario.username}</p>
              {usuario.email && (
              <p className="mt-2 text-gray-500">{usuario.email}</p>
            )}
            </div>
          </div>

          {/* Diferença 1: só o dono edita o perfil */}
          {isOwner && (
            <button
              type="button"
              className="rounded-xl bg-[#6A38F3] px-8 py-3 font-semibold text-white transition hover:bg-[#5229D4]"
            >
              Editar Perfil
            </button>
          )}
        </section>

        {/* Produtos: "ver mais" nos dois estados */}
        <section className="mt-14">
          <CabecalhoSecao titulo="Produtos" acao={<VerMais />} />
          {produtos.length === 0 ? (
            <Vazio texto="Nenhum produto por aqui ainda." />
          ) : (
            <div className="mt-4 flex gap-6 overflow-x-auto pb-4">
              {produtos.map((p) => (
                <CartaoProduto key={p.id} {...p} />
              ))}
            </div>
          )}
        </section>

        {/* Lojas */}
        <section className="mt-12">
          <CabecalhoSecao
            titulo="Lojas"
            acao={
              // Diferença 2: "+" para o dono, "ver mais" para visitante
              isOwner ? (
                <button
                  type="button"
                  aria-label="Adicionar loja"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-[#6A38F3] text-2xl text-white transition hover:bg-[#5229D4]"
                >
                  +
                </button>
              ) : (
                <VerMais />
              )
            }
          />
          {lojas.length === 0 ? (
            <Vazio texto="Nenhuma loja por aqui ainda." />
          ) : (
            <div className="mt-4 flex flex-col gap-4">
              {lojas.map((l) => (
                <CartaoLoja key={l.id} {...l} />
              ))}
            </div>
          )}
        </section>

        {/* Avaliações */}
        <section className="mt-12">
          <CabecalhoSecao titulo="Avaliações" />
          {avaliacoes.length === 0 ? (
            <Vazio texto="Nenhuma avaliação por aqui ainda." />
          ) : (
            <div className="mt-4 flex flex-col gap-4">
              {avaliacoes.map((a) => (
                <CartaoAvaliacao key={a.id} {...a} />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}