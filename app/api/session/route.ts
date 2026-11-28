import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  let dados: unknown;
  try {
    dados = await request.json();
  } catch {
    return NextResponse.json({ message: "Dados inválidos." }, { status: 400 });
  }

  let resposta: Response;
  try {
    resposta = await fetch(`${process.env.BACKEND_URL ?? "http://localhost:3001"}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
      cache: "no-store",
    });
  } catch {
    return NextResponse.json({ message: "Não foi possível conectar ao servidor." }, { status: 503 });
  }

  const resultado = await resposta.json().catch(() => null);
  if (!resposta.ok) {
    return NextResponse.json({ message: resultado?.message ?? "Não foi possível entrar." }, { status: resposta.status });
  }
  if (typeof resultado?.access_token !== "string") {
    return NextResponse.json({ message: "Resposta inválida do servidor." }, { status: 502 });
  }

  const retorno = NextResponse.json({ ok: true });
  retorno.cookies.set("stockio_session", resultado.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24,
  });
  return retorno;
}

export async function DELETE() {
  const resposta = NextResponse.json({ ok: true });
  resposta.cookies.delete("stockio_session");
  return resposta;
}


export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("stockio_session")?.value;

  if (!token) {
    return NextResponse.json(
      { message: "Não autenticado." },
      { status: 401 }
    );
  }

  try {
    const res = await fetch(
      `${process.env.BACKEND_URL ?? "http://localhost:3001"}/me`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    );

    if (!res.ok) {
      return NextResponse.json(
        { message: "Sessão inválida ou expirada." },
        { status: res.status }
      );
    }

    const usuario = await res.json();

    return NextResponse.json({
      id: usuario.sub,
      nome: usuario.nome,
    });
  } catch (error) {
    console.error("Erro ao consultar sessão:", error);

    return NextResponse.json(
      { message: "Erro ao verificar autenticação." },
      { status: 503 }
    );
  }
}
