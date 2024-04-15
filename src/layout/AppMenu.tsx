/* eslint-disable @next/next/no-img-element */

import React from "react";
import AppMenuitem from "./AppMenuitem";
import { MenuProvider } from "./context/menucontext";
import { AppMenuItem } from "@/types/layout";

const AppMenu = () => {
  const model: AppMenuItem[] = [
    {
      label: "Revisor",
      items: [
        { label: "Início", icon: "pi pi-fw pi-home", to: "/" },
        { label: "Cadastro", icon: "pi pi-fw pi-building", to: "/cadastro" },
        { label: "Avaliar", icon: "pi pi-fw pi-check", to: "/evaluate" },
        { label: "Documentos", icon: "pi pi-fw pi-check", to: "/docs" },
      ],
    },
  ];

  return (
    <MenuProvider>
      <ul className="layout-menu">
        {model.map((item, i) => {
          return !item?.seperator ? (
            <AppMenuitem item={item} root={true} index={i} key={item.label} />
          ) : (
            <li className="menu-separator"></li>
          );
        })}
      </ul>
    </MenuProvider>
  );
};

export default AppMenu;
