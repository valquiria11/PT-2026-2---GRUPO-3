export async function GET(
  _request: Request,
  { params }: { params: Promise<{ filename: string }> },
) {
  const { filename } = await params;

  if (!/^[\w-]+\.(png|jpe?g|webp)$/.test(filename)) {
    return new Response(null, { status: 400 });
  }

  const backend = process.env.BACKEND_URL ?? "http://localhost:3000";

  try {
    const resposta = await fetch(
      `${backend}/uploads/profiles/${filename}`,
      { cache: "no-store" },
    );

    if (!resposta.ok) {
      return new Response(null, { status: resposta.status });
    }

    return new Response(resposta.body, {
      headers: {
        "Content-Type": resposta.headers.get("content-type") ?? "image/png",
      },
    });
  } catch {
    return new Response(null, { status: 503 });
  }
}
