import { Metadata } from 'next';
import AppConfig from '../../layout/AppConfig';
import {Fragment, ReactNode} from "react";

interface SimpleLayoutProps {
  children: ReactNode;
}

export const metadata: Metadata = {
  title: 'PrimeReact Sakai',
  description: 'The ultimate collection of design-agnostic, flexible and accessible React UI Components.'
};

export default function SimpleLayout({ children }: SimpleLayoutProps) {
  return (
    <Fragment>
      {children}

    </Fragment>
  );
}
