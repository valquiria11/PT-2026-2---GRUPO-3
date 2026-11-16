import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import Perfil from "../components/perfil";

const BACKEND = process.env.BACKEND_URL ?? "http://localhost:3000";

export default function PerfilPage() {
  return (
    <Suspense fallback={<p className="p-8">Carregando perfil...</p>}>
      <PerfilCarregado />
    </Suspense>
  );
}

async function PerfilCarregado() {
  const token = (await cookies()).get("stockio_session")?.value;

  if (!token) {
    redirect("/login");
  }

  const resposta = await fetch(`${BACKEND}/user/me`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (!resposta.ok) {
    redirect("/login");
  }

  const usuario = await resposta.json();
  const id = usuario.id;

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
    logoUrl: loja.logo_url || undefined,
  }));

  const produtos = produtosAPI.map((produto: any) => ({
    id: produto.id,
    nome: produto.nome,
    preco: Number(produto.preco).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    }),
    disponivel: produto.stock > 0,
    imagemUrl: produto.imagens?.[0]?.image_url || "/img.png",
    lojaUrl: produto.loja?.logo_url || undefined,
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
      isOwner={true}
      usuario={usuario}
      produtos={produtos}
      lojas={lojas}
      avaliacoes={avaliacoes}
    />
  );
}
