'use client'
import 'maplibre-gl/dist/maplibre-gl.css'
import Map, { Source, Layer, Popup, ScaleControl } from 'react-map-gl/maplibre'
import React, { useState } from 'react'
import { data, dataContent, dataHeader, dataTitle } from './ui/data'
import { Button } from './ui/button'
import {
  BarChart2,
  Building2,
  ChevronDown,
  ChevronUp,
  CloudIcon,
  CloudMoon,
  CloudRain,
  CloudSnow,
  Stethoscope,
  Sun,
} from 'lucide-react'
import InfraestructureCard from './InfraestructureCard'
import BarChartToMap from './BarChartToMap'
import { icon } from 'leaflet'
import GraphsCard from './GraphsCard'
import MapBar from './MapBar'
import WeatherCard from './WeatherCard'
import Timeline from './TimelineMapBar'

// Función para generar un círculo como un polígono
const generateCircle = (lng, lat, radiusInKm, points = 64) => {
  const coordinates = []
  const distanceX = radiusInKm / (111.32 * Math.cos((lat * Math.PI) / 180))
  const distanceY = radiusInKm / 110.574

  for (let i = 0; i < points; i++) {
    const angle = (i * 2 * Math.PI) / points
    const dx = distanceX * Math.cos(angle)
    const dy = distanceY * Math.sin(angle)
    coordinates.push([lng + dx, lat + dy])
  }

  coordinates.push(coordinates[0]) // Cerrar el círculo
  return {
    type: 'Feature',
    geometry: {
      type: 'Polygon',
      coordinates: [coordinates],
    },
  }
}

// Función para calcular el bounding box del círculo
const calculateBoundingBox = (lng, lat, radiusInKm) => {
  const distanceX = radiusInKm / (111.32 * Math.cos((lat * Math.PI) / 180))
  const distanceY = radiusInKm / 110.574

  const minLng = lng - distanceX
  const maxLng = lng + distanceX
  const minLat = lat - distanceY
  const maxLat = lat + distanceY

  return [minLng, minLat, maxLng, maxLat]
}

// Conversión de lat/lng a EPSG:3857
const toEPSG3857 = (lng, lat) => {
  const R_MAJOR = 6378137.0;
  const x = R_MAJOR * ((lng * Math.PI) / 180);
  const scale = x / lng;
  const y = R_MAJOR * Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360));
  return [x, y];
};

// Función para calcular el bounding box en EPSG:3857
const calculateBoundingBox2 = (lng, lat, radiusInKm) => {
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

export type Section = 'infrastructure' | 'graphs' | 'resources';

interface LayerisMapLibreProps {
  incidentId?: string
  date?: string
}

const LayerisMapLibre = ({ incidentId, date }: LayerisMapLibreProps) => {
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
      entity: 'Aeropuertos',
      quantity: 75,
      icon: '✈️',
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

  const [activeLayers, setActiveLayers] = useState([])

  const handleLayerToggle = (layerId) => {
    setActiveLayers((current) =>
      current.includes(layerId)
        ? current.filter((id) => id !== layerId)
        : [...current, layerId],
    )
  }

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

  const circleData = {
    type: 'FeatureCollection',
    features: [generateCircle(circleCenter[0], circleCenter[1], circleRadius)], // Radio de 10 km
  }

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

  const dates = ['01-05', '02-05', '03-05']

  return (
    <div className='h-[100vh] w-full relative'>
      <Map
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        style={{ width: '100%', height: '100%' }}
        mapLib={import('maplibre-gl')}
        mapStyle={{
          version: 8,
          sources: {
            osm: {
              type: 'raster',
              tiles: [
                'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
                'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
                'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png',
              ],
              tileSize: 512,
            },
            circle: {
              type: 'geojson',
              data: circleData,
            },
          },
          layers: [
            {
              id: 'osm-tiles',
              type: 'raster',
              source: 'osm',
              minzoom: 0,
              maxzoom: 19,
            },
          ],
        }}
      >
        {/* Capa del círculo como un polígono */}
        <Layer {...circleLayer} />

        {availableLayers
          .filter((layer) => activeLayers.includes(layer.id))
          .map((layer) => {
            return (
              <Source
                key={layer.id}
                type="raster"
                tiles={[
                  `geoserver/desafio/wms?service=WMS&request=GetMap&layers=${layer.url}&styles=${layer.style}&format=image/png&transparent=true&version=1.1.1&srs=EPSG:3857&bbox=${bboxToWMS.join(',')}&width=256&height=256`,
                ]}
                bounds={bbox} // Usamos el bounding box para limitar la visualización
                scheme={'xyz'}

              >
                <Layer id={layer.id} type="raster" />
              </Source>
            )
          })}

        {/* Mostrar popup si hay información de la consulta WMS */}
        {popupInfo && (
          <Popup
            longitude={popupInfo.lngLat.lng}
            latitude={popupInfo.lngLat.lat}
            closeOnClick={false}
            onClose={() => setPopupInfo(null)}
          >
            <div className="custom-popup">
              <h4>Información de Capas</h4>
              {popupInfo.layers.map((layer) => (
                <div key={layer.layerName} className="layer-info">
                  <h5>{layer.layerName}</h5>
                  {layer.features.map((feature, index) => (
                    <div key={index} className="feature-info">
                      {Object.entries(feature.properties).map(
                        ([key, value]) => (
                          <p key={key}>
                            <strong>{key}:</strong> {value}
                          </p>
                        ),
                      )}
                      <hr />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </Popup>
        )}
      </Map>
      <Timeline dates={dates} selectedDate={date ? date : ""} />

      <MapBar activeSection={activeSection} onClick={toggleSection} />

      {activeSection.infrastructure && (
        <InfraestructureCard infraestructureData={InfrastructureData} />
      )}

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
    </div>
  )
}

export default LayerisMapLibre
