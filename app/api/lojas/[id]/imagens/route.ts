import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const BACKEND = process.env.BACKEND_URL ?? "http://localhost:3001";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const token = (await cookies()).get("stockio_session")?.value;

  if (!token) {
    return NextResponse.json(
      { message: "Você precisa estar autenticado." },
      { status: 401 },
    );
  }

  const { id } = await context.params;

  if (!/^\d+$/.test(id)) {
    return NextResponse.json(
      { message: "ID de loja inválido." },
      { status: 400 },
    );
  }

  const contentType = request.headers.get("content-type");

  if (!contentType?.includes("multipart/form-data")) {
    return NextResponse.json(
      { message: "Envie os arquivos no formato correto." },
      { status: 400 },
    );
  }

  let resposta: Response;

  try {
    resposta = await fetch(`${BACKEND}/lojas/${id}/imagens`, {
      method: "POST",
      headers: {
        "Content-Type": contentType,
        Authorization: `Bearer ${token}`,
      },
      body: await request.arrayBuffer(),
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
