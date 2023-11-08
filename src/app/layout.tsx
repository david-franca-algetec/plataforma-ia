import type { Metadata } from "next";

import "primereact/resources/primereact.css";
import "primeflex/primeflex.css";
import "primeicons/primeicons.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";

import { PrimeReactProvider } from "primereact/api";
import {ReactNode} from "react";

export const metadata: Metadata = {
  title: "Revisor de Respostas",
  description: "Revisor de Respostas",
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <PrimeReactProvider>
         {children}
        </PrimeReactProvider>
      </body>
    </html>
  );
}
