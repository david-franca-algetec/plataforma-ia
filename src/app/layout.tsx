import type { Metadata } from "next";
import "primereact/resources/primereact.css";
import "primeflex/primeflex.css";
import "primeicons/primeicons.css";
import "../styles/layout/layout.scss";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import { ReactNode } from "react";
import { Providers } from "@/providers/providers";

export const metadata: Metadata = {
  title: "Projeto de Extensão",
  description: "Projeto de Extensão",
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          id="theme-css"
          href={`/themes/lara-light-indigo/theme.css`}
          rel="stylesheet"
        ></link>
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
