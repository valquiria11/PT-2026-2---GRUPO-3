import Link from "next/link";
import Image from "next/image";

export default function Login() {
    return (
        <main className="min-h-screen flex flex-col lg:flex-row bg-[#f5f5e8]">
            <div className="bg-[#f5f5e8] text-black w-full lg:w-1/2 lg:min-h-screen flex flex-col items-center justify-between overflow-hidden px-6 pt-10 lg:pt-14">
                <Image src="/img_1.png" alt="Logo Stock.io" width={842} height={444} className="w-full max-w-md h-auto" priority />
                <Image
                    src="/img.png"
                    alt="Mascote do Stock.io segurando uma caixa"
                    width={940}
                    height={2048}
                    className="w-auto h-64 sm:h-80 lg:h-[72vh] mt-8 object-contain object-bottom"
                    priority
                />
            </div>

            <div className="w-full lg:w-1/2 lg:min-h-screen bg-[#151917] text-[#f5f5e8] px-6 py-12 sm:px-10 lg:px-12 flex flex-col justify-center">
                <div className="w-full max-w-xl mx-auto">
                    <h1 className="text-center font-black text-3xl sm:text-4xl uppercase mb-10">Bem-vindo de volta!</h1>

                    <form>
                        <label className="sr-only" htmlFor="email">Email</label>
                        <input className="rounded-full px-7 py-3 bg-[#f5f5e8] block w-full text-black placeholder:text-zinc-500" id="email" name="email" type="email" placeholder="Email" required />

                        <label className="sr-only" htmlFor="senha">Senha</label>
                        <input className="rounded-full px-7 py-3 bg-[#f5f5e8] block mt-7 w-full text-black placeholder:text-zinc-500" id="senha" name="senha" type="password" placeholder="Senha" required />

                        <p className="mt-5 text-center underline">Esqueceu sua senha?</p>

                        <button className="bg-purple-600 rounded-full py-3 font-bold text-lg mt-8 block w-full" type="button">ENTRAR</button>
                    </form>

                    <p className="mt-7 text-center text-lg">Não possui uma conta? <Link className="text-purple-600 font-semibold" href="/cadastro">Cadastre-se</Link></p>
                </div>
            </div>
        </main>
    );
}
