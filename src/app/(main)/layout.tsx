import { Metadata } from "next";
import Layout from "../../layout/layout";
import { ReactNode } from "react";

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return <Layout>{children}</Layout>;
}
