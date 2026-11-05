'use client'

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

type  Produtos = {
  id: number;
  loja_id: number;
  categoria_id: number;
  nome: string;
  descricao?: string | null;
  preco: number;
  stock: number;
  createdAt: string;
  updatedAt?: string;
}

const produtos: Produtos[] = [
  {
    id: 1,
    nome: "Comp. Lenovo",
    loja_id: 1,
    categoria_id: 1,
    preco: 3200,
    stock: 10,
    createdAt: "2023-01-01T00:00:00Z",
  },
  {
    id: 2,
    nome: "Comp. Samsung",
    loja_id: 1,
    categoria_id: 1,
    preco: 4500,
    stock: 5,
    createdAt: "2023-01-01T00:00:00Z",
  },
  {
    id: 3,
    nome: "iPhone 15",
    loja_id: 1,
    categoria_id: 1,
    preco: 3900,
    stock: 8,
    createdAt: "2023-01-01T00:00:00Z",
  },
  {
    id: 4,
    nome: "Smart TV Philips",
    loja_id: 1,
    categoria_id: 1,
    preco: 2800,
    stock: 15,
    createdAt: "2023-01-01T00:00:00Z",
  },
  {
    id: 5,
    nome: "Xbox Series X",
    loja_id: 1,
    categoria_id: 1,
    preco: 4200,
    stock: 5,
    createdAt: "2023-01-01T00:00:00Z",
  },
];

type Categorias = {
  id: number;
  nome: string;
  categoria_principal_id?: number | null;
  created_at: string;
  updated_at?: string;
};

const categorias: Categorias[] = [
  {
    id: 1,
    nome: "Eletrônicos",
    categoria_principal_id: null,
    created_at: "2023-01-01T00:00:00Z",
  },
  {
    id: 2,
    nome: "Celulares",
    categoria_principal_id: 1,
    created_at: "2023-01-01T00:00:00Z",
  },
  {
    id: 3,
    nome: "Notebooks",
    categoria_principal_id: 1,
    created_at: "2023-01-01T00:00:00Z",
  },
  {
    id: 4,
    nome: "TVs",
    categoria_principal_id: 1,
    created_at: "2023-01-01T00:00:00Z",
  },
  {
    id: 5,
    nome: "Acessórios",
    categoria_principal_id: 1,
    created_at: "2023-01-01T00:00:00Z",
  },
];

export default function CategoriaPage() {
    const [categorias, setCategorias] = useState<Categorias[]>([]);
    const [sort, setSort] = useState<string>("default");
    const [search, setSearch] = useState("");

    return (
      <main className="min-h-screen bg-black">
        <header>
            <nav>
            </nav>
        </header>
        </main>
    );
}
