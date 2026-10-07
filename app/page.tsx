export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-5xl font-bold text-blue-600">
        CJR
      </h1>

      <p className="mt-4 text-xl text-gray-700">
        Bem-vindo ao sistema CJR.
      </p>

      <button className="mt-6 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700">
        Entrar
      </button>
    </main>
  );
}