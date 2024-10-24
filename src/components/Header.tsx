'use client';
import React from 'react';
import { Button } from './ui/button';
import { useTheme } from 'next-themes';
import MobileSidebar from './MobileSidebar';
import { usePathname } from 'next/navigation';

function Header() {
  const { setTheme } = useTheme();
  const pathname = usePathname();

  const noHeaderRoutes = ['/dashboard', '/maplibre'];

  const handleToggle = () => {};

  if (noHeaderRoutes.includes(pathname)) {
    return (
      <header className="bg-white shadow-md sm:hidden">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center gap-4">
          <div className="flex items-center">
            <MobileSidebar />
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto"
            onClick={handleToggle}
          ></Button>
          <img
            alt="Logo SAF"
            src="https://gorev.moncosta.org/assets/images/logos/SAF_big.png"
            className="h-12 w-auto object-contain"
          />
          <img
            alt="Logo SAF"
            src="https://anid.cl/wp-content/uploads/2022/04/anid_rojo_azul.png"
            className="h-12 w-auto object-contain"
          />
          <img
            alt="Logo UFRO"
            src="imgs/logo_ufro.jpeg"
            className="h-12 w-auto object-contain"
          />
        </div>
      </header>
    );
  }

  return (
    <header className="bg-white shadow-md ">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center gap-4">
        <div className="flex items-center">
          <MobileSidebar />
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto"
          onClick={handleToggle}
        >
          {true ? (
            <span>🔊</span> // Ícono o contenido cuando está activo
          ) : (
            <span>🔇</span> // Ícono o contenido cuando está inactivo
          )}
        </Button>
        <img
          alt="Logo SAF"
          src="https://gorev.moncosta.org/assets/images/logos/SAF_big.png"
          className="h-12 w-auto object-contain"
        />
        <img
          alt="Logo SAF"
          src="https://anid.cl/wp-content/uploads/2022/04/anid_rojo_azul.png"
          className="h-12 w-auto object-contain"
        />
        <img
          alt="Logo UFRO"
          src="imgs/logo_ufro.jpeg"
          className="h-12 w-auto object-contain"
        />
      </div>
    </header>
  );
}

export default Header;
