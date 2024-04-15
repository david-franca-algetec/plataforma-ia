"use client";

import { Button } from "primereact/button";
import { DataView } from "primereact/dataview";
import { Rating } from "primereact/rating";
import React from "react";

import { Create } from "@/components/Create";
import { Evaluate } from "@/components/Evaluate";

interface Product {
  id: string;
  code: string;
  title: string;
  description: string;
  image: string;
  price: number;
  category: string;
  quantity: number;
  inventoryStatus: string;
  rating: number;
}

function Page() {
  const products: Product[] = [
    {
      id: "1000",
      code: "f230fh0g3",
      title:
        "Desenvolvimento de um Sistema de Gestão de Bibliotecas Usando Java e MySQL",
      description: "Product Description",
      image: "bamboo-watch.jpg",
      price: 65,
      category: "Accessories",
      quantity: 24,
      inventoryStatus: "INSTOCK",
      rating: 5,
    },
    {
      id: "1001",
      code: "nvklal433",
      title: "Análise Comparativa de Algoritmos de Ordenação em Java",
      description: "Product Description",
      image: "black-watch.jpg",
      price: 72,
      category: "Accessories",
      quantity: 61,
      inventoryStatus: "INSTOCK",
      rating: 4,
    },
    {
      id: "1002",
      code: "zz21cz3c1",
      title:
        "Implementação de um Simulador de Escalonamento de Processos em Java",
      description: "Product Description",
      image: "blue-band.jpg",
      price: 79,
      category: "Fitness",
      quantity: 2,
      inventoryStatus: "LOWSTOCK",
      rating: 3,
    },
    {
      id: "1003",
      code: "244wgerg2",
      title:
        "Aplicações de Inteligência Artificial em Java para Análise de Sentimentos",
      description: "Product Description",
      image: "blue-t-shirt.jpg",
      price: 29,
      category: "Clothing",
      quantity: 25,
      inventoryStatus: "INSTOCK",
      rating: 5,
    },
    {
      id: "1004",
      code: "h456wer53",
      title:
        "Desenvolvimento de uma Aplicação de Realidade Aumentada Usando Java e ARCore",
      description: "Product Description",
      image: "bracelet.jpg",
      price: 15,
      category: "Accessories",
      quantity: 73,
      inventoryStatus: "INSTOCK",
      rating: 4,
    },
    {
      id: "1005",
      code: "av2231fwg",
      title:
        "Estudo de Caso: Performance de Coleções em Java em Aplicações de Grande Escala",
      description: "Product Description",
      image: "brown-purse.jpg",
      price: 120,
      category: "Accessories",
      quantity: 0,
      inventoryStatus: "OUTOFSTOCK",
      rating: 4,
    },
    {
      id: "1006",
      code: "bib36pfvm",
      title: "Construção de um Framework MVC para Aplicações Web em Java",
      description: "Product Description",
      image: "chakra-bracelet.jpg",
      price: 32,
      category: "Accessories",
      quantity: 5,
      inventoryStatus: "LOWSTOCK",
      rating: 3,
    },
    {
      id: "1007",
      code: "mbvjkgip5",
      title: "Uso de Java para Desenvolvimento de Algoritmos de Criptografia",
      description: "Product Description",
      image: "galaxy-earrings.jpg",
      price: 34,
      category: "Accessories",
      quantity: 23,
      inventoryStatus: "INSTOCK",
      rating: 5,
    },
    {
      id: "1008",
      code: "vbb124btr",
      title:
        "Implementação de Técnicas de Machine Learning com Java para Reconhecimento de Padrões",
      description: "Product Description",
      image: "game-controller.jpg",
      price: 99,
      category: "Electronics",
      quantity: 2,
      inventoryStatus: "LOWSTOCK",
      rating: 4,
    },
    {
      id: "1009",
      code: "cm230f032",
      title: "Java e IoT: Desenvolvendo Aplicações para Smart Homes",
      description: "Product Description",
      image: "gaming-set.jpg",
      price: 299,
      category: "Electronics",
      quantity: 63,
      inventoryStatus: "INSTOCK",
      rating: 3,
    },
  ];

  const dataviewListItem = (data: Product) => {
    return (
      <div className="col-12">
        <div className="flex flex-column md:flex-row align-items-center p-3 w-full">
          <Button
            icon="pi pi-check-circle"
            label="Avaliar"
            severity="success"
            size="small"
            className="mb-2"
          />
          <div className="flex-1 flex flex-column align-items-center text-center px-4">
            <div className="font-bold text-2xl">{data.title}</div>
          </div>
          <div className="flex flex-row md:flex-column justify-content-between w-full md:w-auto align-items-center md:align-items-end mt-5 md:mt-0">
            <Button
              icon="pi pi-pencil"
              label="Editar"
              severity="info"
              size="small"
              className="mb-2"
            />
            <Button
              icon="pi pi-trash"
              label="Apagar"
              severity="danger"
              size="small"
              className="mb-2"
            />
          </div>
        </div>
      </div>
    );
  };

  const dataviewGridItem = (data: Product) => {
    return (
      <div className="col-12 lg:col-4">
        <div className="card m-3 border-1 surface-border">
          <div className="flex flex-wrap gap-2 align-items-center justify-content-between mb-2">
            <div className="flex align-items-center">
              <i className="pi pi-tag mr-2" />
              <span className="font-semibold">{data.category}</span>
            </div>
            <span
              className={`product-badge status-${data.inventoryStatus?.toLowerCase()}`}
            >
              {data.inventoryStatus}
            </span>
          </div>
          <div className="flex flex-column align-items-center text-center mb-3">
            <img
              src={`/demo/images/product/${data.image}`}
              alt={data.title}
              className="w-9 shadow-2 my-3 mx-0"
            />
            <div className="text-2xl font-bold">{data.title}</div>
            <div className="mb-3">{data.description}</div>
            <Rating value={data.rating} readOnly cancel={false} />
          </div>
          <div className="flex align-items-center justify-content-between">
            <span className="text-2xl font-semibold">${data.price}</span>
            <Button
              icon="pi pi-shopping-cart"
              disabled={data.inventoryStatus === "OUTOFSTOCK"}
            />
          </div>
        </div>
      </div>
    );
  };

  const itemTemplate = (
    data: Product,
    layout: "grid" | "list" | (string & Record<string, unknown>)
  ) => {
    if (!data) {
      return;
    }

    if (layout === "list") {
      return dataviewListItem(data);
    } else if (layout === "grid") {
      return dataviewGridItem(data);
    }
  };

  return (
    <div className="grid">
      <div className="col-12">
        <div className="card">
          <Create />
        </div>
        <div className="card">
          <DataView
            value={products}
            layout="list"
            paginator
            rows={5}
            itemTemplate={itemTemplate}
          />
        </div>
        <div className="card">
          <Evaluate />
        </div>
      </div>
    </div>
  );
}

export default Page;
