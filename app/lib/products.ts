export type Produto = {
  id: number;
  nome: string;
  preco: number;
  stock: number;
  categoria_id: number;
  createdAt: string;
  categoria: { id: number; nome: string };
  loja: { id: number; nome: string; logo_url: string | null };
  imagens: { image_url: string; pedido: number }[];
};

export function imagemProduto(produto: Produto) {
  const url = [...produto.imagens].sort((a, b) => a.pedido - b.pedido)[0]
    ?.image_url;

  if (!url) return null;
  if (!url.startsWith("/uploads/products/")) return url;

  const filename = url.slice("/uploads/products/".length);
  return `/api/product-image/${encodeURIComponent(filename)}`;
}

export function imagemLoja(url: string | null | undefined) {
  if (!url) return undefined;
  if (!url.startsWith("/uploads/lojas/")) return url;

  const filename = url.slice("/uploads/lojas/".length);
  return `/api/store-image/${encodeURIComponent(filename)}`;
}
