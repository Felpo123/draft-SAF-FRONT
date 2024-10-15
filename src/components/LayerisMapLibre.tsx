'use client'
import 'maplibre-gl/dist/maplibre-gl.css'
import maplibregl, { GeoJSONSource, Map } from 'maplibre-gl'
import React, { useEffect, useRef, useState } from 'react'
import InfraestructureCard from './InfraestructureCard'
import GraphsCard from './GraphsCard'
import MapBar from './MapBar'
import WeatherCard from './WeatherCard'
import Timeline from './TimelineMapBar'
import {
  extractDatesAndComunas,
  extractDatesAndIds,
  Geojson,
  getCentroidAndBBox,
  weatherInfo,
} from '@/lib/mapUtils'
import { Building, ChevronUp, Coffee, Hotel, LayersIcon, MapPin, ShoppingBag, Users, Utensils } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'
import { Feature, Polygon, GeoJsonProperties } from 'geojson';
import RulerControl from '@mapbox-controls/ruler'
import '@mapbox-controls/ruler/src/index.css'
import '@mapbox-controls/compass/src/index.css'
import * as turf from '@turf/turf'
import BarChartToMap from './BarChartToMap'
import TooltipControl from '@mapbox-controls/tooltip';
import '@mapbox-controls/tooltip/src/index.css'
import proj4 from 'proj4';
import { set } from 'zod'
import { map } from 'leaflet'

const epsg4326 = 'EPSG:4326'; // Sistema geográfico (lon, lat)
const epsg3857 = 'EPSG:3857'; // Web Mercator
export type Section = 'infrastructure' | 'graphs' | 'resources' | 'satellite';

interface LayerisMapLibreProps {
  nameEvent?: string
  idEvent?: string
  geoJson: Geojson
}
export type ControlOptions = {
  instant?: false
}

export interface Layer {
  id: string
  name: string
  url: string
  style: string
}

