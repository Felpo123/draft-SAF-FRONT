'use client';
import {
  ChevronLeft,
  ChevronRight,
  Frame,
  Home,
  LayoutDashboard,
  MapPinPlus,
  Notebook,
  Settings,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react';
import { Button } from './ui/button';
import Image from 'next/image';

const ADMIN_ROUTES = [
  {
    name: 'Home',
    icon: Home,
    href: '/home',
  },
  {
    name: 'Registrar Incidente',
    icon: MapPinPlus,
    href: '/incidente',
  },
  {
    name: 'Reporte',
    icon: Notebook,
    href: '/reporte',
  },
  {
    name: 'Configuración',
    icon: Settings,
    href: '/settings',
  },
];

const USER_ROUTES = [
  {
    name: 'Home',
    icon: Home,
    href: '/home',
  },
  {
    name: 'Registrar Incidente',
    icon: MapPinPlus,
    href: '/incidente',
  },
  {
    name: 'Reporte',
    icon: Notebook,
    href: '/reporte',
  },
];

interface SidebarProps {
  isAdmin: boolean;
}

function Sidebar({ isAdmin }: SidebarProps) {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  const toggleSidebar = () => setSidebarExpanded(!sidebarExpanded);
  return (
    <aside
      className={`${
        sidebarExpanded ? 'md:w-64' : 'md:w-20'
      } md:flex flex-col transition-all duration-300 ease-in-out bg-white text-primary-foreground relative hidden shadow-md `}
    >
      <div className="flex items-center  space-x-2 p-4 ">
        <div className="w-16 h-16 bg-white flex items-center justify-center">
          <Image
            src="/imgs/logo.png"
            alt="DESAFIO SAF Logo"
            width={70}
            height={50}
          />
        </div>
        {sidebarExpanded && (
          <span className="text-xl font-bold">DESAFIO SAF</span>
        )}
      </div>
      {/* <nav className="flex-1 space-y-3 pl-2">
        <Link href="/home">
          <Button variant="ghost" className="w-full justify-start mb-2">
            <Home className="mr-2" size={24} />
            {sidebarExpanded && <span>Home</span>}
          </Button>
        </Link>
        <Link href="/incidente">
          <Button variant="ghost" className="w-full justify-start mb-2">
            <MapPinPlus className="mr-2" size={24} />
            {sidebarExpanded && <span>Registrar Incidente</span>}
          </Button>
        </Link>
        <Link href="/reporte">
          <Button variant="ghost" className="w-full justify-start">
            <Notebook className="mr-2" size={24} />
            {sidebarExpanded && <span>Reporte</span>}
          </Button>
        </Link>
        <Link href="/settings">
          <Button variant="ghost" className="w-full justify-start">
            <Settings className="mr-2" size={24} />
            {sidebarExpanded && <span>Configuración</span>}
          </Button>
        </Link>
      </nav> */}
      <nav className="flex-1 space-y-3 pl-2">
        {isAdmin
          ? ADMIN_ROUTES.map((route) => (
              <Link href={route.href} key={route.name}>
                <Button variant="ghost" className="w-full justify-start mb-2">
                  <route.icon className="mr-2" size={24} />
                  {sidebarExpanded && <span>{route.name}</span>}
                </Button>
              </Link>
            ))
          : USER_ROUTES.map((route) => (
              <Link href={route.href} key={route.name}>
                <Button variant="ghost" className="w-full justify-start mb-2">
                  <route.icon className="mr-2" size={24} />
                  {sidebarExpanded && <span>{route.name}</span>}
                </Button>
              </Link>
            ))}
      </nav>
      <div className="p-4 ">
        <div className="flex justify-center">
          <Button
            variant="outline"
            size="icon"
            onClick={toggleSidebar}
            className="rounded-full w-10 h-10 flex items-center justify-center bg-primary-foreground text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            {sidebarExpanded ? (
              <ChevronLeft className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
