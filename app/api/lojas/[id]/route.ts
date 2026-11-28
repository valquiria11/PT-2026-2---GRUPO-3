
import { NextResponse } from "next/server";

const BACKEND =
    process.env.BACKEND_URL ?? "http://localhost:3001";

export async function GET(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;

    if (!/^\d+$/.test(id)) {
        return NextResponse.json(
            { message: "ID inválido." },
            { status: 400 }
        );
    }

    try {
        const resposta = await fetch(
            `${BACKEND}/lojas/${id}`,
            {
                method: "GET",
                cache: "no-store",
            }
        );

        const dados = await resposta.json().catch(() => null);

        return NextResponse.json(
            dados ?? { message: "Resposta inválida." },
            { status: resposta.status }
        );
    } catch {
        return NextResponse.json(
            { message: "Erro ao conectar ao backend." },
            { status: 503 }
        );
    }
}
