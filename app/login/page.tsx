"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Login() {
    const [mostrarSenha, setMostrarSenha] = useState(false);

    return (
        <main className="min-h-screen flex flex-col lg:flex-row bg-[#f5f5e8]">
            <div className="bg-[#f5f5e8] text-black w-full lg:w-1/2 flex flex-col items-center justify-between px-6 pt-10 lg:pt-14">
                <Image src="/img_1.png" alt="Logo Stock.io" width={842} height={444} className="w-full max-w-md h-auto" priority />
                <Image
                    src="/img.png"
                    alt="Mascote do Stock.io segurando uma caixa"
                    width={940}
                    height={2048}
                    className="w-auto h-80 sm:h-96 lg:h-[1100px] mt-8 object-contain object-bottom"
                    priority
                />
            </div>

            <div className="w-full lg:w-[40%] lg:mt-14 lg:mr-[6%] bg-[#151917] text-[#f5f5e8] rounded-t-[48px] lg:rounded-t-[100px] px-6 py-12 sm:px-10 lg:px-[75px] lg:pt-[88px]">
                <div className="w-full max-w-xl mx-auto">
                    <h1 className="text-center font-extrabold text-3xl sm:text-4xl lg:text-[44.42px] leading-none uppercase mb-10">Bem-vindo de volta!</h1>

                    <form>
                        <label className="sr-only" htmlFor="email">Email</label>
                        <input className="rounded-full px-7 py-3 bg-[#f5f5e8] block w-full text-black placeholder:text-zinc-500" id="email" name="email" type="email" placeholder="Email" required />

                        <label className="sr-only" htmlFor="senha">Senha</label>
                        <div className="relative mt-7">
                            <input className="rounded-full pl-7 pr-14 py-3 bg-[#f5f5e8] block w-full text-black placeholder:text-zinc-500" id="senha" name="senha" type={mostrarSenha ? "text" : "password"} placeholder="Senha" required/>
                            <button
                                type="button"
                                onClick={() => setMostrarSenha(!mostrarSenha)}
                                aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
                                className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-700"
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M1.5 12S5.5 5 12 5s10.5 7 10.5 7-4 7-10.5 7S1.5 12 1.5 12z" />
                                    <circle cx="12" cy="12" r="3" />
                                    {mostrarSenha && <path d="M3 3l18 18" />}
                                </svg>
                            </button>
                        </div>

                        <p className="mt-5 text-center cursor-pointer underline">Esqueceu sua senha?</p>

                        <button className="bg-[#6A38F3] rounded-full cursor-pointer h-[52px] font-semibold text-[25.38px] leading-none mt-8 block w-full" type="button">ENTRAR</button>
                    </form>

                    <p className="mt-7 text-left text-lg">Não possui uma conta? <Link className="text-[#6A38F3] font-semibold" href="/cadastro">Cadastre-se</Link></p>
                </div>
            </div>
        </main>
    );
}