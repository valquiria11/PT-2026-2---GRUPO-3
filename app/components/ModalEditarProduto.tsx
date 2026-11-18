"use client";

import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { Camera, Minus, Plus, X } from "lucide-react";
import Image from "next/image";

type Imagem = { id: number; image_url: string; pedido: number };
type Produto = {
  id: number;
  nome: string;
  descricao: string | null;
  preco: number;
  stock: number;
  imagens: Imagem[];
};
type Foto = { id?: number; url: string; arquivo?: File } | null;

type Props = {
  produto: Produto;
  onClose: () => void;
  onSaved?: () => void;
};

function urlImagem(url: string) {
  if (!url.startsWith("/uploads/products/")) return url;
  return `/api/product-image/${encodeURIComponent(url.slice("/uploads/products/".length))}`;
}

function mensagemErro(resultado: unknown, alternativa: string) {
  if (resultado && typeof resultado === "object" && "message" in resultado) {
    const mensagem = resultado.message;
    if (typeof mensagem === "string") return mensagem;
    if (Array.isArray(mensagem)) return mensagem.join(" ");
  }
  return alternativa;
}

export default function ModalEditarProduto({ produto, onClose, onSaved }: Props) {
  const [fotos, setFotos] = useState<Foto[]>(() => {
    const iniciais: Foto[] = [...produto.imagens]
      .sort((a, b) => a.pedido - b.pedido)
      .slice(0, 4)
      .map((imagem) => ({ id: imagem.id, url: urlImagem(imagem.image_url) }));
    return [...iniciais, ...Array<Foto>(4 - iniciais.length).fill(null)];
  });
  const [stock, setStock] = useState(produto.stock);
  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [salvoParcialmente, setSalvoParcialmente] = useState(false);
  const inputFoto = useRef<HTMLInputElement>(null);
  const posicaoFoto = useRef(0);
  const previews = useRef<string[]>([]);

  useEffect(() => () => previews.current.forEach(URL.revokeObjectURL), []);

  function escolherFoto(indice: number) {
    posicaoFoto.current = indice;
    inputFoto.current?.click();
  }

  function trocarFoto(evento: ChangeEvent<HTMLInputElement>) {
    const arquivo = evento.target.files?.[0];
    evento.target.value = "";
    if (!arquivo) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(arquivo.type) || arquivo.size > 5 * 1024 * 1024) {
      setErro("Use fotos JPEG, PNG ou WebP de até 5 MB.");
      return;
    }
    const indice = posicaoFoto.current;
    const anterior = fotos[indice];
    if (anterior?.arquivo) URL.revokeObjectURL(anterior.url);
    const url = URL.createObjectURL(arquivo);
    previews.current.push(url);
    setFotos((atuais) => atuais.map((foto, posicao) => posicao === indice ? { id: foto?.id, url, arquivo } : foto));
    setErro("");
  }

  function removerFoto(indice: number) {
    const foto = fotos[indice];
    if (foto?.arquivo) URL.revokeObjectURL(foto.url);
    setFotos((atuais) => atuais.map((atual, posicao) => posicao === indice ? null : atual));
  }

  async function enviarFoto(url: string, method: "POST" | "PATCH", arquivo: File) {
    const dados = new FormData();
    dados.append("imagem", arquivo);
    const resposta = await fetch(url, { method, body: dados });
    if (!resposta.ok) throw new Error("Não foi possível salvar uma das fotos.");
  }

  async function salvar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    const dados = new FormData(evento.currentTarget);
    const preco = Number(String(dados.get("preco") ?? "").replace(",", "."));
    const nome = String(dados.get("nome") ?? "").trim();
    if (!nome || !Number.isFinite(preco) || preco < 0) {
      setErro("Informe o nome e um preço válido.");
      return;
    }

    setSalvando(true);
    setErro("");
    try {
      const resposta = await fetch(`/api/products/${produto.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, descricao: String(dados.get("descricao") ?? "").trim(), preco, stock }),
      });
      const resultado: unknown = await resposta.json().catch(() => null);
      if (!resposta.ok) throw new Error(mensagemErro(resultado, "Não foi possível editar o produto."));

      try {
        for (const imagem of produto.imagens) {
          if (!fotos.some((foto) => foto?.id === imagem.id)) {
            const exclusao = await fetch(`/api/product-images/${imagem.id}`, { method: "DELETE" });
            if (!exclusao.ok) throw new Error("Não foi possível remover uma das fotos.");
          }
        }
        for (const foto of fotos) {
          if (foto?.id && foto.arquivo) await enviarFoto(`/api/product-images/${foto.id}`, "PATCH", foto.arquivo);
          if (foto?.arquivo && !foto.id) await enviarFoto(`/api/products/${produto.id}/images`, "POST", foto.arquivo);
        }
      } catch {
        setSalvoParcialmente(true);
        setErro("Os dados foram salvos, mas algumas fotos não foram atualizadas. Atualize a página para conferir.");
        onSaved?.();
        return;
      }

      onSaved?.();
      onClose();
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Não foi possível editar o produto.");
    } finally {
      setSalvando(false);
    }
  }

  function areaFoto(indice: number, principal = false) {
    const foto = fotos[indice];
    return (
      <div key={indice} className={`relative flex items-center justify-center overflow-hidden rounded-lg border border-dashed border-[#6A38F3] ${principal ? "h-24 w-full" : "h-20 flex-1"}`}>
        {foto ? (
          <>
            <Image src={foto.url} alt={`Foto ${indice + 1} do produto`} fill unoptimized className="object-contain" />
            <button type="button" onClick={() => removerFoto(indice)} aria-label={`Remover foto ${indice + 1}`} className="absolute right-1 top-1 rounded-full bg-white p-1 text-black"><X size={14} /></button>
            <button type="button" onClick={() => escolherFoto(indice)} aria-label={`Trocar foto ${indice + 1}`} className="absolute bottom-1 right-1 rounded-full bg-white p-1 text-[#6A38F3]"><Camera size={14} /></button>
          </>
        ) : (
          <button type="button" onClick={() => escolherFoto(indice)} aria-label={`Adicionar foto ${indice + 1}`} className="flex h-full w-full flex-col items-center justify-center text-[#6A38F3]">
            <Camera size={31} fill="currentColor" stroke="white" strokeWidth={1.5} />
            {principal && <span className="mt-1 text-xs text-[#242424]">Anexe as fotos do seu produto</span>}
          </button>
        )}
      </div>
    );
  }

  const campo = "w-full rounded-full bg-white px-5 py-2.5 text-sm text-black placeholder:text-[#9A9A9A] outline-none focus:ring-2 focus:ring-[#6A38F3]";

  return (
    <div role="presentation" className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4">
      <section role="dialog" aria-modal="true" aria-labelledby="titulo-editar-produto" className="relative max-h-[95vh] w-full max-w-[558px] overflow-y-auto rounded-2xl bg-[#EFEFEF] px-7 pb-9 pt-7 shadow-xl sm:px-12">
        <button type="button" onClick={onClose} aria-label="Fechar" className="absolute right-4 top-4 text-black"><X size={26} /></button>
        <h2 id="titulo-editar-produto" className="mb-4 text-center text-[27px] font-medium text-black">Editar Produto</h2>
        <form onSubmit={salvar} className="flex flex-col gap-2">
          <input ref={inputFoto} type="file" accept="image/jpeg,image/png,image/webp" onChange={trocarFoto} className="sr-only" aria-label="Foto do produto" />
          {areaFoto(0, true)}
          <div className="mb-2 mt-1 flex gap-6">{[1, 2, 3].map((indice) => areaFoto(indice))}</div>
          <input name="nome" aria-label="Nome do produto" defaultValue={produto.nome} required maxLength={120} className={campo} />
          <textarea name="descricao" aria-label="Descrição do produto" defaultValue={produto.descricao ?? ""} placeholder="Descrição do produto" rows={3} className="w-full resize-none rounded-2xl bg-white px-5 py-3 text-sm text-black outline-none focus:ring-2 focus:ring-[#6A38F3]" />
          <input name="preco" aria-label="Preço do produto" defaultValue={produto.preco} type="number" min="0" step="0.01" required className={campo} />
          <div className="my-2 flex items-center justify-center gap-14 text-[#6A38F3]">
            <button type="button" onClick={() => setStock((atual) => Math.max(0, atual - 1))} aria-label="Diminuir estoque" className="flex h-11 w-11 items-center justify-center rounded-full border border-current"><Minus size={27} /></button>
            <output aria-label="Quantidade em estoque" className="min-w-12 text-center text-4xl">{stock}</output>
            <button type="button" onClick={() => setStock((atual) => atual + 1)} aria-label="Aumentar estoque" className="flex h-11 w-11 items-center justify-center rounded-full border border-current"><Plus size={27} /></button>
          </div>
          {erro && <p role="alert" className="text-center text-sm text-[#933]">{erro}</p>}
          <button type="submit" disabled={salvando || salvoParcialmente} className="mx-auto mt-1 w-52 rounded-full bg-[#6A38F3] py-1.5 text-sm text-white shadow-md disabled:opacity-50">{salvando ? "Salvando..." : "Salvar alterações"}</button>
        </form>
      </section>
    </div>
  );
}
