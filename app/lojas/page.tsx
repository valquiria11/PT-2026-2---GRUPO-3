'use client'

import { useEffect, useState } from "react"
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import { Vegetables } from "@healthicons/react"
import { HugeiconsIcon } from "@hugeicons/react"
import { Medicine02Icon } from "@hugeicons/core-free-icons"
import { PiDress } from "react-icons/pi";
import { LuGamepad2 } from "react-icons/lu";
import { CiSearch, CiFilter } from "react-icons/ci";
import { Icon } from "@iconify/react"
import CIcon from "@coreui/icons-react";
import { cilLaptop, cilHome } from "@coreui/icons"
import DollIcon from "./../../public/categorias/DollIcon"
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";

type Lojas = {
    id: number;
    usuario_id: number;
    categoria_id: number;
    nome: string;
    descricao?: string | null;
    logo_url?: string | null;
    banner_url?: string | null;
    sticker_url?: string | null;
    createdAt: string;
    updatedAt?: string;
};

type Categorias = {
  id: number;
  nome: string;
  categoria_principal_id?: number | null;
  created_at: string;
  updated_at?: string;
};

const iconesCategorias: Record<string, React.ReactNode> = {
    "Eletrônicos": <CIcon icon={cilLaptop} />,
    "Farmácia": <HugeiconsIcon icon={Medicine02Icon} />,
    "Beleza": <Icon icon="streamline-ultimate:make-up-lipstick" />,
    "Moda": <PiDress />,
    "Mercado": <Vegetables />,
    "Jogos": <LuGamepad2 />,
    "Brinquedos": <DollIcon />,
    "Casa": <CIcon icon={cilHome} />,
};

