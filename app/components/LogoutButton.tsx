"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LogoutButton({ children, className }: { children: React.ReactNode; className: string }) {
  const [saindo, setSaindo] = useState(false);
  const router = useRouter();

  async function sair() {
    setSaindo(true);
    try {
      const resposta = await fetch("/api/session", { method: "DELETE" });
      if (!resposta.ok) throw new Error();
      router.push("/");
      router.refresh();
    } catch {
      setSaindo(false);
    }
  }

  return <button type="button" className={`${className} cursor-pointer disabled:opacity-50`} aria-label="Sair" onClick={sair} disabled={saindo}>{children}</button>;
}
