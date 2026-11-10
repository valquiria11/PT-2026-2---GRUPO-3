"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Cadastro() {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (formData.password !== formData.confirmPassword) {
      setMessage("As senhas não coincidem!");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: formData.name,
          username: formData.username,
          email: formData.email,
          senha: formData.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message;
        throw new Error(Array.isArray(errorMessage) ? errorMessage.join(" ") : errorMessage || "Erro ao cadastrar usuário.");
      }

      const loginResponse = await fetch("/api/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, senha: formData.password }),
      });

      if (loginResponse.ok) {
        router.push("/");
        router.refresh();
        return;
      }

      setMessage("Conta criada. Faça login para entrar.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Falha no cadastro. Verifique os dados.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-92px)] bg-[#F7F4E8] flex max-md:flex-col">
      <section className="w-1/2 max-md:w-auto bg-[#171918] rounded-[30px] m-8 p-12 max-sm:m-4 max-sm:p-8 flex flex-col items-center">
        <h1 className="text-4xl font-bold text-[#F7F4E8] mb-10 mt-12 max-sm:mt-4">CRIE SUA CONTA</h1>

        <form onSubmit={handleSubmit} className="w-full max-w-md flex flex-col items-center">
          <input type="text" name="name" placeholder="Nome Completo" aria-label="Nome Completo" value={formData.name} onChange={handleChange} required className="w-full rounded-full bg-[#F7F4E8] px-6 py-4 mb-4 text-gray-700 outline-none" />
          <input type="text" name="username" placeholder="Username" aria-label="Username" value={formData.username} onChange={handleChange} required className="w-full rounded-full bg-[#F7F4E8] px-6 py-4 mb-4 text-gray-700 outline-none" />
          <input type="email" name="email" placeholder="Email" aria-label="Email" value={formData.email} onChange={handleChange} required className="w-full rounded-full bg-[#F7F4E8] px-6 py-4 mb-4 text-gray-700 outline-none" />
          <input type="password" name="password" placeholder="Senha" aria-label="Senha" value={formData.password} onChange={handleChange} required className="w-full rounded-full bg-[#F7F4E8] px-6 py-4 mb-4 text-gray-700 outline-none" />
          <input type="password" name="confirmPassword" placeholder="Confirmar Senha" aria-label="Confirmar Senha" value={formData.confirmPassword} onChange={handleChange} required className="w-full rounded-full bg-[#F7F4E8] px-6 py-4 mb-8 text-gray-700 outline-none" />

          <button type="submit" disabled={loading} className="w-full rounded-full bg-[#6735E8] py-4 text-xl font-bold text-white hover:bg-[#5626D4] disabled:opacity-50 transition-all cursor-pointer">
            {loading ? "CRIANDO..." : "CRIAR CONTA"}
          </button>
        </form>

        {message && <p role="status" className="mt-4 text-[#F7F4E8] text-center font-medium">{message}</p>}

        <p className="mt-6 text-lg text-[#F7F4E8]">Já possui uma conta? <Link className="text-[#6735E8] font-semibold" href="/login">Login</Link></p>
      </section>

      <section className="w-1/2 max-md:w-full flex flex-col items-center justify-center">
        <Image src="/logo.png" alt="Logo Stock.io" width={400} height={400} />
        <Image src="/mascote.png" alt="Mascote do Stock.io" width={500} height={500} />
      </section>
    </main>
  );
}
