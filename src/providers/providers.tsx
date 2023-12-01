"use client";

import { PropsWithChildren } from "react";
import { addLocale, locale, PrimeReactProvider } from "primereact/api";
import { LayoutProvider } from "@/layout/context/layoutcontext";

import language from "../locale/pt.json";
import { makeServer } from "@/server/miraje";

addLocale("pt", language.pt);

locale("pt");

// const environment = process.env.NODE_ENV;

// if (environment !== "production") {
//   makeServer({ environment });
// }

export function Providers({ children }: PropsWithChildren) {
  return (
    <PrimeReactProvider>
      <LayoutProvider>{children}</LayoutProvider>
    </PrimeReactProvider>
  );
}
