import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const token = (await cookies()).get("stockio_session")?.value;
  if (!token) {
    return NextResponse.json({ message: "Entre na sua conta para enviar fotos." }, { status: 401 });
  }

  const { id } = await params;
  if (!/^[1-9]\d*$/.test(id)) {
    return NextResponse.json({ message: "Produto inválido." }, { status: 400 });
  }

  try {
    const resposta = await fetch(`${process.env.BACKEND_URL ?? "http://localhost:3001"}/img-product/${id}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: await request.formData(),
      cache: "no-store",
    });
    const resultado = await resposta.json().catch(() => null);
    return NextResponse.json(resultado ?? { message: "Resposta inválida do servidor." }, {
      status: resposta.status,
    });
  } catch {
    return NextResponse.json({ message: "Não foi possível enviar a foto." }, { status: 503 });
  }
}
