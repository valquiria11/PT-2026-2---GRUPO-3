import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const token = (await cookies()).get("stockio_session")?.value;
  if (!token) {
    return NextResponse.json({ message: "Entre na sua conta para editar o produto." }, { status: 401 });
  }

  const { id } = await params;
  if (!/^[1-9]\d*$/.test(id)) {
    return NextResponse.json({ message: "Produto inválido." }, { status: 400 });
  }

  let dados: unknown;
  try {
    dados = await request.json();
  } catch {
    return NextResponse.json({ message: "Dados inválidos." }, { status: 400 });
  }

  try {
    const resposta = await fetch(`${process.env.BACKEND_URL ?? "http://localhost:3001"}/product/${id}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(dados),
      cache: "no-store",
    });
    const resultado = await resposta.json().catch(() => null);
    return NextResponse.json(resultado ?? { message: "Resposta inválida do servidor." }, { status: resposta.status });
  } catch {
    return NextResponse.json({ message: "Não foi possível conectar ao servidor." }, { status: 503 });
  }
}
