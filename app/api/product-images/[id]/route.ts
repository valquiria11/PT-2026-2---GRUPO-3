import { cookies } from "next/headers";
import { NextResponse } from "next/server";

async function encaminhar(request: Request, id: string, method: "PATCH" | "DELETE") {
  const token = (await cookies()).get("stockio_session")?.value;
  if (!token) {
    return NextResponse.json({ message: "Entre na sua conta para alterar fotos." }, { status: 401 });
  }
  if (!/^[1-9]\d*$/.test(id)) {
    return NextResponse.json({ message: "Foto inválida." }, { status: 400 });
  }

  try {
    const resposta = await fetch(`${process.env.BACKEND_URL ?? "http://localhost:3001"}/img-product/${id}`, {
      method,
      headers: { Authorization: `Bearer ${token}` },
      body: method === "PATCH" ? await request.formData() : undefined,
      cache: "no-store",
    });
    const resultado = await resposta.json().catch(() => null);
    return NextResponse.json(resultado ?? { ok: resposta.ok }, { status: resposta.status });
  } catch {
    return NextResponse.json({ message: "Não foi possível conectar ao servidor." }, { status: 503 });
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  return encaminhar(request, (await params).id, "PATCH");
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  return encaminhar(request, (await params).id, "DELETE");
}
