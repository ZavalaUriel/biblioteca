import React from 'react';
import { Header } from './Header';
import './Layout.css';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="layout">
      <div className="stars-background" />
      <Header />
      <main className="layout-content">{children}</main>
    </div>
  );
};
