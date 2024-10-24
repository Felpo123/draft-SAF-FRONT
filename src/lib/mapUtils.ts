import proj4 from 'proj4';
import * as turf from '@turf/turf';

export interface Geojson {
  type: string;
  features: Feature[];
}

export interface Feature {
  type: string;
  geometry: Geometry;
  properties: IncidentProperties;
}

export interface Geometry {
  type: string;
  coordinates: Array<number[] | number>;
}

export interface IncidentProperties {
  id: number;
  id_evento: string;
  superf: number;
  nom_reg: string;
  nom_pro: string;
  nom_com: string;
  cut_reg: string;
  cut_pro: string;
  cut_com: string;
  cu_evento: string;
  tipo_event: string;
  nom_event: string;
  date: string;
  estado: string;
  termino: null;
}

export const weatherInfo = [
  {
    id: 1,
    tempeture: 15,
    day: 'Lun',
    icon: '🌤️',
  },
  {
    id: 2,
    tempeture: 20,
    day: 'Mar',
    icon: '☀️',
  },
  {
    id: 3,
    tempeture: 9,
    day: 'Mie',
    icon: '🌧️',
  },
  {
    id: 4,
    tempeture: 8,
    day: 'Jue',
    icon: '☁️',
  },
];

export const extractDatesAndIds = (geojsonData: Geojson) => {
  const fechasUnicas: string[] = [];

  geojsonData.features.forEach((feature) => {
    const fecha = feature.properties.date;
    const idEvento = feature.properties.id_evento;

    if (fecha && !fechasUnicas.includes(fecha)) {
      fechasUnicas.push(fecha);
    }
  });

  return { fechasUnicas: fechasUnicas.sort() };
};

export const fetchIncidentGEOJSON = async (idEvent: string) => {
  const filter = `<Filter><PropertyIsEqualTo><PropertyName>id_evento</PropertyName><Literal>${idEvent}</Literal></PropertyIsEqualTo></Filter>`;
  const encodedFilter = encodeURIComponent(filter);
  const wfsUrl = `http://192.168.1.116:8080/geoserver/desafio/wfs?service=WFS&version=1.1.0&request=GetFeature&typeName=desafio:incidentes&outputFormat=application/json&filter=${encodedFilter}`;
  try {
    const response = await fetch(wfsUrl, {
      headers: {
        Authorization: 'Basic ' + btoa(`admin:geoserver`),
      },
    });
    if (!response.ok) {
      throw new Error(
        `Error en la respuesta del servidor: ${response.statusText}`
      );
    }

    const data = (await response.json()) as Geojson;

    return transformGeojson(data);
  } catch (error) {
    console.error('Error al obtener los datos WFS:', error);
  }
};

export const transformGeojson = (geojsonData: Geojson) => {
  if (geojsonData && geojsonData.features) {
    const transformedFeatures = geojsonData.features.map((feature) => {
      const geometry = feature.geometry;
      if (geometry.type === 'Polygon' || geometry.type === 'MultiPolygon') {
        const transformedCoordinates = geometry.coordinates.map((coords) => {
          return coords.map((coordArray) => {
            return coordArray.map((coord) => {
              const transformedCoord = proj4('EPSG:3857', 'EPSG:4326', [
                coord[0],
                coord[1],
              ]);
              return transformedCoord;
            });
          });
        });

        return {
          ...feature,
          geometry: {
            ...geometry,
            coordinates: transformedCoordinates,
          },
        };
      }
      return feature;
    });

    return {
      ...geojsonData,
      features: transformedFeatures,
    };
  }
  return geojsonData;
};

// Función para calcular el bounding box del círculo
export const calculateBoundingBox = (
  lng: number,
  lat: number,
  radiusInKm: number
): [number, number, number, number] => {
  const distanceX = radiusInKm / (111.32 * Math.cos((lat * Math.PI) / 180));
  const distanceY = radiusInKm / 110.574;

  const minLng = lng - distanceX;
  const maxLng = lng + distanceX;
  const minLat = lat - distanceY;
  const maxLat = lat + distanceY;

  return [minLng, minLat, maxLng, maxLat];
};

