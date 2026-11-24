import { NextResponse } from "next/server";

export async function GET() {
  try {
    const resposta = await fetch(`${process.env.BACKEND_URL ?? "http://localhost:3001"}/categorias`, {
      cache: "no-store",
    });
    const resultado = await resposta.json().catch(() => null);
    return NextResponse.json(resultado ?? { message: "Resposta inválida do servidor." }, {
      status: resposta.status,
    });
  } catch {
    return NextResponse.json({ message: "Não foi possível buscar as categorias." }, { status: 503 });
  }
}
