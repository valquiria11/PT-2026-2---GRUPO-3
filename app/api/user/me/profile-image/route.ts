import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const BACKEND = process.env.BACKEND_URL ?? "http://localhost:3000";

export async function PATCH(request: Request) {
  const token = (await cookies()).get("stockio_session")?.value;

  if (!token) {
    return NextResponse.json(
      { message: "Você precisa estar autenticado." },
      { status: 401 },
    );
  }

  let dados: FormData;

  try {
    dados = await request.formData();
  } catch {
    return NextResponse.json(
      { message: "Dados inválidos." },
      { status: 400 },
    );
  }

  const imagem = dados.get("imagem");

  if (!(imagem instanceof File)) {
    return NextResponse.json(
      { message: "Envie uma imagem." },
      { status: 400 },
    );
  }

  const formulario = new FormData();
  formulario.append("imagem", imagem);

  let resposta: Response;

  try {
    resposta = await fetch(`${BACKEND}/profile-image/me`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formulario,
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
