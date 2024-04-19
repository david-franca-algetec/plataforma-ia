"use client";

import {PropsWithChildren} from "react";
import {addLocale, locale, PrimeReactProvider} from "primereact/api";
import {LayoutProvider} from "@/layout/context/layoutcontext";

import language from "../locale/pt.json";
import {HomeworkStoreProvider} from "@/providers/homework-provider";

addLocale("pt", language.pt);

locale("pt");

export function Providers({ children }: PropsWithChildren) {
  return (
    <PrimeReactProvider>
      <HomeworkStoreProvider>
      <LayoutProvider>{children}</LayoutProvider>
      </HomeworkStoreProvider>
    </PrimeReactProvider>
  );
}
