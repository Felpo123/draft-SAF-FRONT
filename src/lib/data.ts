import { Geojson } from './mapUtils';

export type Incident = {
  id: string;
  nombre: string;
  estado: string;
  zona: 'Continental' | 'Insular' | 'Antartica';
  origen: 'Natural' | 'Sin informacion' | 'Antropico' | 'Biologico';
  tipo:
    | 'Incendios'
    | 'Inundaciones'
    | 'Remociones en masa'
    | 'Terremotos'
    | 'Tsunamis';
  region: string;
  provincia: string;
  comuna: string;
  ciudad: string;
  coordenada: { lat: number; lng: number };
  ultima_actualizacion: string;
};

export const incidentsData = [
  {
    id: '08428085-84a2-43f4-849f-2bafe4664a4a',
    nombre: 'Valparaiso 2014',
    estado: 'Activo',
    zona: 'Continental',
    origen: 'Antrópico',
    tipo: 'Incendios',
    region: 'Región de Valparaíso',
    provincia: 'Valparaíso',
    comuna: 'Valparaíso',
    ciudad: 'Sin Información',
    coordenada: { lat: -33.0871, lng: -71.631 },
    ultima_actualizacion: '2014-04-26',
  },
  {
    id: '89c54e11-5b92-4f6f-a275-6655a411b648',
    nombre: 'Lonquimay 2024',
    estado: 'Activo',
    zona: 'Continental',
    origen: 'Antrópico',
    tipo: 'Incendios',
    region: 'Región de la Araucanía',
    provincia: 'Malleco',
    comuna: 'Casablanca',
    ciudad: 'Sin Información',
    coordenada: { lat: -38.611, lng: -71.3971 },
    ultima_actualizacion: '2024-02-07',
  },
  {
    id: '8f66abb5-87ca-4443-92df-6a0b31c34bc2',
    nombre: 'Valparaiso 2024',
    estado: 'Inactivo',
    zona: 'Continental',
    origen: 'Antrópico',
    tipo: 'Incendios',
    region: 'Región de Valparaíso',
    provincia: 'Valparaíso',
    comuna: 'Valparaíso',
    ciudad: 'Sin Información',
    coordenada: { lat: -33.067, lng: -71.4523 },
    ultima_actualizacion: '2024-02-28',
  },
  {
    id: 'e8abd2d6-6157-41af-9b2f-8de0bc79ead2',
    nombre: 'Santiago 2022',
    estado: 'Activo',
    zona: 'Metropolitana',
    origen: 'Antrópico',
    tipo: 'Incendios',
    region: 'Región Metropolitana de Santiago',
    provincia: 'Santiago',
    comuna: 'Santiago',
    ciudad: 'Santiago',
    coordenada: { lat: -33.4569, lng: -70.6483 },
    ultima_actualizacion: '2022-11-15',
  },
  {
    id: 'c61cf77b-8bd9-4ed3-ad6d-db0cf346f7be',
    nombre: 'Concepción 2023',
    estado: 'Inactivo',
    zona: 'Continental',
    origen: 'Natural',
    tipo: 'Inundaciones',
    region: 'Región del Biobío',
    provincia: 'Concepción',
    comuna: 'Concepción',
    ciudad: 'Concepción',
    coordenada: { lat: -36.827, lng: -73.0503 },
    ultima_actualizacion: '2023-05-10',
  },
  {
    id: '1d372611-e7b9-451a-bf8b-499a61d7cba7',
    nombre: 'Puerto Montt 2021',
    estado: 'Activo',
    zona: 'Insular',
    origen: 'Natural',
    tipo: 'Erupciones Volcánicas',
    region: 'Región de Los Lagos',
    provincia: 'Llanquihue',
    comuna: 'Puerto Montt',
    ciudad: 'Puerto Montt',
    coordenada: { lat: -41.4717, lng: -72.9365 },
    ultima_actualizacion: '2021-06-30',
  },
  {
    id: 'd1f2f7a6-9c28-4c12-9e37-9f8e2e49f153',
    nombre: 'Antofagasta 2023',
    estado: 'Inactivo',
    zona: 'Continental',
    origen: 'Natural',
    tipo: 'Inundaciones',
    region: 'Región de Antofagasta',
    provincia: 'Antofagasta',
    comuna: 'Antofagasta',
    ciudad: 'Antofagasta',
    coordenada: { lat: -23.65, lng: -70.4 },
    ultima_actualizacion: '2023-07-18',
  },
  {
    id: 'f4bc40f2-10f4-4eb2-a49d-c4ebf023f3a9',
    nombre: 'Arica 2022',
    estado: 'Activo',
    zona: 'Continental',
    origen: 'Antrópico',
    tipo: 'Incendios',
    region: 'Región de Arica y Parinacota',
    provincia: 'Arica',
    comuna: 'Arica',
    ciudad: 'Arica',
    coordenada: { lat: -18.4783, lng: -70.3126 },
    ultima_actualizacion: '2022-01-15',
  },
  {
    id: '3f39e88d-bb69-4d2d-a163-9d83971d9f14',
    nombre: 'Coquimbo 2023',
    estado: 'Activo',
    zona: 'Continental',
    origen: 'Natural',
    tipo: 'Sismos',
    region: 'Región de Coquimbo',
    provincia: 'Elqui',
    comuna: 'Coquimbo',
    ciudad: 'Coquimbo',
    coordenada: { lat: -29.9533, lng: -71.3377 },
    ultima_actualizacion: '2023-08-04',
  },
  {
    id: '69dc14bc-9155-49cf-8c11-fbe20414c69e',
    nombre: 'La Serena 2022',
    estado: 'Inactivo',
    zona: 'Continental',
    origen: 'Natural',
    tipo: 'Sismos',
    region: 'Región de Coquimbo',
    provincia: 'Elqui',
    comuna: 'La Serena',
    ciudad: 'La Serena',
    coordenada: { lat: -29.9078, lng: -71.254 },
    ultima_actualizacion: '2022-12-12',
  },
  {
    id: 'b5d7b4f2-c489-4b3f-99fe-5501a0a70ef4',
    nombre: 'Chillán 2021',
    estado: 'Activo',
    zona: 'Continental',
    origen: 'Natural',
    tipo: 'Erupciones Volcánicas',
    region: 'Región de Ñuble',
    provincia: 'Diguillín',
    comuna: 'Chillán',
    ciudad: 'Chillán',
    coordenada: { lat: -36.6068, lng: -72.1025 },
    ultima_actualizacion: '2021-03-25',
  },
] as Incident[];

