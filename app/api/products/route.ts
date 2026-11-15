import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const busca = new URL(request.url).searchParams.get("busca")?.trim() ?? "";
  const backend = process.env.BACKEND_URL ?? "http://localhost:3001";

  try {
    const resposta = await fetch(
      `${backend}/product?${new URLSearchParams({ busca })}`,
      { cache: "no-store" },
    );

    if (!resposta.ok) {
      return NextResponse.json(
        { message: "Não foi possível buscar os produtos." },
        { status: resposta.status },
      );
    }

    return NextResponse.json(await resposta.json());
  } catch {
    return NextResponse.json(
      { message: "Não foi possível conectar ao servidor." },
      { status: 503 },
    );
  }
}
