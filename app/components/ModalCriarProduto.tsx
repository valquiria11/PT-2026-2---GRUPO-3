"use client";

import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { Camera, Minus, Plus, X } from "lucide-react";
import Image from "next/image";

type Categoria = { id: number; nome: string; categoria_principal_id: number | null };
type Foto = { arquivo: File; preview: string };

type Props = {
  lojaId: number;
  onClose: () => void;
  onCreated?: (produtoId: number) => void;
};

export default function ModalCriarProduto({ lojaId, onClose, onCreated }: Props) {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoriaId, setCategoriaId] = useState("");
  const [fotos, setFotos] = useState<Foto[]>([]);
  const [stock, setStock] = useState(13);
  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [carregandoCategorias, setCarregandoCategorias] = useState(true);
  const inputFoto = useRef<HTMLInputElement>(null);
  const previews = useRef<string[]>([]);

  useEffect(() => {
    let ativo = true;
    fetch("/api/products/categories")
      .then(async (resposta) => {
        if (!resposta.ok) throw new Error("Não foi possível buscar as categorias.");
        return resposta.json();
      })
      .then((dados: Categoria[]) => {
        if (ativo) setCategorias(dados.filter((categoria) => categoria.categoria_principal_id != null));
      })
      .catch((error: Error) => {
        if (ativo) setErro(error.message);
      })
      .finally(() => {
        if (ativo) setCarregandoCategorias(false);
      });
    return () => {
      ativo = false;
      previews.current.forEach(URL.revokeObjectURL);
    };
  }, []);

  function adicionarFotos(evento: ChangeEvent<HTMLInputElement>) {
    const arquivos = Array.from(evento.target.files ?? []);
    evento.target.value = "";
    if (fotos.length + arquivos.length > 4) {
      setErro("Escolha no máximo 4 fotos.");
      return;
    }
    if (arquivos.some((arquivo) => !["image/jpeg", "image/png", "image/webp"].includes(arquivo.type) || arquivo.size > 5 * 1024 * 1024)) {
      setErro("Use fotos JPEG, PNG ou WebP de até 5 MB cada.");
      return;
    }
    setErro("");
    setFotos((atuais) => [...atuais, ...arquivos.map((arquivo) => {
      const preview = URL.createObjectURL(arquivo);
      previews.current.push(preview);
      return { arquivo, preview };
    })]);
  }

  function removerFoto(indice: number) {
    const foto = fotos[indice];
    URL.revokeObjectURL(foto.preview);
    previews.current = previews.current.filter((preview) => preview !== foto.preview);
    setFotos((atuais) => atuais.filter((_, posicao) => posicao !== indice));
  }

  async function adicionar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setErro("");
    const formulario = new FormData(evento.currentTarget);
    const preco = Number(String(formulario.get("preco") ?? "").replace(",", "."));
    if (!Number.isFinite(preco) || preco < 0) {
      setErro("Informe um preço válido.");
      return;
    }
    if (!categoriaId) {
      setErro("Escolha uma subcategoria.");
      return;
    }

    setSalvando(true);
    try {
      const resposta = await fetch("/api/products/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          loja_id: lojaId,
          categoria_id: Number(categoriaId),
          nome: String(formulario.get("nome") ?? "").trim(),
          descricao: String(formulario.get("descricao") ?? "").trim(),
          preco,
          stock,
        }),
      });
      const produto = await resposta.json().catch(() => null);
      if (!resposta.ok || typeof produto?.id !== "number") {
        throw new Error(produto?.message ?? "Não foi possível cadastrar o produto.");
      }

      for (const foto of fotos) {
        const dados = new FormData();
        dados.append("imagem", foto.arquivo);
        const envio = await fetch(`/api/products/${produto.id}/images`, { method: "POST", body: dados });
        if (!envio.ok) {
          setErro("Produto cadastrado, mas nem todas as fotos foram enviadas. Tente adicioná-las depois.");
          onCreated?.(produto.id);
          return;
        }
      }
      onCreated?.(produto.id);
      onClose();
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Não foi possível cadastrar o produto.");
    } finally {
      setSalvando(false);
    }
  }

  function escolherFoto() {
    inputFoto.current?.click();
  }

  function areaFoto(indice: number, principal = false) {
    const foto = fotos[indice];
    return (
      <div key={indice} className={`relative flex items-center justify-center overflow-hidden rounded-lg border border-dashed border-[#6A38F3] ${principal ? "h-24 w-full" : "h-20 flex-1"}`}>
        {foto ? (
          <>
            <Image src={foto.preview} alt={`Foto ${indice + 1} do produto`} fill unoptimized className="object-contain" />
            <button type="button" onClick={() => removerFoto(indice)} aria-label={`Remover foto ${indice + 1}`} className="absolute right-1 top-1 rounded-full bg-white p-1 text-black"><X size={14} /></button>
          </>
        ) : (
          <button type="button" onClick={escolherFoto} aria-label={`Adicionar foto ${indice + 1}`} className="flex h-full w-full flex-col items-center justify-center text-[#6A38F3]">
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
      <section role="dialog" aria-modal="true" aria-labelledby="titulo-criar-produto" className="relative max-h-[95vh] w-full max-w-[558px] overflow-y-auto rounded-2xl bg-[#EFEFEF] px-7 pb-9 pt-7 shadow-xl sm:px-12">
        <button type="button" onClick={onClose} aria-label="Fechar" className="absolute right-4 top-4 text-black"><X size={26} /></button>
        <h2 id="titulo-criar-produto" className="mb-4 text-center text-[27px] font-medium text-black">Adicionar Produto</h2>
        <form onSubmit={adicionar} className="flex flex-col gap-2">
          <input ref={inputFoto} type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={adicionarFotos} className="sr-only" aria-label="Fotos do produto" />
          {areaFoto(0, true)}
          <div className="mb-2 mt-1 flex gap-6">{[1, 2, 3].map((indice) => areaFoto(indice))}</div>
          <input name="nome" aria-label="Nome do produto" placeholder="Nome do produto" required maxLength={120} className={campo} />
          <select value={categoriaId} onChange={(evento) => setCategoriaId(evento.target.value)} aria-label="Subcategoria" required disabled={carregandoCategorias || categorias.length === 0} className={`${campo} appearance-auto text-[#777] disabled:opacity-60`}>
            <option value="">{carregandoCategorias ? "Carregando subcategorias..." : "Subcategoria"}</option>
            {categorias.map((categoria) => <option key={categoria.id} value={categoria.id}>{categoria.nome}</option>)}
          </select>
          <textarea name="descricao" aria-label="Descrição do produto" placeholder="Descrição do produto" rows={3} className="w-full resize-none rounded-2xl bg-white px-5 py-3 text-sm text-black placeholder:text-[#555] outline-none focus:ring-2 focus:ring-[#6A38F3]" />
          <input name="preco" aria-label="Preço do produto" placeholder="Preço do produto" type="number" min="0" step="0.01" required className={campo} />
          <div className="my-2 flex items-center justify-center gap-14 text-[#6A38F3]">
            <button type="button" onClick={() => setStock((atual) => Math.max(0, atual - 1))} aria-label="Diminuir estoque" className="flex h-11 w-11 items-center justify-center rounded-full border border-current"><Minus size={27} /></button>
            <output aria-label="Quantidade em estoque" className="min-w-12 text-center text-4xl">{stock}</output>
            <button type="button" onClick={() => setStock((atual) => atual + 1)} aria-label="Aumentar estoque" className="flex h-11 w-11 items-center justify-center rounded-full border border-current"><Plus size={27} /></button>
          </div>
          {categorias.length === 0 && !carregandoCategorias && <p className="text-center text-sm text-[#933]">Cadastre uma subcategoria antes de adicionar produtos.</p>}
          {erro && <p role="alert" className="text-center text-sm text-[#933]">{erro}</p>}
          <button type="submit" disabled={salvando || categorias.length === 0} className="mx-auto mt-1 w-52 rounded-full bg-[#6A38F3] py-1.5 text-sm text-white shadow-md disabled:opacity-50">{salvando ? "Adicionando..." : "Adicionar"}</button>
        </form>
      </section>
    </div>
  );
}
