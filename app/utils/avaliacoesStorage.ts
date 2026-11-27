import { TODOS_PRODUTOS, Avaliacao, RespostaAvaliacao } from "@/app/data/produtos";

const STORAGE_KEY = "stockio_avaliacoes_custom";

/**
 * segui um passo a passo:
 * formata uma data ISO para tempo relativo:
 * - menos de 1 min -> "agora"
 * - menos de 1 hora -> "Xm"
 * - menos de 24 horas -> "Xh"
 * - 24 horas ou mais -> "X dias atrás" (ou "1 dia atrás")
 */
export function formatarTempoRelativo(dataIso?: string): string {
  if (!dataIso) return "1h";

  const agora = new Date().getTime();
  const criadoEm = new Date(dataIso).getTime();

  if (isNaN(criadoEm)) return dataIso; // caso já venha texto pronto como "1h" pra exemplo

  const diffMs = Math.max(0, agora - criadoEm);
  const minutos = Math.floor(diffMs / (1000 * 60));
  const horas = Math.floor(diffMs / (1000 * 60 * 60));
  const dias = Math.floor(horas / 24);

  if (minutos < 1) return "agora";
  if (horas < 1) return `${minutos}m`;
  if (horas < 24) return `${horas}h`;
  return dias === 1 ? "1 dia atrás" : `${dias} dias atrás`;
}

/**
 * retorna todas as avaliações de um produto (juntando as do produtos.ts + publicadas no navegador)
 */
export function obterAvaliacoesDoProduto(produtoId: number): Avaliacao[] {
  const produto = TODOS_PRODUTOS.find((p) => p.id === produtoId);
  const base: Avaliacao[] = produto?.avaliacoes ? [...produto.avaliacoes] : [];

  if (typeof window === "undefined") return base;

  try {
    const salvo = localStorage.getItem(STORAGE_KEY);
    const mapaSalvo: Record<number, Avaliacao[]> = salvo ? JSON.parse(salvo) : {};
    const extras = mapaSalvo[produtoId] || [];

    const mapaFinal = new Map<number, Avaliacao>();
    base.forEach((av) => mapaFinal.set(av.id, av));
    extras.forEach((av) => mapaFinal.set(av.id, av));

    return Array.from(mapaFinal.values());
  } catch {
    return base;
  }
}

/**
 * salvar uma nova avaliação publicada (ou atualiza uma existente com novas respostas/edição)
 */
export function salvarAvaliacaoNoProduto(produtoId: number, avaliacaoAtualizada: Avaliacao) {
  if (typeof window === "undefined") return;

  try {
    const salvo = localStorage.getItem(STORAGE_KEY);
    const mapaSalvo: Record<number, Avaliacao[]> = salvo ? JSON.parse(salvo) : {};
    const listaProduto = mapaSalvo[produtoId] || [];

    const index = listaProduto.findIndex((a) => a.id === avaliacaoAtualizada.id);
    if (index >= 0) {
      listaProduto[index] = avaliacaoAtualizada;
    } else {
      listaProduto.unshift(avaliacaoAtualizada);
    }

    mapaSalvo[produtoId] = listaProduto;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mapaSalvo));
  } catch (err) {
    console.error("Erro ao salvar avaliação:", err);
  }
}

/**
 * helper pronto para ser chamado pela futura tela de "Publicar Avaliação"
 */
export function publicarNovaAvaliacao(params: {
  produtoId: number;
  usuario: string;
  fotoUsuario: string;
  comentario: string;
  estrelas: number;
}): Avaliacao {
  const nova: Avaliacao = {
    id: Date.now(),
    usuario: params.usuario,
    fotoUsuario: params.fotoUsuario,
    dataCriacao: new Date().toISOString(),
    comentario: params.comentario,
    estrelas: params.estrelas,
    respostas: [],
  };

  salvarAvaliacaoNoProduto(params.produtoId, nova);
  return nova;
}