"use client";

import { useRef, useState, useEffect, ReactNode } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";

interface RolagemProps {
  children: ReactNode;
  className?: string;
}

export default function RolagemHorizontal({ children, className = "" }: RolagemProps) {
  const carrosselRef = useRef<HTMLDivElement>(null);
  const [podeRolarEsquerda, setPodeRolarEsquerda] = useState(false);
  const [podeRolarDireita, setPodeRolarDireita] = useState(false);

  const verificarRolagem = () => {
    const el = carrosselRef.current;
    if (!el) return;


    const noInicio = el.scrollLeft <= 2;
    const noFim = Math.ceil(el.scrollLeft + el.clientWidth) >= el.scrollWidth - 2;

    setPodeRolarEsquerda(!noInicio);
    setPodeRolarDireita(!noFim);
  };

  useEffect(() => {
    verificarRolagem();
    window.addEventListener("resize", verificarRolagem);
    return () => window.removeEventListener("resize", verificarRolagem);
  }, [children]);

  const rolar = (direcao: "esquerda" | "direita") => {
    if (!carrosselRef.current) return;
    const distancia = direcao === "direita" ? 350 : -350;
    carrosselRef.current.scrollBy({
      left: distancia,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative flex items-center">
      {/* seta esquerda */}
      {podeRolarEsquerda && (
        <button
          onClick={() => rolar("esquerda")}
          aria-label="Itens anteriores"
          className="absolute left-0 z-20 bg-white/95 hover:bg-[#6735E8] text-[#171918] hover:text-white p-3 rounded-full shadow-lg border border-gray-100 transition-all cursor-pointer flex items-center justify-center"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      <div
        ref={carrosselRef}
        onScroll={verificarRolagem}
        className={`flex overflow-x-auto scrollbar-none -mr-6 pr-12 w-full scroll-smooth ${className}`}
      >
        {children}
      </div>

      {/* seta direita */}
      {podeRolarDireita && (
        <button
          onClick={() => rolar("direita")}
          aria-label="Próximos itens"
          className="absolute right-0 z-20 bg-white/95 hover:bg-[#6735E8] text-[#171918] hover:text-white p-3 rounded-full shadow-lg border border-gray-100 transition-all cursor-pointer flex items-center justify-center"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}