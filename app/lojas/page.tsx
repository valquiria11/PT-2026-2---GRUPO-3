'use client'

import { useState } from "react"
import Link from "next/link";
import { Vegetables } from "@healthicons/react"
import { HugeiconsIcon } from "@hugeicons/react"
import { Medicine02Icon } from "@hugeicons/core-free-icons"
import { PiDress } from "react-icons/pi";
import { LuGamepad2 } from "react-icons/lu";
import { Icon } from "@iconify/react"
import CIcon from "@coreui/icons-react";
import { cilLaptop, cilHome } from "@coreui/icons"
import DollIcon from "./../../public/categorias/DollIcon"
import icon from "lucide-react/icons/";

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

const Categorias = [
  { id: 1, nome: "Mercado", icone: <Vegetables size={51}/> },
  { id: 2, nome: "Farmácia", icone: <HugeiconsIcon icon={Medicine02Icon} size={43}/> },
  { id: 3, nome: "Beleza", icone: <Icon icon="streamline-ultimate:make-up-lipstick" width={42}/>},
  { id: 4, nome: "Moda", icone: <PiDress size={45}/> },
  { id: 5, nome: "Eletrônicos", icone: <CIcon icon={cilLaptop} style={{ width: '51px', height: '51px'}}/>},
  { id: 6, nome: "Jogos", icone: <LuGamepad2 size={44}/> },
  { id: 7, nome: "Brinquedos", icone: <DollIcon className="w-[60px] h-[50px]"/> },
  { id: 8, nome: "Casa", icone: <CIcon icon={cilHome} style={{ width: '51px', height: '51px'}}/>  },
];

const itens_pag = 15

export default function Lojas() {
    const [lojas, setLojas] = useState<Lojas[]>();
    const [busca, SetBusca] = useState("");

    return(
        <main className="min-h-screen bg-[#F6F3E4]">
            {/*categorias*/}
            <section className="relative bg-black w-full h-[358px] place-items-center">
                <div className="absolute w-full px-[110px] py-[80px] flex flex-col gap-10">
                    <h2 className="text-3xl font-semibold text-[#F7F4E8]">Categoria</h2>
                    {/*Scroll de categorias*/}
                    <div className="overflow-x-auto scrollbar-none flex gap-[49px]">
                        {Categorias.map((cat) => (
                        <Link
                            key={cat.id}
                            href={`/categoria/${cat.id}`}
                            className="group bg-white rounded-4xl min-w-[115px] h-[115px] flex flex-col items-center justify-center cursor-pointer"
                           >
                            <span className="text-3xl text-[#6A38F3] group-hover:opacity-65 flex items-center justify-center">{cat.icone}</span>
                            <span className="text-base font-semibold text-black group-hover:opacity-50">{cat.nome}</span>
                            
                        </Link>
                        ))}
                    </div>
                </div>
            </section>

        </main>
    )
}