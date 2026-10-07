export default function Cadastro() {
  return (
    <main className="min-h-screen bg-[#F7F4E8] flex">

      <section className="w-1/2 bg-[#171918] rounded-[30px] m-8 p-12 flex flex-col items-center">
        
        <h1 className="text-2xl font-bold text-[#F7F4E8] mb-10">
            CRIE SUA CONTA
        </h1>

        <input
            type="text"
            placeholder="Nome Completo"
            className="w-full rounded-full bg-[#F7F4E8] px-6 py-2 mb-4 text-gray-700"
        />
        <input
            type="text"
            placeholder="Username"
            className="w-full rounded-full bg-[#F7F4E8] px-6 py-2 mb-4 text-gray-700"
        />
        <input
            type="text"
            placeholder="Email"
            className="w-full rounded-full bg-[#F7F4E8] px-6 py-2 mb-4 text-gray-700"
        />
        <input
            type="text"
            placeholder="Senha"
            className="w-full rounded-full bg-[#F7F4E8] px-6 py-2 mb-4 text-gray-700"
        />
        <input
            type="text"
            placeholder="Confirmar Senha"
            className="w-full rounded-full bg-[#F7F4E8] px-6 py-2 mb-4 text-gray-700"
        />

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

        <section className="w-1/2 flex flex-col items-center justify-center">
        <h2 className="text-4xl font-black text-black">
            STOCK.IO
        </h2>

        <p className="mt-10 text-xl">
            personagem
        </p>
        </section>

    </main>
  );
}