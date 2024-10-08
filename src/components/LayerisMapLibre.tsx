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
import { MapPin } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';


export type Section = 'infrastructure' | 'graphs' | 'resources' | 'satellite';

interface LayerisMapLibreProps {
  incidentId?: string
  idEvent?: string
  geoJson: Geojson
}

const LayerisMapLibre = ({ incidentId, idEvent, geoJson }: LayerisMapLibreProps) => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<Map | null>(null);
  const dates = extractDatesAndIds(geoJson).fechasUnicas;
  const [currentIndex, setCurrentIndex] = useState(dates[dates.length - 1]); // Índice de la fecha actual
  const [provincias, setProvincias] = useState([]); // Almacena las provincias disponibles
  const [selectedProvincia, setSelectedProvincia] = useState('Todo el desastre'); // Provincia seleccionada
  const [superficieTotal, setSuperficieTotal] = useState(0); // Nueva variable para la suma de superf

  // Función para extraer fechas y provincias únicas
  const extractDatesAndProvincias = (geojsonData) => {
    const fechasUnicas = [];
    const provinciasUnicas = new Set();

    geojsonData.features.forEach((feature) => {
      const fecha = feature.properties.date;
      const provincia = feature.properties.nom_pro; // Utilizamos nom_pro para la provincia

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
        features: geoJson.features.filter((feature) => feature.properties.nom_pro === provincia),
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

  const handleZoomIn = () => {
    setViewState((prevState) => ({
      ...prevState,
      zoom: Math.min(prevState.zoom + 1, 20), // Limitar zoom máximo a 20
    }))
  }

  const handleZoomOut = () => {
    setViewState((prevState) => ({
      ...prevState,
      zoom: Math.max(prevState.zoom - 1, 1), // Limitar zoom mínimo a 1
    }))
  }

  // Crear los datos GeoJSON para el círculo
  const circleCenter = [-72.605348, -38.747434] // Centro del círculo
  const circleRadius = 10 // Radio en km

  // Calcular el bounding box del círculo
  const bbox = calculateBoundingBox(
    circleCenter[0],
    circleCenter[1],
    circleRadius,
  )

  // Calcular el bounding box del círculo
  const bboxToWMS = calculateBoundingBox2(
    circleCenter[0],
    circleCenter[1],
    circleRadius,
  )

  const circleLayer = {
    id: 'circle-layer',
    type: 'fill',
    source: 'circle',
    paint: {
      'fill-color': '#007cbf',
      'fill-opacity': 0.3,
    },
  }


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

  const getCentroid = (coordinates: any): [number, number] => {
    const flatCoords = coordinates.flat(2);
    const lonSum = flatCoords.reduce((sum: number, coord: [number, number]) => sum + coord[0], 0);
    const latSum = flatCoords.reduce((sum: number, coord: [number, number]) => sum + coord[1], 0);
    const len = flatCoords.length;
    return [lonSum / len, latSum / len];
  };


  const handleDateChange = (newIndex?: string) => {
    let selectedDate;

    !newIndex ? selectedDate = dates[dates.length - 1] : selectedDate = newIndex;

    setCurrentIndex(selectedDate);


    const filteredData = {
      ...geoJson,
      features: geoJson.features.filter((feature) =>
        new Date(feature.properties.date).toISOString().slice(0, 10) === new Date(selectedDate).toISOString().slice(0, 10) &&
        (selectedProvincia === 'Todo el desastre' || feature.properties.nom_pro === selectedProvincia)
      ),
    };


    // Calcular la suma de la superficie ("superf") para la fecha seleccionada
    const superficieSum = filteredData.features.reduce((sum, feature) => sum + (feature.properties.superf || 0), 0);
    setSuperficieTotal(superficieSum); // Actualizar el estado con la suma de superficies

    // Si hay un polígono coincidente, centrar el mapa en su centroide
    const matchingFeature = filteredData.features[0]; // Obtener el primer polígono correspondiente a la fecha

    if (matchingFeature) {
      const centroid = getCentroid(matchingFeature.geometry.coordinates);
      if (mapRef.current) {
        mapRef.current.flyTo({ center: centroid, zoom: 10 });
      }
    }

    updateMapWithGeojson(filteredData);

  }

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

      const extractedData = extractDatesAndProvincias(geoJson);
      setProvincias(['Todo el desastre', ...extractedData.provinciasUnicas]); // Agregar opción "Todo el desastre"
      setSelectedProvincia('Todo el desastre'); // Seleccionar "Todo el desastre" por defecto

      mapRef.current.on('load', () => {
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
          const bboxToWMS = [/* valores del bounding box (bbox) */];

          // Verificar si la capa ya está agregada antes de añadirla
          if (!mapRef.current.getSource(layer.id)) {
            // Añadir la fuente raster
            mapRef.current.addSource(layer.id, {
              type: 'raster',
              tiles: [
                `geoserver/desafio/wms?service=WMS&request=GetMap&layers=${layer.url}&styles=${layer.style}&format=image/png&transparent=true&version=1.1.1&srs=EPSG:3857&bbox={bbox-epsg-3857}&width=256&height=256`,
              ],
              tileSize: 256,
              bounds: bbox, // Limitar la visualización usando el bounding box
            });

            // Añadir la capa raster
            mapRef.current.addLayer({
              id: layer.id,
              type: 'raster',
              source: layer.id,
            });
          }
        });
    }
  }, [activeLayers, availableLayers, bbox]);

  return (
    <div className='h-[100vh] w-full relative'>

      <div
        ref={mapContainer}
        style={{ width: '100%', height: '100vh' }}
      >

      </div>

      {/* Titulo */}

      <div className="absolute top-24 left-4 z-[1000]">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-full shadow-lg">
          <h1 className="text-xl font-bold tracking-wider">
            Valparaiso <span className="text-yellow-300">{2024}</span>
          </h1>
        </div>
      </div>

      {/* Selector de provincia */}

      <div className="absolute top-24 left-64 flex items-center space-x-4 bg-white rounded-full shadow-lg py-1.5 px-4" style={{ zIndex: 1000 }}>
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

      <div className="control-panel">
        <summary className="summary">Capas disponibles</summary>
        <div className="layers-list">
          {availableLayers.map((layer) => (
            <div key={layer.id} className="layer-item">
              <input
                type="checkbox"
                checked={activeLayers.includes(layer.id)}
                onChange={() => handleLayerToggle(layer.id)}
              />
              {layer.name}
            </div>
          ))}
        </div>

        {/* Botones de zoom */}
        <div className="zoom-controls">
          <button onClick={handleZoomIn} className="zoom-button">
            Zoom +
          </button>
          <button onClick={handleZoomOut} className="zoom-button">
            Zoom -
          </button>
        </div>

        {/* Mostrar nivel de zoom actual */}
        <div className="zoom-level">
          Nivel de zoom: {viewState.zoom.toFixed(2)}
        </div>

      </div>

      {/* Satellite Card*/}

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
