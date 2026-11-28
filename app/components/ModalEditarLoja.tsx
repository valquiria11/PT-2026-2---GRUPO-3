"use client";

import { useEffect, useRef, useState } from "react";
import { type ChangeEvent, SubmitEvent } from "react";

interface Categoria {
  id: number;
  nome: string;
  categoria_principal_id: number | null;
}

interface LojaCriada {
  id: number;
  nome: string;
  categoria: string;
  logoUrl?: string;
}

export interface Loja {
  id: number;
  nome: string;
  categoria_id: number;
  logo_url?: string | null;
  sticker_url?: string | null;
  banner_url?: string | null;
}

interface ModalEditarLojaProps {
  loja: Loja;
  onFechar: () => void;
  onLojaEditada: (loja: Loja) => void;
  onLojaExcluida: () => void;
}

type TipoImagem = "sticker" | "logo" | "banner";

export default function ModalEditarLoja({
  loja,
  onFechar,
  onLojaEditada,
  onLojaExcluida,
}: ModalEditarLojaProps) {
  const [nome, setNome] = useState(`${loja}`);
  const [categoriaId, setCategoriaId] = useState("");
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [imagens, setImagens] = useState<Record<TipoImagem, File | null>>({
    sticker: null,
    logo: null,
    banner: null,
  });
  const [previews, setPreviews] = useState<Record<TipoImagem, string | null>>({
    sticker: null,
    logo: null,
    banner: null,
  });
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [excluindo, setExcluindo] = useState(false);
  const [confirmarExclusao, setConfirmarExclusao] =
    useState(false);

  const inputs = {
    sticker: useRef<HTMLInputElement>(null),
    logo: useRef<HTMLInputElement>(null),
    banner: useRef<HTMLInputElement>(null),
  };

  useEffect(() => {
    async function carregarCategorias() {
      try {
        const resposta = await fetch("/api/categorias", {
          cache: "no-store",
        });

        if (!resposta.ok) {
          throw new Error("Não foi possível carregar as categorias.");
        }

        const dados: Categoria[] = await resposta.json();

        setCategorias(
          dados.filter((categoria) => categoria.categoria_principal_id === null),
        );
      } catch (error) {
        setErro(
          error instanceof Error
            ? error.message
            : "Erro ao carregar categorias.",
        );
      }
    }

    carregarCategorias();
  }, []);

  useEffect(() => {
    return () => {
      Object.values(previews).forEach((url) => {
        if (url) URL.revokeObjectURL(url);
      });
    };
  }, [previews]);

  function selecionarImagem(
    tipo: TipoImagem,
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const arquivo = event.target.files?.[0];

    if (!arquivo) return;

    if (arquivo.size > 5 * 1024 * 1024) {
      setErro("Cada imagem deve ter no máximo 5 MB.");
      event.target.value = "";
      return;
    }

    if (!["image/jpeg", "image/png", "image/webp"].includes(arquivo.type)) {
      setErro("Escolha imagens JPEG, PNG ou WebP.");
      event.target.value = "";
      return;
    }

    setErro("");

    setImagens((atuais) => ({
      ...atuais,
      [tipo]: arquivo,
    }));

    setPreviews((atuais) => ({
      ...atuais,
      [tipo]: URL.createObjectURL(arquivo),
    }));
  }

  async function atualizarImagens() {
     if (!imagens.sticker && !imagens.logo && !imagens.banner) {
       return null;
     }
    const formulario = new FormData();

      if (imagens.sticker) {
        formulario.append("sticker", imagens.sticker);
      }
    
      if (imagens.logo) {
        formulario.append("logo", imagens.logo);
      }
    
      if (imagens.banner) {
        formulario.append("banner", imagens.banner);
      }

  const resposta = await fetch(
    `/api/lojas/${loja.id}/imagens`,
    {
      method: "POST",
      body: formulario,
    }
  );

  const dados = await resposta.json().catch(() => null);

  if (!resposta.ok) {
    throw new Error(
      dados?.message ??
        "Erro ao atualizar as imagens da loja."
    );
  }

  return dados;
}

  async function enviarFormulario(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setErro("");

    if ((!nome.trim() || !categoriaId)) {
      setErro("Preencha o nome e selecione uma categoria.");
      return;
    }

    setCarregando(true);

    try {
        const resposta = await fetch(`/api/lojas/${loja.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nome: nome.trim(),
            categoria_id: Number(categoriaId),
          }),
        });

        const dados = await resposta.json().catch(() => null);

        if (!resposta.ok) {
          throw new Error(
            dados?.message ?? "Não foi possível editar a loja."
          );
        }

        let lojaAtualizada: Loja = {
          ...loja,
          ...dados,
          id: loja.id,
          nome: nome.trim(),
          categoria_id: Number(categoriaId),
        };
        onLojaEditada(lojaAtualizada);
        const dadosImagem = await atualizarImagens();
        
        if (dadosImagem) {
          lojaAtualizada = {
          ...lojaAtualizada,
          logo_url:
            dadosImagem.logo_url ??
            lojaAtualizada.logo_url,
          sticker_url:
            dadosImagem.sticker_url ??
            lojaAtualizada.sticker_url,
          banner_url:
            dadosImagem.banner_url ??
            lojaAtualizada.banner_url,
          };
        onLojaEditada(lojaAtualizada);
        }
        onFechar();
      } catch (error) {
        setErro(error instanceof Error ? error.message
          : "Erro ao editar loja."
        );
      } finally {
        setCarregando(false);
      }
    }

    async function excluirLoja() {
    setErro("");
    setExcluindo(true);

    try {
      const resposta = await fetch(
        `/api/lojas/${loja.id}`,
        {
          method: "DELETE",
        }
      );

      const dados = await resposta.json().catch(() => null);

      if (!resposta.ok) {
        throw new Error(
          dados?.message ??
            "Não foi possível excluir a loja."
        );
      }

      onLojaExcluida();
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Erro ao excluir loja."
      );

      setConfirmarExclusao(false);
    } finally {
      setExcluindo(false);
    }
  }

  const campo =
    "w-full rounded-3xl border border-transparent bg-white px-3 py-3 text-sm text-[#252525] outline-none placeholder:text-gray-400 focus:border-[#6A38F3]";

  function seletorImagem(tipo: TipoImagem, titulo: string) {
    return (
      <div className="flex flex-col items-center gap-2">
        <button
          type="button"
          onClick={() => inputs[tipo].current?.click()}
          className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-[#A88AEF] bg-white text-3xl text-[#6A38F3] transition hover:bg-purple-50"
        >
          {previews[tipo] ? (
            <img
              src={previews[tipo]!}
              alt={`Prévia de ${titulo}`}
              className="h-full w-full object-cover"
            />
          ) : (
            "+"
          )}
        </button>

        <span className="text-sm font-medium text-[#252525]">{titulo}</span>

        <input
          ref={inputs[tipo]}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(event) => selecionarImagem(tipo, event)}
        />
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !carregando && !excluindo) onFechar();
      }}
    >
      
      <section className="relative max-h-[95vh] w-full max-w-[523px] overflow-y-auto bg-[#EEEEEE] px-8 py-8 sm:px-14">
        <button
          type="button"
          onClick={onFechar}
          disabled={carregando || excluindo}
          aria-label="Fechar modal"
          className="absolute right-6 top-5 text-4xl leading-none text-black hover:opacity-60 disabled:opacity-40"
        >
          ×
        </button>

        <h2 className="mb-7 pt-2 text-center text-2xl font-bold text-[#252525]">
          Editar loja
        </h2>
        {confirmarExclusao ? (
          <div className="flex flex-col gap-5">
            <p className="text-center text-base text-[#252525]">
              Tem certeza que deseja excluir a loja
              <strong> {loja.nome}</strong>?
            </p>

            <p className="text-center text-sm text-red-600">
              Esta ação não poderá ser desfeita.
            </p>

            {erro && (
              <p
                role="alert"
                className="text-center text-sm text-red-600"
              >
                {erro}
              </p>
            )}

            <button
              type="button"
              onClick={excluirLoja}
              disabled={excluindo}
              className="w-full rounded-full bg-red-600 py-3 font-medium text-white hover:bg-red-700 disabled:opacity-50"
            >
              {excluindo
                ? "Excluindo..."
                : "Confirmar exclusão"}
            </button>

            <button
              type="button"
              onClick={() => setConfirmarExclusao(false)}
              disabled={excluindo}
              className="w-full rounded-full border border-gray-400 bg-white py-3 font-medium text-[#252525] disabled:opacity-50"
            >
              Cancelar
            </button>
          </div>
        ) : (
        <form onSubmit={enviarFormulario} className="space-y-5">
          <input
            className={campo}
            placeholder="Nome da loja"
            value={nome}
            onChange={(event) => setNome(event.target.value)}
            maxLength={100}
            required
            disabled={excluindo || carregando}
          />

          <select
            className={campo}
            value={categoriaId}
            onChange={(event) => setCategoriaId(event.target.value)}
            required
            disabled={excluindo || carregando}
          >
            <option value="">Selecione uma categoria</option>
            {categorias.map((categoria) => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.nome}
              </option>
            ))}
          </select>

          <div className="pt-3">
            <p className="mb-4 text-center text-sm font-medium text-[#252525]">
              Imagens da loja
            </p>

            <div className="flex flex-wrap justify-center gap-6">
              {seletorImagem("sticker", "Foto / Sticker")}
              {seletorImagem("logo", "Logo")}
              {seletorImagem("banner", "Banner")}
            </div>

            <p className="mt-3 text-center text-xs text-gray-500">
              JPEG, PNG ou WebP · Até 5 MB por imagem
            </p>
          </div>

          {erro && (
            <p role="alert" className="text-center text-sm text-red-600">
              {erro}
            </p>
          )}
          <button
              type="button"
              onClick={() => {
                setErro("");
                setConfirmarExclusao(true);
              }}
              disabled={carregando}
              className="w-full rounded-full border border-red-600 bg-red-600 py-3 font-medium text-white transition hover:bg-red-50 disabled:opacity-50"
            >
              DELETAR
          </button>
          <div className="pt-4 flex justify-center">
            <button
              type="submit"
              disabled={carregando || categorias.length === 0}
              className="w-[300px] h-[50px] rounded-full bg-[#6A38F3] py-3 text-white shadow-md transition hover:bg-[#5229D4] disabled:opacity-60"
            >
              {carregando
                ? "Salvando..."
                : "Salvar"}
            </button>
          </div>
        </form>
        )}
      </section>
    </div>
  );
}
