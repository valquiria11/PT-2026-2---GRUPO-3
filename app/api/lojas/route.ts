import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const BACKEND = process.env.BACKEND_URL ?? "http://localhost:3001";

export async function POST(request: Request) {
  const token = (await cookies()).get("stockio_session")?.value;

  if (!token) {
    return NextResponse.json(
      { message: "Você precisa estar autenticado." },
      { status: 401 },
    );
  }

  let dados: unknown;

  try {
    dados = await request.json();
  } catch {
    return NextResponse.json(
      { message: "Dados inválidos." },
      { status: 400 },
    );
  }

  let resposta: Response;

  try {
    resposta = await fetch(`${BACKEND}/lojas`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(dados),
      cache: "no-store",
    });
  } catch {
    return NextResponse.json(
      { message: "Não foi possível conectar ao servidor." },
      { status: 503 },
    );
  }

  const resultado = await resposta.json().catch(() => null);

  return NextResponse.json(
    resultado ?? { message: "Resposta inválida do servidor." },
    { status: resposta.status },
  );
}
