"use client";

import { useState } from "react";
import Image from "next/image";

export default function Cadastro() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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
      const response = await fetch("http://localhost:3001/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome: formData.name,       // Enviando como 'nome' (o backend espera dto.nome)
          email: formData.email,     // Enviando como 'email'
          senha: formData.password,  // Enviando como 'senha' (o backend espera dto.senha)
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Erro ao cadastrar usuário.");
      }

      setMessage("Conta criada com sucesso!");
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
    } catch (error: any) {
      // fetch lança TypeError quando não consegue alcançar o servidor
      if (error instanceof TypeError) {
        setMessage("Não foi possível conectar ao servidor. Verifique se o backend está rodando na porta 3001.");
        return;
      }
      setMessage(error.message || "Falha no cadastro. Verifique os dados.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F7F4E8] flex">
      {/* FORMULÁRIO */}
      <section className="w-1/2 bg-[#171918] rounded-[30px] m-8 p-12 flex flex-col items-center mt-20">
        <h1 className="text-4xl font-bold text-[#F7F4E8] mb-10 mt-12">
          CRIE SUA CONTA
        </h1>

        <form onSubmit={handleSubmit} className="w-full max-w-md flex flex-col items-center">
          <input
            type="text"
            name="name"
            placeholder="Nome Completo"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full rounded-full bg-[#F7F4E8] px-6 py-4 mb-4 text-gray-700 outline-none"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full rounded-full bg-[#F7F4E8] px-6 py-4 mb-4 text-gray-700 outline-none"
          />

          <input
            type="password"
            name="password"
            placeholder="Senha"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full rounded-full bg-[#F7F4E8] px-6 py-4 mb-4 text-gray-700 outline-none"
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirmar Senha"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className="w-full rounded-full bg-[#F7F4E8] px-6 py-4 mb-8 text-gray-700 outline-none"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-[#6735E8] py-4 text-xl font-bold text-white hover:bg-[#5626D4] disabled:opacity-50 transition-all cursor-pointer"
          >
            {loading ? "CRIANDO..." : "CRIAR CONTA"}
          </button>
        </form>

        {message && (
          <p className="mt-4 text-[#F7F4E8] text-center font-medium">
            {message}
          </p>
        )}

        <p className="mt-6 text-lg text-[#F7F4E8]">
          Já possui uma conta?{" "}
          <span className="text-[#6735E8] font-semibold cursor-pointer">
            Login
          </span>
        </p>
      </section>

      {/* PARTE DIREITA */}
      <section className="w-1/2 flex flex-col items-center justify-center">
        <Image
          src="/logo.png"
          alt="Logo stock.id"
          width={400}
          height={400}
        />
        <Image
          src="/mascote.png"
          alt="Mascote do CJR"
          width={500}
          height={500}
        />
      </section>
    </main>
  );
}