// Conversión de lat/lng a EPSG:3857
export const toEPSG3857 = (lng: number, lat: number): [number, number] => {
  const R_MAJOR = 6378137.0;
  const x = R_MAJOR * ((lng * Math.PI) / 180);
  const scale = x / lng;
  const y = R_MAJOR * Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360));
  return [x, y];
};

// Función para calcular el bounding box en EPSG:3857
export const calculateBoundingBox2 = (
  lng: number,
  lat: number,
  radiusInKm: number
) => {
  const distanceX = radiusInKm / (111.32 * Math.cos((lat * Math.PI) / 180));
  const distanceY = radiusInKm / 110.574;

  const minLng = lng - distanceX;
  const maxLng = lng + distanceX;
  const minLat = lat - distanceY;
  const maxLat = lat + distanceY;

  // Convertimos las coordenadas de lat/lng a EPSG:3857
  const [minX, minY] = toEPSG3857(minLng, minLat);
  const [maxX, maxY] = toEPSG3857(maxLng, maxLat);

  return [minX, minY, maxX, maxY];
};

export function agruparIncidentesPorEvento(incidentes: Feature[]): Feature[] {
  const incidentesAgrupados = {};

  incidentes.forEach((incidente) => {
    const idEvento = incidente.properties.id_evento;
    const superficie = incidente.properties.superf;

    if (!incidentesAgrupados[idEvento]) {
      // Crear un nuevo registro en el objeto agrupado si no existe
      incidentesAgrupados[idEvento] = {
        ...incidente,
        properties: { ...incidente.properties, superf: superficie },
      };
    } else {
      // Sumar la superficie afectada y redondear a 1 decimal
      incidentesAgrupados[idEvento].properties.superf =
        Math.round(
          (incidentesAgrupados[idEvento].properties.superf + superficie) * 10
        ) / 10;
    }
  });

  return Object.values(incidentesAgrupados);
}

export const extractDatesAndComunas = (geojsonData) => {
  const fechasUnicas = [];
  const provinciasUnicas = new Set();

  geojsonData.features.forEach((feature) => {
    const fecha = feature.properties.date;
    const provincia = feature.properties.nom_com; // Utilizamos nom_pro para la provincia

    if (fecha && !fechasUnicas.includes(fecha)) {
      fechasUnicas.push(fecha);
    }

    if (provincia) {
      provinciasUnicas.add(provincia);
    }
  });

  // Ordenar las fechas en orden descendente (más reciente primero)
  fechasUnicas.sort((a, b) => new Date(b) - new Date(a));

  return { fechasUnicas, provinciasUnicas: Array.from(provinciasUnicas) };
};

// Función para expandir el BBOX con un margen
export const expandBBox = (
  bbox: [number, number, number, number],
  marginFactor: number
): [number, number, number, number] => {
  const [minLon, minLat, maxLon, maxLat] = bbox;

  // Expande la latitud y longitud en ambos extremos
  const latMargin = (maxLat - minLat) * marginFactor;
  const lonMargin = (maxLon - minLon) * marginFactor;

  return [
    minLon - lonMargin, // Extiende el límite de longitud mínima
    minLat - latMargin, // Extiende el límite de latitud mínima
    maxLon + lonMargin, // Extiende el límite de longitud máxima
    maxLat + latMargin, // Extiende el límite de latitud máxima
  ];
};

// Obtener el centroide y la BBOX
export const getCentroidAndBBox = (geojson: any) => {
  // Calcula el centroide usando Turf.js
  const centroid = turf.centroid(geojson);

  // Coordenadas del centroide (asegúrate de que sean un array de [lon, lat])
  const centroidCoords: [number, number] = centroid.geometry.coordinates as [
    number,
    number,
  ];

  // Calcula el BBOX (Bounding Box) usando Turf.js
  let bbox = turf.bbox(geojson); // [minLon, minLat, maxLon, maxLat]

  // Expandir el BBOX con un margen adicional (por ejemplo, un 10%)
  bbox = expandBBox(bbox, 0.1); // 0.1 significa expandir en un 10%

  return { centroid: centroidCoords, bbox };
};
