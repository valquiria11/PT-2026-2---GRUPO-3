"use client";

export interface LojaProps {
  id: number;
  nome: string;
  categoria: string;
  logoUrl?: string;
}

export default function CartaoLoja({ nome, categoria, logoUrl }: LojaProps) {
  return (
    <div className="flex w-full max-w-[485px] items-center justify-between gap-4 rounded-[28px] bg-white p-7 shadow-sm">
      <div className="min-w-0">
        <h3 className="truncate text-4xl font-light text-[#171918]">{nome}</h3>
        <span className="text-3xl font-medium text-[#6A38F3]">{categoria}</span>
      </div>

      <img
        src={logoUrl || "/img.png"}
        alt={`Logo da loja ${nome}`}
        className="h-24 w-24 shrink-0 rounded-full border border-gray-100 object-cover"
      />
    </div>
  );
}