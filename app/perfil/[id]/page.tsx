
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import Perfil from "../../components/perfil";
import { imagemLoja, imagemProduto } from "../../lib/products";

const BACKEND = process.env.BACKEND_URL ?? "http://localhost:3001";

type Params = Promise<{ id: string }>;

export default function PerfilPublicoPage({
  params,
}: {
  params: Params;
}) {
  return (
    <Suspense fallback={<p className="p-8">Carregando perfil...</p>}>
      <PerfilPublicoCarregado params={params} />
    </Suspense>
  );
}

async function PerfilPublicoCarregado({
  params,
}: {
  params: Params;
}) {
  const { id } = await params;

  if (!/^\d+$/.test(id)) {
    notFound();
  }

  const resposta = await fetch(`${BACKEND}/user/public/${id}`, {
    cache: "no-store",
  });

  if (resposta.status === 404) {
    notFound();
  }

  if (!resposta.ok) {
    throw new Error("Erro ao carregar o perfil.");
  }

  const usuario = await resposta.json();

  const token = (await cookies()).get("stockio_session")?.value;

  if (token) {
    const respostaUsuario = await fetch(`${BACKEND}/user/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    if (respostaUsuario.ok) {
      const usuarioLogado = await respostaUsuario.json();

      if (usuarioLogado.id === usuario.id) {
        redirect("/perfil");
      }
    }
  }

  const respostas = await Promise.all([
    fetch(`${BACKEND}/lojas/usuario/${id}`, { cache: "no-store" }),
    fetch(`${BACKEND}/product/usuario/${id}`, { cache: "no-store" }),
    fetch(`${BACKEND}/avaliacao/loja/usuario/${id}`, { cache: "no-store" }),
    fetch(`${BACKEND}/avaliacao/produto/usuario/${id}`, { cache: "no-store" }),
  ]);

  if (respostas.some((r) => !r.ok)) {
    throw new Error("Erro ao carregar os dados do perfil.");
  }

  const [lojasAPI, produtosAPI, avaliacoesLojas, avaliacoesProdutos] =
    await Promise.all(respostas.map((r) => r.json()));

  const lojas = lojasAPI.map((loja: any) => ({
    id: loja.id,
    nome: loja.nome,
    categoria: loja.categoria?.nome || "Sem categoria",
    logoUrl: imagemLoja(loja.logo_url),
  }));

  const produtos = produtosAPI.map((produto: any) => ({
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
  }));

  const avaliacoes = [
    ...avaliacoesLojas,
    ...avaliacoesProdutos,
  ].map((avaliacao: any) => ({
    id: avaliacao.id,
    autorNome: avaliacao.usuario?.nome || "Usuário",
    nota: avaliacao.nota,
    comentario: avaliacao.comentario || "",
  }));

  return (
    <Perfil
      isOwner={false}
      usuario={usuario}
      produtos={produtos}
      lojas={lojas}
      avaliacoes={avaliacoes}
    />
  );
}
