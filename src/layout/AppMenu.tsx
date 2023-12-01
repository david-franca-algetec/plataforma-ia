/* eslint-disable @next/next/no-img-element */

import React from 'react';
import AppMenuitem from './AppMenuitem';
import {MenuProvider} from './context/menucontext';
import {AppMenuItem} from "@/types/layout";

const AppMenu = () => {

  const model: AppMenuItem[] = [
    {
      label: 'Revisor',
      items: [
        {label: 'Perguntas', icon: 'pi pi-fw pi-home', to: '/'},
        {label: 'Cadastro', icon: 'pi pi-fw pi-building', to: '/cadastro'},
      ]
    }
  ];

  return (
    <MenuProvider>
      <ul className="layout-menu">
        {model.map((item, i) => {
          return !item?.seperator ? <AppMenuitem item={item} root={true} index={i} key={item.label}/> :
            <li className="menu-separator"></li>;
        })}
      </ul>
    </MenuProvider>
  );
};

export default AppMenu;