export const geojsonData: Geojson = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-72.645233, -38.737078],
            [-72.641389, -38.739934],
            [-72.638854, -38.735764],
            [-72.642167, -38.733119],
            [-72.645233, -38.737078],
          ],
        ],
      },
      properties: {
        id: 1,
        id_evento: 'INC-12345',
        superf: 120.5,
        nom_reg: 'La Araucanía',
        nom_pro: 'Cautín',
        nom_com: 'Temuco',
        cut_reg: '09',
        cut_pro: '091',
        cut_com: '09101',
        cu_evento: '01',
        tipo_event: 'Incendio Forestal',
        nom_event: 'Incendio en Temuco',
        date: '2024-10-22T14:30:00Z',
        estado: 'Activo',
        termino: null,
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [-70.64827, -33.45694],
      },
      properties: {
        id: 2,
        id_evento: 'TER-67890',
        superf: 0,
        nom_reg: 'Metropolitana',
        nom_pro: 'Santiago',
        nom_com: 'Santiago',
        cut_reg: '13',
        cut_pro: '131',
        cut_com: '13101',
        cu_evento: '02',
        tipo_event: 'Terremoto',
        nom_event: 'Terremoto en Santiago',
        date: '2024-09-15T03:25:00Z',
        estado: 'Finalizado',
        termino: '2024-09-15T04:00:00Z',
      },
    },
  ],
};
