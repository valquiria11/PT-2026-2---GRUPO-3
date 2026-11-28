"use client";

export interface AvaliacaoProps {
  id: number;
  autorNome: string;
  autorFotoUrl?: string | null;
  nota: number; // 1 a 5
  comentario: string;
}

export default function CartaoAvaliacao({
  autorNome,
  autorFotoUrl,
  nota,
  comentario,
}: AvaliacaoProps) {
  return (
    <div className="flex w-full max-w-[745px] gap-5 rounded-[28px] bg-white p-6 shadow-sm">
      <img
        src={autorFotoUrl || "/img.png"}
        alt={`Foto de ${autorNome}`}
        className="h-28 w-28 shrink-0 rounded-full object-cover"
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-xl font-semibold text-[#171918]">{autorNome}</h3>
          <span
            className="whitespace-nowrap text-2xl tracking-wider text-[#FFE44D]"
            aria-label={`Nota ${nota} de 5`}
          >
            {"★".repeat(nota)}
            <span className="text-gray-200">{"★".repeat(5 - nota)}</span>
          </span>
        </div>

        <p className="mt-1 text-[#252525]">{comentario}</p>

        <button
          type="button"
          className="mt-auto self-end text-lg text-[#6A38F3] hover:underline"
        >
          ver mais
        </button>
      </div>
    </div>
  );
}