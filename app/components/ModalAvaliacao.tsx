"use client";

import { useState, useEffect } from "react";
import { X, Star } from "lucide-react";
import { League_Spartan } from "next/font/google";

const leagueSpartan = League_Spartan({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

interface BaseModalProps {
  aberto: boolean;
  onFechar: () => void;
  nomeLoja: string;
}

export interface ModalCriarAvaliacaoProps extends BaseModalProps {
  onAvaliar: (dados: { estrelas: number; comentario: string }) => void;
}

export interface ModalEditarAvaliacaoProps extends BaseModalProps {
  estrelasIniciais?: number;
  comentarioInicial?: string;
  onSalvar: (dados: { estrelas: number; comentario: string }) => void;
  onDeletar: () => void;
}

interface ConteudoModalProps {
  modo: "criar" | "editar";
  nomeLoja: string;
  estrelasIniciais?: number;
  comentarioInicial?: string;
  onFechar: () => void;
  onConfirmar: (dados: { estrelas: number; comentario: string }) => void;
  onDeletar?: () => void;
}

function ConteudoModalAvaliacao({
  modo,
  nomeLoja,
  estrelasIniciais = 0,
  comentarioInicial = "",
  onFechar,
  onConfirmar,
  onDeletar,
}: ConteudoModalProps) {
  const [estrelas, setEstrelas] = useState<number>(estrelasIniciais);
  const [hoverEstrela, setHoverEstrela] = useState<number>(0);
  const [comentario, setComentario] = useState<string>(comentarioInicial);

  useEffect(() => {
    setEstrelas(estrelasIniciais);
    setComentario(comentarioInicial);
  }, [estrelasIniciais, comentarioInicial]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (estrelas === 0) return;
    onConfirmar({ estrelas, comentario: comentario.trim() });
    onFechar();
  };

  return (
    <div
      className={`${leagueSpartan.className} fixed inset-0 z-50 bg-black/40 backdrop-blur-[1px] flex items-center justify-center p-4`}
      onClick={onFechar}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[#EDEDED] rounded-[24px] w-full max-w-[640px] px-8 md:px-12 pt-10 pb-9 relative shadow-xl"
      >
        {/* botão de fechar */}
        <button
          type="button"
          onClick={onFechar}
          aria-label="Fechar modal"
          className="absolute top-6 right-6 text-[#171918] hover:text-[#6735E8] transition-colors cursor-pointer"
        >
          <X className="w-6 h-6 stroke-[2]" />
        </button>

       
        <h2 className="text-2xl md:text-[26px] text-[#171918] font-normal tracking-tight">
          Você está avaliando{" "}
          <span className="font-semibold">{nomeLoja}</span>
        </h2>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col items-center">
          {/* 5 estrelas grandes */}
          <div className="flex items-center justify-center gap-3 my-2">
            {[1, 2, 3, 4, 5].map((valor) => {
              const ativa = valor <= (hoverEstrela || estrelas);
              return (
                <button
                  key={valor}
                  type="button"
                  onClick={() => setEstrelas(valor)}
                  onMouseEnter={() => setHoverEstrela(valor)}
                  onMouseLeave={() => setHoverEstrela(0)}
                  aria-label={`${valor} estrela${valor > 1 ? "s" : ""}`}
                  className="transition-transform hover:scale-110 cursor-pointer focus:outline-none"
                >
                  <Star
                    className={`w-12 h-12 md:w-14 md:h-14 stroke-[1.2] transition-colors ${
                      ativa
                        ? "fill-[#FFE600] text-[#6735E8]"
                        : "fill-transparent text-[#6735E8]"
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* caixa pro texto */}
          <textarea
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            placeholder="Avaliação da loja"
            rows={8}
            className="w-full mt-5 bg-white text-[#171918] placeholder-gray-400 rounded-[20px] p-5 text-sm resize-none outline-none border border-transparent focus:border-[#6735E8]"
          />

          {/* botoes de baixo */}
          {modo === "criar" ? (
            <button
              type="submit"
              disabled={estrelas === 0}
              className="mt-7 w-full max-w-[360px] bg-[#6735E8] hover:bg-[#5626D4] disabled:opacity-50 text-white font-medium text-sm py-2.5 rounded-full shadow-md transition-colors cursor-pointer"
            >
              Avaliar
            </button>
          ) : (
            <div className="mt-7 w-full flex flex-col items-center gap-4">
              <button
                type="button"
                onClick={() => {
                  onDeletar?.();
                  onFechar();
                }}
                className="w-full max-w-[360px] bg-[#FF0000] hover:bg-[#D90000] text-white font-semibold text-xs tracking-wider uppercase py-2.5 rounded-full shadow-md transition-colors cursor-pointer"
              >
                DELETAR
              </button>

              <button
                type="submit"
                disabled={estrelas === 0}
                className="w-full max-w-[360px] bg-[#6735E8] hover:bg-[#5626D4] disabled:opacity-50 text-white font-medium text-sm py-2.5 rounded-full shadow-md transition-colors cursor-pointer"
              >
                Salvar
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

/**
 * modal 1: fazer uma avaliação
 */
export function ModalCriarAvaliacao({
  aberto,
  onFechar,
  nomeLoja,
  onAvaliar,
}: ModalCriarAvaliacaoProps) {
  if (!aberto) return null;

  return (
    <ConteudoModalAvaliacao
      modo="criar"
      nomeLoja={nomeLoja}
      onFechar={onFechar}
      onConfirmar={onAvaliar}
    />
  );
}

/**
 * modal 2: editar a avaliação
 */
export function ModalEditarAvaliacao({
  aberto,
  onFechar,
  nomeLoja,
  estrelasIniciais = 5,
  comentarioInicial = "",
  onSalvar,
  onDeletar,
}: ModalEditarAvaliacaoProps) {
  if (!aberto) return null;

  return (
    <ConteudoModalAvaliacao
      modo="editar"
      nomeLoja={nomeLoja}
      estrelasIniciais={estrelasIniciais}
      comentarioInicial={comentarioInicial}
      onFechar={onFechar}
      onConfirmar={onSalvar}
      onDeletar={onDeletar}
    />
  );
}