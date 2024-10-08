"use client"
import Link from 'next/link'
import { Home, RefreshCcw } from 'lucide-react'

import { Button } from '@/components/ui/button'

export default function NotFound() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="px-4 py-16 mx-auto text-center bg-white rounded-lg shadow-2xl sm:px-6 md:px-8 lg:px-10 w-full max-w-lg">
                <h1 className="mb-4 text-4xl font-bold text-red-600">404</h1>
                <p className="mb-8 text-3xl font-semibold text-gray-900">Oops! Página no encontrada</p>
                <div className="max-w-sm mx-auto mb-8 text-gray-600">
                    <p className="mb-4">Lo sentimos, no pudimos encontrar la página que estás buscando o hubo un error al cargar los datos.</p>
                    <p>Puede que el enlace esté roto o que la página haya sido eliminada.</p>
                </div>
                <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 justify-center">
                    <Button asChild>
                        <Link href="/home" className="inline-flex items-center">
                            <Home className="w-5 h-5 mr-2" />
                            Volver al inicio
                        </Link>
                    </Button>
                    <Button variant="outline" onClick={() => window.location.reload()}>
                        <RefreshCcw className="w-5 h-5 mr-2" />
                        Intentar de nuevo
                    </Button>
                </div>
            </div>
        </div>
    )
}