const LayerisMapLibre = ({
  nameEvent,
  idEvent,
  geoJson,
}: LayerisMapLibreProps) => {
  type CircleType = Feature<Polygon, GeoJsonProperties> | null;


  const [circle, setCircle] = useState<CircleType>(null);
  const [centroidse, setCentroidse] = useState([]);
  const [maxDistance, setMaxDistance] = useState(0);
  const mapContainer = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<Map | null>(null)
  const dates = extractDatesAndIds(geoJson).fechasUnicas;
  const [incidentDates, setIncidentDates] = useState<string[]>(dates);
  const lastDate = dates[dates.length - 1];
  const [selectedDate, setSelectedDate] = useState(lastDate)
  const comunas = ['Todo el desastre', ...extractDatesAndComunas(geoJson).provinciasUnicas]
  const [selectedComuna, setSelectedComuna] = useState('Todo el desastre') // Provincia seleccionada
  const [superficieTotal, setSuperficieTotal] = useState(0) // Nueva variable para la suma de superf
  const [layersOpen, setLayersOpen] = useState(false)
  const [activeLayers, setActiveLayers] = useState<string[]>([])



  const handleProvinciaChange = (selectedComuna: string) => {
    setSelectedComuna(selectedComuna);

    // Verificar si se seleccionó una comuna específica
    if (selectedComuna !== 'Todo el desastre') {
      const incidentDates = geoJson.features
        .filter(feature => dates.includes(feature.properties.date) && feature.properties.nom_com === selectedComuna)
        .map(feature => feature.properties.date)
        .sort();

      setIncidentDates(incidentDates);

      // Filtrar datos solo por la comuna y fecha seleccionada
      const filteredData = {
        ...geoJson,
        features: geoJson.features.filter(
          feature =>
            feature.properties.nom_com === selectedComuna &&
            new Date(feature.properties.date).toISOString().slice(0, 10) === new Date(selectedDate).toISOString().slice(0, 10)
        ),
      };

      updateMapWithGeojson(filteredData);
    } else {
      // Si se selecciona "Todo el desastre", mostrar todos los datos y fechas
      setIncidentDates(dates);

      const filteredData = {
        ...geoJson,
        features: geoJson.features.filter(
          feature => new Date(feature.properties.date).toISOString().slice(0, 10) === new Date(selectedDate).toISOString().slice(0, 10)
        ),
      };

      updateMapWithGeojson(filteredData);
    }
  };


  const [activeSection, setActiveSection] = useState({
    infrastructure: true,
    graphs: true,
    resources: false,
    satellite: false,
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
      entity: 'Superfice Afectada (ha)',
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
  ] as Layer[]

  const handleLayerToggle = (layerId: string) => {
    setActiveLayers((current) =>
      current.includes(layerId)
        ? current.filter((id) => id !== layerId)
        : [...current, layerId]
    );
  };



  const updateMapWithGeojson = (geojsonData: Geojson) => {
    if (mapRef.current) {
      const map = mapRef.current

      // Calcular la suma de la superficie ("superf") para la fecha seleccionada
      const superficieSum = geojsonData.features.reduce(
        (sum, feature) => sum + (feature.properties.superf || 0),
        0,
      )
      setSuperficieTotal(superficieSum) // Actualizar el estado con la suma de superficies

      // Si hay un polígono coincidente, centrar el mapa en su centroide
      const matchingFeature = geojsonData.features[0]; // Obtener el primer polígono correspondiente a la fecha
      const centroid = getCircleFromMultiPolygon(geojsonData).centroid;

      if (matchingFeature && centroid) {
        map.flyTo({ center: centroid as maplibregl.LngLatLike, zoom: 12 });
      }
      const { maxDistance, circle } = getCircleFromMultiPolygon(geojsonData);

      setCircle(circle);

      if (!map.getSource('geojson-source')) {
        map.addSource('geojson-source', {
          type: 'geojson',
          data: geojsonData,
        })

        map.addLayer(
          {
            id: 'polygons-layer',
            type: 'fill',
            source: 'geojson-source',
            paint: {
              'fill-color': '#007cbf',
              'fill-opacity': 0.8,
            },
          },

        );


        map.addLayer(
          {
            id: 'polygon-borders',
            type: 'line',
            source: 'geojson-source',
            paint: {
              'line-color': '#ffffff',
              'line-width': 3,
              'line-opacity': 0.9,
            },
          },

        );
      } else {
        const source = map.getSource('geojson-source')
        if (source && (source as GeoJSONSource).setData) {
          ; (source as GeoJSONSource).setData(geojsonData)
        }
      }

      if (activeLayers.length > 0) {
        updateActiveLayers(map, availableLayers, activeLayers, circle);
      }
    }
  };

  const getCircleFromMultiPolygon = (geojson) => {


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


    // Generar el círculo con la distancia ajustada
    const circle = turf.circle(centroidCoords, adjustedDistance, { steps: 100, units: 'meters' });



    // Retornar los resultados
    return { centroid: centroidCoords, maxDistance: adjustedDistance, circle };
  };



  const handleDateChange = (timelineDate?: string) => {
    let incidentDate;

    !timelineDate ? (incidentDate = lastDate) : (incidentDate = timelineDate)

    setSelectedDate(incidentDate)

    const filteredData = {
      ...geoJson,
      features: geoJson.features.filter(
        (feature) =>
          new Date(feature.properties.date).toISOString().slice(0, 10) ===
          new Date(incidentDate).toISOString().slice(0, 10) &&
          (selectedComuna === 'Todo el desastre' ||
            feature.properties.nom_com === selectedComuna),
      ),
    }

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
              tiles: ['https://a.tile.openstreetmap.org/{z}/{x}/{y}.png'],
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
        center: [-72.605348, -38.747434],
        zoom: 10,
      });

      mapRef.current.addControl(new RulerControl, 'bottom-right');



      mapRef.current.on('load', () => {
        mapRef.current.addControl(new maplibregl.NavigationControl(), 'bottom-right');

        handleDateChange(); // Llamar a handleDateChange una vez que el estilo esté cargado
      });
    }
  }, [])

  useEffect(() => {
    const map = mapRef.current;
    if (map) {
      // Obtener todas las capas que ya no están activas y eliminarlas del mapa
      removeInactiveLayers(map, availableLayers, activeLayers);
      // Agregar todas las capas activas al mapa
      addActiveLayers(map, availableLayers, activeLayers, circle);
    }
  }, [activeLayers, availableLayers]);

  const toggleInfo = () => {
    if (infoExpanded) {
      setInfoExpanded(false);
    } else if (infoOpen) {
      setInfoExpanded(true);
    } else {
      setInfoOpen(true);
    }
  };

  const [infoOpen, setInfoOpen] = useState(false)
  const [infoExpanded, setInfoExpanded] = useState(false)

  function removeInactiveLayers(map: maplibregl.Map, availableLayers: Layer[], activeLayers: string[]) {
    availableLayers.forEach((layer) => {
      if (!activeLayers.includes(layer.id)) {
        if (map.getLayer(layer.id)) {
          map.removeLayer(layer.id);
        }
        if (map.getSource(layer.id)) {
          map.removeSource(layer.id);
        }
      }
    });
  }

  function addActiveLayers(map: maplibregl.Map, availableLayers: Layer[], activeLayers: string[], circle: CircleType) {
    availableLayers
      .filter((layer) => activeLayers.includes(layer.id))
      .forEach((layer) => {
        if (circle) {
          const geom = turf.getGeom(circle);
          const coords = turf.getCoords(geom)[0];
          coords.push(coords[0]);

          const cqlFilter = getCqlFilterForWms(coords); // Asegúrate de que esta función esté bien tipada

          if (!map.getSource(layer.id)) {
            map.addSource(layer.id, {
              type: 'raster',
              tiles: [
                `http://192.168.1.116:8080/geoserver/desafio/wms?service=WMS&request=GetMap&layers=${layer.url}&styles=${layer.style}&format=image/png&transparent=true&version=1.1.1&srs=EPSG:3857&bbox={bbox-epsg-3857}&width=256&height=256&CQL_FILTER=${cqlFilter}`,
              ],
              tileSize: 256,
            });

            map.addLayer({
              id: layer.id,
              type: 'raster',
              source: layer.id,
            });
          }
        }
      });
  }

  function updateActiveLayers(map: maplibregl.Map, availableLayers: Layer[], activeLayers: string[], circle: CircleType) {
    //REMOVE ACTIVE LAYER
    availableLayers.forEach((layer) => {
      if (activeLayers.includes(layer.id)) {
        if (map.getLayer(layer.id)) {
          map.removeLayer(layer.id);
        }
        if (map.getSource(layer.id)) {
          map.removeSource(layer.id);
        }
      }
    });
    addActiveLayers(map, availableLayers, activeLayers, circle);
  }


  return (
    <div className="h-full w-full relative">
      <div ref={mapContainer} style={{ width: '100%', height: '100%' }}></div>

      <div className="absolute sm:top-24 top-11 left-1 sm:left-4 z-[1000] flex flex-col sm:flex-row gap-2 sm:w-32">
        {/* Titulo */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-full shadow-lg ">
          <h1 className="sm:text-xl text-sm font-bold tracking-wider whitespace-nowrap ">
            {nameEvent || 'Evento de desastre'}
          </h1>
        </div>

        {/* Selector de provincia */}

        <div
          className="flex items-center space-x-4 bg-white rounded-full shadow-lg py-1.5 px-4"
          style={{ zIndex: 1000 }}
        >
          <MapPin className="h-5 w-5 text-blue-500" />
          <Select
            value={selectedComuna}
            onValueChange={handleProvinciaChange}
          >
            <SelectTrigger className="sm:w-[170px] w-32 border-none shadow-none focus:ring-0 max-sm:p-0">
              <SelectValue placeholder="Selecciona una provincia" />
            </SelectTrigger>
            <SelectContent className="z-[1000]">
              {comunas.map((province) => (
                <SelectItem key={province} value={province}>
                  {province}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Timeline
        dates={incidentDates}
        selectedDate={selectedDate}
        handleDateSelect={handleDateChange}
      />

      <MapBar activeSection={activeSection} onClick={toggleSection} />

      {/* BAR MOBILE */}

      <div
        className={`block sm:hidden z-[1000] absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-lg transition-all duration-300 ease-in-out ${infoExpanded ? 'h-3/4' : 'h-10'
          }`}
      >
        <div
          className="flex justify-center items-center h-10 cursor-pointer"
          onClick={toggleInfo}
          aria-label={infoExpanded ? "Minimizar panel de información" : "Abrir panel de información"}
        >
          <ChevronUp size={24} className={`transition-transform duration-300 ${infoExpanded ? 'rotate-180' : ''}`} />
        </div>
        {
          infoOpen && (

            <div className="p-4 overflow-y-auto h-[calc(100%-40px)]">
              <h2 className="text-2xl font-bold mb-6">Información del área</h2>
              <div className="  p-4 flex space-x-4 ">
                <div className="flex flex-wrap gap-2">
                  {InfrastructureData.map(({ color, entity, icon, id, quantity }) => (
                    <div
                      key={id}
                      className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg shadow-sm w-full max-w-sm"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-900">{entity}</p>
                        <p className="text-2xl font-bold text-gray-900">{quantity}</p>
                      </div>

                      <div className={`p-2 rounded-full ${color}`}>{icon}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-8 space-y-1">
                <h3 className="text-xl font-semibold mb-4">Estadísticas demográficas</h3>
                <BarChartToMap />

                <BarChartToMap />

              </div>
            </div>
          )

        }
      </div>

      <div className='hidden sm:block'>

        {activeSection.infrastructure && (
          <InfraestructureCard infraestructureData={InfrastructureData} />
        )}

        {activeSection.graphs && <GraphsCard />}

        {activeSection.resources && <WeatherCard weatherInfo={weatherInfo} />}

        {activeSection.satellite && (
          <div className="absolute  bottom-4 left-4 space-x-4 flex">
            <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg shadow-sm w-full max-w-sm">
              <div>
                <p className="text-sm font-medium text-gray-900">MODIS</p>
                <p className="text-2xl font-bold text-gray-900">2:48:21</p>
              </div>

              <div className={`p-2 rounded-full text-2xl `}>📡</div>
            </div>
          </div>
        )}
      </div>
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
            {availableLayers.map((layer) => (
              <div key={layer.id} className="flex items-center mb-2">
                <input
                  type="checkbox"
                  id={layer.id}
                  onChange={() => handleLayerToggle(layer.id)}
                  className="mr-2"
                  checked={activeLayers.includes(layer.id)}
                />
                <label htmlFor={layer.id}>{layer.name}</label>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default LayerisMapLibre


