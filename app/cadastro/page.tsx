import Image from "next/image";
export default function Cadastro() {
  return (
    <main className="min-h-screen bg-[#F7F4E8] flex">

      {/* form */}
      <section className="w-1/2 bg-[#171918] rounded-[30px] m-8 p-12 flex flex-col items-center mt-20">

        <h1 className="text-4xl font-bold text-[#F7F4E8] mb-10 mt-12">
          CRIE SUA CONTA
        </h1>

        <form>
            <input
            type="text"
            placeholder="Nome Completo"
            className="w-full rounded-full bg-[#F7F4E8] px-6 py-4 mb-4 text-gray-700"
            />

            <input
            type="text"
            placeholder="Username"
            className="w-full rounded-full bg-[#F7F4E8] px-6 py-4 mb-4 text-gray-700"
            />

            <input
            type="email"
            placeholder="Email"
            className="w-full rounded-full bg-[#F7F4E8] px-6 py-4 mb-4 text-gray-700"
            />

            <input
            type="password"
            placeholder="Senha"
            className="w-full rounded-full bg-[#F7F4E8] px-6 py-4 mb-4 text-gray-700"
            />

            <input
            type="password"
            placeholder="Confirmar Senha"
            className="w-full rounded-full bg-[#F7F4E8] px-6 py-4 mb-8 text-gray-700"
            />
        </form>

        <button className="w-full rounded-full bg-[#6735E8] py-4 text-xl font-bold text-white hover:bg-[#5626D4]">
          CRIAR CONTA
        </button>

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