'use client'
import 'maplibre-gl/dist/maplibre-gl.css'
import maplibregl, { GeoJSONSource, Map } from 'maplibre-gl';
import { Source, Layer, Popup, ScaleControl } from 'react-map-gl/maplibre'
import React, { useEffect, useRef, useState } from 'react'
import InfraestructureCard from './InfraestructureCard'
import GraphsCard from './GraphsCard'
import MapBar from './MapBar'
import WeatherCard from './WeatherCard'
import Timeline from './TimelineMapBar'
import { calculateBoundingBox, calculateBoundingBox2, extractDatesAndIds, Geojson } from '@/lib/mapUtils';
import { set } from 'zod';
import { features } from 'process';
import { LayersIcon, MapPin } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Feature, Polygon, GeoJsonProperties } from 'geojson';
import RulerControl from '@mapbox-controls/ruler';
import '@mapbox-controls/ruler/src/index.css';
import '@mapbox-controls/compass/src/index.css';
import TooltipControl from '@mapbox-controls/tooltip';
import '@mapbox-controls/tooltip/src/index.css'
import * as turf from '@turf/turf';
import proj4 from 'proj4';

const epsg4326 = 'EPSG:4326'; // Sistema geográfico (lon, lat)
const epsg3857 = 'EPSG:3857'; // Web Mercator
export type Section = 'infrastructure' | 'graphs' | 'resources' | 'satellite';

interface LayerisMapLibreProps {
  nameEvent?: string
  idEvent?: string
  geoJson: Geojson
}
export type ControlOptions = {
  instant?: false;
};

