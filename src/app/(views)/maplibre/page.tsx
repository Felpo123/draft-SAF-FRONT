// pages/index.tsx
"use client";
import dynamic from 'next/dynamic';

// Cargar el componente dinámicamente deshabilitando SSR
const DynamicMap = dynamic(() => import('./componentes/LayerisMapLibre'), { ssr: false });

export default DynamicMap;