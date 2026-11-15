"use client";

import { useEffect, useState } from "react";
import type { Produto } from "../lib/products";

type Resultado = {
  termo: string;
  produtos: Produto[];
  erro: string;
};

export function useProducts(busca: string, enabled = true) {
  const [resultado, setResultado] = useState<Resultado | null>(null);
  const termo = busca.trim();

  useEffect(() => {
    if (!enabled) return;

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      try {
        const resposta = await fetch(
          `/api/products?${new URLSearchParams({ busca: termo })}`,
          { signal: controller.signal },
        );
        const dados = await resposta.json();

        if (!resposta.ok || !Array.isArray(dados)) {
          throw new Error(dados?.message ?? "Não foi possível buscar os produtos.");
        }

        if (!controller.signal.aborted) {
          setResultado({ termo, produtos: dados, erro: "" });
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          setResultado({
            termo,
            produtos: [],
            erro: error instanceof Error ? error.message : "Erro na busca.",
          });
        }
      }
    }, termo ? 300 : 0);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [termo, enabled]);

  const carregando = enabled && resultado?.termo !== termo;

  return {
    produtos: enabled && !carregando ? (resultado?.produtos ?? []) : [],
    carregando,
    erro: enabled && !carregando ? (resultado?.erro ?? "") : "",
  };
}