const LayerisMapLibre = ({ nameEvent, idEvent, geoJson }: LayerisMapLibreProps) => {
  // Estado inicializado con un bbox predeterminado
  
  type CircleType = Feature<Polygon, GeoJsonProperties> | null;


  const [circle, setCircle] = useState<CircleType>(null);
  const [centroidse, setCentroidse] = useState([]);
  const [maxDistance, setMaxDistance] = useState(0);  // BBox para el mapa completo (todo el mundo)
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<Map | null>(null);
  const dates = extractDatesAndIds(geoJson).fechasUnicas;
  const [currentIndex, setCurrentIndex] = useState(dates[dates.length - 1]); // Índice de la fecha actual
  const [provincias, setProvincias] = useState([]); // Almacena las provincias disponibles
  const [selectedProvincia, setSelectedProvincia] = useState('Todo el desastre'); // Provincia seleccionada
  const [superficieTotal, setSuperficieTotal] = useState(0); // Nueva variable para la suma de superf
  const [layersOpen, setLayersOpen] = useState(false);

  console.log('geoJson:', geoJson);
  const geoJsonToWkt = (geometry) => {
    return wellknown.stringify(geometry);
  };
  // Función para extraer fechas y provincias únicas
  const extractDatesAndProvincias = (geojsonData) => {
    const fechasUnicas = [];
    const provinciasUnicas = new Set();

    const terrainControl = new maplibregl.TerrainControl({
      source: 'terrain-source',
      exaggeration: 1.5 // Factor de exageración para el relieve
  });
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

  const handleProvinciaChange = (event) => {
    console.log('Provincia seleccionada:', event);
    const provincia = event;
    setSelectedProvincia(provincia);

    // Filtrar datos solo si no se ha seleccionado "Todo el desastre"
    if (provincia === 'Todo el desastre') {
      updateMapWithGeojson(geoJson); // Mostrar todos los datos
    } else {
      // Filtrar datos por la provincia seleccionada
      const filteredData = {
        ...geoJson,
        features: geoJson.features.filter((feature) => feature.properties.nom_com === provincia),
      };

      // Actualizar el mapa con los datos filtrados
      updateMapWithGeojson(filteredData);
    }
  };


  const [viewState, setViewState] = useState({
    latitude: -38.747434,
    longitude: -72.605348,
    zoom: 10,
  })

  const [popupInfo, setPopupInfo] = useState(null)

  const [activeSection, setActiveSection] = useState({
    infrastructure: true,
    graphs: true,
    resources: true,
    satellite: true,
  })

  const toggleSection = (section: Section) => {
    setActiveSection((current) => ({
      ...current,
      [section]: !current[section],
    }))
  }

  const InfrastructureData = [
    {
      id: 1,
      entity: 'Carabineros',
      quantity: 100,
      icon: '👮',
      color: 'bg-blue-500',
    },
    {
      id: 2,
      entity: 'Bomberos',
      quantity: 100,
      icon: '🚒',
      color: 'bg-white',
    },

    {
      id: 4,
      entity: 'Superfice Afectada (km²)',
      quantity: superficieTotal,
      icon: '🌍',
      color: 'bg-yellow-500',
    },
    {
      id: 5,
      entity: 'Recintos de Salud',
      quantity: 75,
      icon: '🏥',
      color: 'bg-yellow-500',
    },
    {
      id: 6,
      entity: 'Edificaciones Afectadas',
      quantity: 75,
      icon: '🏚️',
      color: 'bg-yellow-500',
    },
    {
      id: 7,
      entity: 'Establecimiento de Educacion',
      quantity: 65,
      icon: '🏫',
      color: 'bg-yellow-500',
    },
    {
      id: 8,
      entity: 'Antenas de Servicio',
      quantity: 10,
      icon: '📡',
      color: 'bg-yellow-500',
    },
    {
      id: 9,
      entity: 'Municipios',
      quantity: 15,
      icon: '🏛️',
      color: 'bg-yellow-500',
    },
  ]

  const weatherInfo = [
    {
      id: 1, tempeture: 15, day: 'Lun', icon: "🌤️"
    },
    {
      id: 2, tempeture: 20, day: 'Mar', icon: "☀️"
    },
    {
      id: 3, tempeture: 9, day: 'Mie', icon: "🌧️"
    },
    {
      id: 4, tempeture: 8, day: 'Jue', icon: "☁️"
    },
  ]

  const availableLayers = [
    {
      id: 'antenas',
      name: 'Antenas',
      url: 'desafio:antenas_servicio',
      style: '',
    },
    {
      id: 'aerodromos',
      name: 'Aeródromos',
      url: 'desafio:aeropuerto_aerodromo',
      style: '',
    },
    { id: 'bomberos', name: 'Bomberos', url: 'desafio:bomberos', style: '' },
    {
      id: 'carabineros',
      name: 'Carabineros',
      url: 'desafio:carabineros_cuarteles',
      style: '',
    },
    { id: 'viviendas', name: 'Viviendas', url: 'desafio:viviendas', style: '' },
    { id: 'redvial', name: 'Red Vial', url: 'desafio:redvial', style: '' },
  ]

  const [activeLayers, setActiveLayers] = useState<string[]>([])

  const handleLayerToggle = (layerId: string) => {
    setActiveLayers((current) =>
      current.includes(layerId)
        ? current.filter((id) => id !== layerId)
        : [...current, layerId]
    );
  };




  const updateMapWithGeojson = (geojsonData: Geojson) => {
    if (mapRef.current) {
      const map = mapRef.current;

      if (!map.getSource('geojson-source')) {
        map.addSource('geojson-source', {
          type: 'geojson',
          data: geojsonData,
        });

        map.addLayer({
          id: 'polygons-layer',
          type: 'fill',
          source: 'geojson-source',
          paint: {
            'fill-color': '#007cbf',
            'fill-opacity': 0.6,
          },
        });

        map.addLayer({
          id: 'polygon-borders',
          type: 'line',
          source: 'geojson-source',
          paint: {
            'line-color': '#ffffff',
            'line-width': 2,
          },
        });
      } else {
        const source = map.getSource('geojson-source');
        if (source && (source as GeoJSONSource).setData) {
          (source as GeoJSONSource).setData(geojsonData);
        }
      }
    }
  };
  const getCircleFromMultiPolygon = (geojson) => {
    console.log("geojson:", geojson);

    // Verificar que existan características
    if (!geojson.features || !geojson.features.length) {
        console.warn("No features available in the geojson.");
        return { centroid: null, maxDistance: 0, circle: null };
    }

    // Calcular el centroide del MultiPolygon
    const centroid = turf.centroid(geojson);
    const centroidCoords = centroid.geometry.coordinates;

    // Verificar que el centroide sea un conjunto válido de coordenadas (números)
    if (!Array.isArray(centroidCoords) || centroidCoords.length !== 2 || isNaN(centroidCoords[0]) || isNaN(centroidCoords[1])) {
        console.error("Invalid centroid coordinates:", centroidCoords);
        return { centroid: null, maxDistance: 0, circle: null };
    }

    console.log("Centroid Coordinates:", centroidCoords);

    let maxDistance = 0;
    let validPoints = 0;

    // Iterar sobre las características del GeoJSON
    geojson.features.forEach((feature) => {
        if (feature.geometry && feature.geometry.type === 'MultiPolygon') {
            const coordinates = turf.getCoords(feature);

            coordinates.forEach((polygon) => {
                polygon.forEach((ring) => {
                    ring.forEach((point) => {
                        // Verificar que las coordenadas del punto sean válidas
                        if (Array.isArray(point) && point.length === 2 && !isNaN(point[0]) && !isNaN(point[1])) {
                            validPoints += 1;
                            const pointGeoJson = turf.point(point);
                            const distance = turf.distance(pointGeoJson, turf.point(centroidCoords), { units: 'meters' });

                            // Actualizar maxDistance si la distancia es mayor
                            if (distance > maxDistance) {
                                maxDistance = distance;
                            }
                        } else {
                            console.warn("Invalid point detected:", point);
                        }
                    });
                });
            });
        }
    });

    // Comprobación adicional para asegurarse de que se han procesado puntos válidos
    if (validPoints === 0) {
        console.warn("No valid points found in the GeoJSON.");
        return { centroid: null, maxDistance: 0, circle: null };
    }

    // Si no se ha encontrado una distancia máxima mayor, usar un radio mínimo
    if (maxDistance === 0) {
        maxDistance = 100; // Puedes ajustar este valor como radio mínimo en metros
    }

    // Aplicar un margen extra del 5%
    const adjustedDistance = maxDistance * 2.05;
    console.log(`Adjusted Distance (5% added): ${adjustedDistance} meters`);

    // Generar el círculo con la distancia ajustada
    const circle = turf.circle(centroidCoords, adjustedDistance, { steps: 100, units: 'meters' });

    console.log("Generated Circle:", circle);

    // Retornar los resultados
    return { centroid: centroidCoords, maxDistance: adjustedDistance, circle };
};



  const handleDateChange = (newIndex?: string) => {
    let selectedDate;

    !newIndex ? selectedDate = dates[dates.length - 1] : selectedDate = newIndex;

    setCurrentIndex(selectedDate);


    const filteredData = {
      ...geoJson,
      features: geoJson.features.filter((feature) =>
        new Date(feature.properties.date).toISOString().slice(0, 10) === new Date(selectedDate).toISOString().slice(0, 10) &&
        (selectedProvincia === 'Todo el desastre' || feature.properties.nom_com === selectedProvincia)
      ),
    };


    // Calcular la suma de la superficie ("superf") para la fecha seleccionada
    const superficieSum = filteredData.features.reduce((sum, feature) => sum + (feature.properties.superf || 0), 0);
    setSuperficieTotal(superficieSum); // Actualizar el estado con la suma de superficies

    // Si hay un polígono coincidente, centrar el mapa en su centroide
    const matchingFeature = filteredData.features[0]; // Obtener el primer polígono correspondiente a la fecha
    const centroid= getCircleFromMultiPolygon(filteredData).centroid;
    console.log(centroid);
    if (matchingFeature) {
      if (mapRef.current) {
        mapRef.current.flyTo({ center:centroid, zoom: 12 });

      }
    }
    const { maxDistance, circle } = getCircleFromMultiPolygon(filteredData);
    console.log("Centroid:", centroid);
    console.log("Max Distance:", maxDistance);
    console.log("Circle:", circle);
    setCircle(circle);
    updateMapWithGeojson(filteredData);
   
    
  }
  const convertCoordsTo3857 = (coords) => {
    return coords.map(coord => proj4(epsg4326, epsg3857, coord));
  };
  const getCqlFilterForWms = (circleCoords) => {
    // Convertir coordenadas de EPSG:4326 a EPSG:3857
    const convertedCoords = convertCoordsTo3857(circleCoords);
  
    // Crear la geometría de POLYGON en EPSG:3857
    const cqlFilter = `INTERSECTS(geom, POLYGON ((${convertedCoords.map(coord => coord.join(' ')).join(', ')})))`;
  
    return cqlFilter;
  };
  useEffect(() => {
    if (mapContainer.current && !mapRef.current) {
      mapRef.current = new maplibregl.Map({
        container: mapContainer.current,
        style: {
          version: 8,
          sources: {
            osm: {
              type: 'raster',
              tiles: [
                'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
              ],
              tileSize: 256,
            },
          },
          layers: [
            {
              id: 'osm',
              type: 'raster',
              source: 'osm',
              minzoom: 0,
              maxzoom: 19,
            },
          ],
        },
        center: [viewState.longitude, viewState.latitude],
        zoom: 10,
      });

      mapRef.current.addControl(new RulerControl, 'bottom-right');
      mapRef.current.on('ruler.on', () => console.log('Ruler activated'));
      mapRef.current.on('ruler.off', () => console.log('Ruler deactivated'));
      const extractedData = extractDatesAndProvincias(geoJson);
      setProvincias(['Todo el desastre', ...extractedData.provinciasUnicas]); // Agregar opción "Todo el desastre"
      setSelectedProvincia('Todo el desastre'); // Seleccionar "Todo el desastre" por defecto

      mapRef.current.on('load', () => {
        mapRef.current.addControl(new maplibregl.NavigationControl(), 'bottom-right');

        handleDateChange(); // Llamar a handleDateChange una vez que el estilo esté cargado
      });
    }

  }, []);

  useEffect(() => {
    if (mapRef.current) {
      // Obtener todas las capas que ya no están activas y eliminarlas del mapa
      availableLayers.forEach((layer) => {
        if (!activeLayers.includes(layer.id)) {
          if (mapRef.current.getLayer(layer.id)) {
            mapRef.current.removeLayer(layer.id);
          }
          if (mapRef.current.getSource(layer.id)) {
            mapRef.current.removeSource(layer.id);
          }
        }
      });

      // Agregar las nuevas capas activas
      availableLayers
        .filter((layer) => activeLayers.includes(layer.id))
        .forEach((layer) => {
          if (circle) {
            const geom = turf.getGeom(circle);
            const coords = turf.getCoords(geom)[0]; // Suponiendo que es un polígono
            coords.push(coords[0]); // Cerrar el polígono
            
            // Obtener el filtro CQL con las coordenadas convertidas
            const cqlFilter = getCqlFilterForWms(coords);
                // Verificar si la capa ya está agregada antes de añadirla
                if (!mapRef.current.getSource(layer.id)) {
                    // Añadir la fuente raster
                    mapRef.current.addSource(layer.id, {
                        type: 'raster',
                        tiles: [
                            `http://192.168.1.116:8080/geoserver/desafio/wms?service=WMS&request=GetMap&layers=${layer.url}&styles=${layer.style}&format=image/png&transparent=true&version=1.1.1&srs=EPSG:3857&bbox={bbox-epsg-3857}&width=256&height=256&CQL_FILTER=${cqlFilter}`,

                        ],
                        tileSize: 256, // Limitar la visualización usando el bounding box
                    });

                    // Añadir la capa raster
                    mapRef.current.addLayer({
                        id: layer.id,
                        type: 'raster',
                        source: layer.id,
                    });
                }

        }
    });
}
  }, [activeLayers, availableLayers]);

  return (
    <div className='h-[100vh] w-full relative'>

      <div
        ref={mapContainer}
        style={{ width: '100%', height: '100vh' }}
      >

      </div>

      <div className='absolute top-24 left-4 z-[1000] flex gap-2'>
        {/* Titulo */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-full shadow-lg">
          <h1 className="text-xl font-bold tracking-wider">
            {nameEvent || 'Evento de desastre'}
          </h1>
        </div>

        {/* Selector de provincia */}

        <div className="flex items-center space-x-4 bg-white rounded-full shadow-lg py-1.5 px-4" style={{ zIndex: 1000 }}>
          <MapPin className="h-5 w-5 text-blue-500" />
          <Select value={selectedProvincia} onValueChange={handleProvinciaChange}>
            <SelectTrigger className="w-[170px] border-none shadow-none focus:ring-0 ">
              <SelectValue placeholder="Selecciona una provincia" />
            </SelectTrigger>
            <SelectContent className='z-[1000]'>
              {provincias.map((province) => (
                <SelectItem key={province} value={province}>
                  {province}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

        </div>


      </div>

      <Timeline dates={dates} selectedDate={currentIndex} handleDateSelect={handleDateChange} />

      <MapBar activeSection={activeSection} onClick={toggleSection} />

      {
        activeSection.infrastructure && (
          <InfraestructureCard infraestructureData={InfrastructureData} />
        )
      }

      {
        activeSection.graphs && (
          <GraphsCard />
        )
      }

      {
        activeSection.resources && (
          <WeatherCard weatherInfo={weatherInfo} />
        )
      }

      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={() => setLayersOpen(!layersOpen)}
          className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors duration-200"
          aria-label="Toggle layers menu"
        >
          <LayersIcon size={24} />
        </button>
        {layersOpen && (
          <div className="absolute top-9 right-0 mt-2 p-4 bg-white rounded shadow-md w-48">
            <h3 className="font-bold mb-2 text-sm">Capas</h3>
            {availableLayers.map(layer => (
              <div key={layer.id} className="flex items-center mb-2">
                <input
                  type="checkbox"
                  id={layer.id}
                  onChange={() => handleLayerToggle(layer.id)}
                  className="mr-2"
                />
                <label htmlFor={layer.id}>{layer.name}</label>
              </div>
            ))}
          </div>
        )}
      </div>
      {
        activeSection.satellite && (

          <div className="absolute  bottom-4 left-4 space-x-4 flex">

            <div
              className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg shadow-sm w-full max-w-sm"
            >
              <div>
                <p className="text-sm font-medium text-gray-900">MODIS</p>
                <p className="text-2xl font-bold text-gray-900">2:48:21</p>
              </div>

              <div className={`p-2 rounded-full text-2xl `}>📡</div>
            </div>

          </div>
        )
      }
    </div >


  )
}

export default LayerisMapLibre


