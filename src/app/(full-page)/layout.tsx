import { Metadata } from "next";
import { Fragment, ReactNode } from "react";

interface SimpleLayoutProps {
  children: ReactNode;
}

export const metadata: Metadata = {
  title: "Projeto de Extensão",
  description: "Projeto de Extensão",
};

export default function SimpleLayout({ children }: SimpleLayoutProps) {
  return <Fragment>{children}</Fragment>;
}
