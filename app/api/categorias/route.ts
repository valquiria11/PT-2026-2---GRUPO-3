import { NextResponse } from "next/server";

const BACKEND = process.env.BACKEND_URL ?? "http://localhost:3001";

export async function GET() {
  try {
    const resposta = await fetch(`${BACKEND}/categorias`, {
      cache: "no-store",
    });

    const resultado = await resposta.json().catch(() => null);

    return NextResponse.json(
      resultado ?? { message: "Resposta inválida do servidor." },
      { status: resposta.status },
    );
  } catch {
    return NextResponse.json(
      { message: "Não foi possível conectar ao servidor." },
      { status: 503 },
    );
  }
}
