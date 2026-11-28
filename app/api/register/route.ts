import { NextResponse } from "next/server";

export async function POST(request: Request) {
  let dados: unknown;
  try {
    dados = await request.json();
  } catch {
    return NextResponse.json({ message: "Dados inválidos." }, { status: 400 });
  }

  let resposta: Response;
  try {
    resposta = await fetch(`${process.env.BACKEND_URL ?? "http://localhost:3001"}/user`, {
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
    return NextResponse.json({ message: resultado?.message ?? "Não foi possível criar a conta." }, { status: resposta.status });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
