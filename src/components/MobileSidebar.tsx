import { Home, MapPinPlus, Menu, Settings } from 'lucide-react'

import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import Sidebar from './Sidebar'
import Link from 'next/link'
import { Button } from './ui/button'
import Image from 'next/image'

function MobileSidebar() {
  return (
    <Sheet>
      <SheetTrigger className="md:hidden pr-4 hover:opacity-75 transition">
        <Menu />
      </SheetTrigger>
      <SheetContent side="left" className="p-0 bg-white z-[1000]">
        <aside
          className={`${'md:w-64'} md:flex flex-col transition-all duration-300 ease-in-out bg-white text-primary-foreground `}
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

            <span className="text-xl font-bold">DESAFIO SAF</span>
          </div>
          <nav className="flex-1 space-y-2 pl-2">
            <Link href="/home">
              <Button variant="ghost" className="w-full justify-start mb-2">
                <Home className="mr-2" size={24} />
                <span>Home</span>
              </Button>
            </Link>
            <Link href="/incidente">
              <Button variant="ghost" className="w-full justify-start mb-2">
                <MapPinPlus className="mr-2" size={24} />
                <span>Registrar Incidente</span>
              </Button>
            </Link>
            <Button variant="ghost" className="w-full justify-start">
              <Settings className="mr-2" size={24} />
              <span>Reporte</span>
            </Button>
          </nav>
        </aside>
      </SheetContent>
    </Sheet>
  )
}

export default MobileSidebar
