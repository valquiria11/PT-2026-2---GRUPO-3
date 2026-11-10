import { cookies } from "next/headers";
import Navbar from "./Navbar";

export default async function NavbarSession() {
  const token = (await cookies()).get("stockio_session")?.value;
  if (!token) return <Navbar />;

  let logado = false;
  try {
    const resposta = await fetch(`${process.env.BACKEND_URL ?? "http://localhost:3001"}/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    logado = resposta.ok;
  } catch {
    logado = false;
  }
  return <Navbar logado={logado} />;
}