export default function Lojas() {
    const [lojas, setLojas] = useState<Lojas[]>([]);
    const [categorias, setCategorias] = useState<Categorias[]>([]);
    const [busca, setBusca] = useState("");
    const [pagina, setPagina] = useState(1);

    //API
    useEffect(() => {
        fetchLojas();
        fetchCategorias();
    }, []);

    const fetchLojas = async () => {
        try {
            const res = await axios.get<Lojas[]>("/api/lojas");
            setLojas(res.data);
        } catch (error) {
            console.error("Erro ao buscar lojas:", error);
        }
    }
    
   const fetchCategorias = async () => {
        try {
            const res = await axios.get<Categorias[]>("/api/categorias");
            setCategorias(
                res.data.filter((categoria) => categoria.categoria_principal_id === null));
        } catch (error) {
            console.error("Erro ao buscar categorias:", error);
        }
    };

    //Filtro
    const [categoriaFiltro, setCategoriaFiltro] = useState<number[]>([]);
    const [filtroAberto, setFiltroAberto] = useState(false);
    const selecaoCategoria = (id: number) => {
        setCategoriaFiltro((anteriores) =>
            anteriores.includes(id) ? anteriores.filter((categoriaId) => categoriaId !== id) 
        : [...anteriores, id] );
    setPagina(1);
    };

    //Filtro + Busca
    const lojasFiltradas = lojas.filter((loja) => {
        const correspondeCategoria = categoriaFiltro.length === 0 || categoriaFiltro.includes(loja.categoria_id);
        const correspondeBusca = loja.nome.toLowerCase().includes(busca.toLowerCase());

    return correspondeCategoria && correspondeBusca;
    });

    //Paginação
    const totalPaginas = Math.ceil(lojasFiltradas.length / 15);
    const lojasPaginadas = lojasFiltradas.slice((pagina - 1) * 15, pagina * 15);
    


return(
    <main className="min-h-screen bg-[#F6F3E4]">
        {/*Categorias*/}
        <section className="relative bg-black w-full h-[358px] place-items-center">
            <div className="absolute w-full px-[110px] py-[80px] flex flex-col gap-10">
                <h2 className="text-3xl font-semibold text-[#F7F4E8]">Categoria</h2>

                {/*Scroll de categorias*/}
                <div className="overflow-x-auto scrollbar-none flex gap-[49px]">
                    {categorias.map((categoria) => (
                    <Link
                        key={categoria.id}
                        href={`/categoria/${categoria.id}`}
                        className="group bg-white rounded-4xl min-w-[115px] h-[115px] flex flex-col items-center justify-center cursor-pointer"
                       >
                        <span className="text-3xl text-[#6A38F3] group-hover:opacity-60 flex items-center justify-center [&_svg]:w-12 [&_svg]:h-12">{iconesCategorias[categoria.nome]}</span>
                        <span className="text-base font-semibold text-black group-hover:opacity-55">{categoria.nome}</span>
                        
                    </Link>
                    ))}
                </div>
            </div>
        </section>
        
        <section className="relative w-full px-30">
            {/*Busca*/}
            <div className="flex justify-end py-5">
                <div className="w-[604px] h-[39px] flex items-center rounded-full bg-white flex justify-between px-8">
                  <label className="sr-only" htmlFor="busca">
                    Procurar produtos
                  </label>
                  <input
                    id="busca"
                    name="busca"
                    type="text"
                    value={busca}
                    onChange={(e) => { setBusca(e.target.value); setPagina(1); }}
                    placeholder="Procurar por..."
                    className="w-[604px] text-[#6A38F3] outline-none placeholder:text-[#B9A5FA]"
                  />
                  <CiSearch size={25} color="6A38F3" className="opacity-80"/>
                </div>
            </div>
            
            {/*Lojas*/}
            <div className="flex items-center justify-between">
                <h1 className="text-black text-3xl font-semibold">Lojas</h1>
                {/*Filtros*/}
                <div className="relative z-50 w-[468px]">
                    <button
                        type="button"
                        onClick={() => setFiltroAberto(!filtroAberto)}
                        aria-expanded={filtroAberto}
                        aria-controls="menu-filtros"
                        className="w-full h-[44px] bg-white rounded-full px-5 flex items-center justify-between cursor-pointer text-xl text-[#6A38F3] opacity-80"
                    >
                        <span>Filtros {categoriaFiltro.length > 0 && ` (${categoriaFiltro.length})`}</span>
                        <CiFilter/>
                    </button>
                            
                    {filtroAberto && (
                        <div className="absolute w-[468px] top-full bg-white rounded-2xl shadow-lg p-5">
                            <div className="flex flex-col">
                                {categorias.map((categoria) => (
                                    <label
                                        key={categoria.id}
                                        className="flex items-center text-lg gap-2 cursor-pointer text-[#6A38F3] opacity-80 hover:opacity-50"
                                    >
                                        <input className="group w-4 h-4 accent-[#6A38F3] hover:accent-[#6A38F3] cursor-pointer"
                                            type="checkbox"
                                            checked={categoriaFiltro.includes(
                                                categoria.id
                                            )}
                                            onChange={() =>
                                                selecaoCategoria(categoria.id)
                                            }
                                        />
                                        <span>{categoria.nome}</span>
                                        <span className="text-[#6A38F3] flex items-center justify-center [&_svg]:w-5 [&_svg]:h-5">{iconesCategorias[categoria.nome]}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}
                    </div>
            </div>
            {/*Grid das lojas*/}
            <div className="grid items-center justify-center grid sm:grid-cols-3 lg:grid-cols-5 gap-6 py-10 px-10">
                {lojasPaginadas.map((loja) => (
                    <div key={loja.id} className="flex flex-col items-center min-w-0 p-5">
                        <div className="relative w-36 h-36 rounded-full overflow-hidden bg-white shadow-sm border border-gray-100 cursor-pointer hover:scale-105 transition-transform">
                            {loja.logo_url && (
                                <Image
                                  src={`http://localhost:3001${loja.logo_url}`}
                                  alt={loja.nome}
                                  fill
                                  className="object-cover"
                                />
                            )}
                        </div>
                        <span className="text-sm font-bold text-[#171918] mt-2 text-center capitalize cursor-pointer hover:underline">
                          {loja.nome}
                        </span>
                        <span className="text-xs text-[#6735E8] capitalize cursor-pointer hover:underline">
                          {categorias.find((categoria) => categoria.id === loja.categoria_id) ?.nome}
                        </span>
                    </div>
                ))}
            </div>
            {/*Paginação*/}
            <nav className="flex items-center justify-center gap-6 text-4xl leading-none text-black">
                <button 
                    type="button"
                    aria-label="Página anterior"
                    disabled={pagina === 1}
                    onClick={() => setPagina(pagina - 1)}
                    className="cursor-pointer disabled:cursor-blocked disabled:opacity-30"
                >
                <MdKeyboardArrowLeft size={60}/>
                </button>
                {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(
                    (numero) => (
                        <button
                            key={numero}
                            type="button"
                            onClick={() => setPagina(numero)}
                            className={`w-10 h-10 rounded-full cursor-pointer
                                ${pagina === numero? "font-bold text-black" : "text-black"} `}
                        >
                            {numero}
                        </button>
                    )
                )}
              <button
                type="button"
                aria-label="Próxima página"
                disabled={pagina === totalPaginas}
                onClick={() => setPagina(pagina + 1)}
                className="cursor-pointer disabled:cursor-default disabled:opacity-30"
              >
                <MdKeyboardArrowRight size={60}/>
              </button>
            </nav>
        </section>
    </main>
    )
}
