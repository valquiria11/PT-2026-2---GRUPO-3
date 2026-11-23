"use client";

import { useEffect, useRef, useState } from "react";

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

interface ModalCriarLojaProps {
  onFechar: () => void;
  onLojaCriada: (loja: LojaCriada) => void;
}

type TipoImagem = "sticker" | "logo" | "banner";

export default function ModalCriarLoja({
  onFechar,
  onLojaCriada,
}: ModalCriarLojaProps) {
  const [nome, setNome] = useState("");
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
  const [lojaCriada, setLojaCriada] = useState<LojaCriada | null>(null);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

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
    event: React.ChangeEvent<HTMLInputElement>,
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

  async function enviarFormulario(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErro("");

    if (!lojaCriada && (!nome.trim() || !categoriaId)) {
      setErro("Preencha o nome e selecione uma categoria.");
      return;
    }

    setCarregando(true);

    try {
      let loja = lojaCriada;

      if (!loja) {
        const resposta = await fetch("/api/lojas", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nome: nome.trim(),
            categoria_id: Number(categoriaId),
          }),
        });

        const dados = await resposta.json();

        if (!resposta.ok) {
          throw new Error(
            dados.message || "Não foi possível criar a loja.",
          );
        }

        const categoriaSelecionada = categorias.find(
          (categoria) => categoria.id === Number(categoriaId),
        );

        loja = {
          id: dados.id,
          nome: dados.nome,
          categoria: dados.categoria?.nome || categoriaSelecionada?.nome || "Sem categoria",
          logoUrl: undefined,
        };

        setLojaCriada(loja);
      }

      const temImagem = Object.values(imagens).some(Boolean);

      if (temImagem) {
        const formulario = new FormData();

        if (imagens.sticker) formulario.append("sticker", imagens.sticker);
        if (imagens.logo) formulario.append("logo", imagens.logo);
        if (imagens.banner) formulario.append("banner", imagens.banner);

        const respostaImagem = await fetch(
          `/api/lojas/${loja.id}/imagens`,
          {
            method: "POST",
            body: formulario,
          },
        );

        const dadosImagem = await respostaImagem.json();

        if (!respostaImagem.ok) {
          throw new Error(
            dadosImagem.message ||
              "A loja foi criada, mas não foi possível enviar as imagens. Tente novamente.",
          );
        }

        const logoFilename = dadosImagem.logo_url?.split("/").pop();

        if (dadosImagem.logo_url?.startsWith("/uploads/lojas/") && logoFilename) {
          loja = {
            ...loja,
            logoUrl: `/api/store-image/${logoFilename}`,
          };
        }
      }

      onLojaCriada(loja);
      onFechar();
    } catch (error) {
      setErro(
        error instanceof Error ? error.message : "Erro ao criar loja.",
      );
    } finally {
      setCarregando(false);
    }
  }

  const campo =
    "w-full rounded-2xl border border-transparent bg-white px-3 py-3 text-sm text-[#252525] outline-none placeholder:text-gray-400 focus:border-[#6A38F3]";

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
        if (event.target === event.currentTarget && !carregando) onFechar();
      }}
    >
      <section className="relative max-h-[95vh] w-full max-w-[523px] overflow-y-auto bg-[#EEEEEE] px-8 py-8 sm:px-14">
        <button
          type="button"
          onClick={onFechar}
          disabled={carregando}
          aria-label="Fechar modal"
          className="absolute right-6 top-5 text-4xl leading-none text-black hover:opacity-60 disabled:opacity-40"
        >
          ×
        </button>

        <h2 className="mb-7 pt-2 text-center text-2xl font-bold text-[#252525]">
          Criar loja
        </h2>

        <form onSubmit={enviarFormulario} className="space-y-5">
          <input
            className={campo}
            placeholder="Nome da loja"
            value={nome}
            onChange={(event) => setNome(event.target.value)}
            maxLength={100}
            required
            disabled={!!lojaCriada || carregando}
          />

          <select
            className={campo}
            value={categoriaId}
            onChange={(event) => setCategoriaId(event.target.value)}
            required
            disabled={!!lojaCriada || carregando}
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

          {lojaCriada && (
            <p className="text-center text-sm text-amber-700">
              Loja criada. Falta concluir o envio das imagens.
            </p>
          )}

          {erro && (
            <p role="alert" className="text-center text-sm text-red-600">
              {erro}
            </p>
          )}

          <div className="pt-4">
            <button
              type="submit"
              disabled={carregando || categorias.length === 0}
              className="w-full rounded-full bg-[#6A38F3] py-3 text-white shadow-md transition hover:bg-[#5229D4] disabled:opacity-60"
            >
              {carregando
                ? "Salvando..."
                : lojaCriada
                  ? "Tentar enviar imagens"
                  : "Adicionar loja"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
