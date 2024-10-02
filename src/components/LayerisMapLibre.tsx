import 'maplibre-gl/dist/maplibre-gl.css';
import Map, { Source, Layer, Popup } from 'react-map-gl';
import { useState } from 'react';
import './LayerisMapLibre.css'; // Archivo CSS para estilos personalizados

// Función para generar un círculo como un polígono
const generateCircle = (lng, lat, radiusInKm, points = 64) => {
  const coordinates = [];
  const distanceX = radiusInKm / (111.32 * Math.cos((lat * Math.PI) / 180));
  const distanceY = radiusInKm / 110.574;

  for (let i = 0; i < points; i++) {
    const angle = (i * 2 * Math.PI) / points;
    const dx = distanceX * Math.cos(angle);
    const dy = distanceY * Math.sin(angle);
    coordinates.push([lng + dx, lat + dy]);
  }

  coordinates.push(coordinates[0]); // Cerrar el círculo
  return {
    type: 'Feature',
    geometry: {
      type: 'Polygon',
      coordinates: [coordinates],
    },
  };
};

// Función para calcular el bounding box del círculo
const calculateBoundingBox = (lng, lat, radiusInKm) => {
  const distanceX = radiusInKm / (111.32 * Math.cos((lat * Math.PI) / 180));
  const distanceY = radiusInKm / 110.574;

  const minLng = lng - distanceX;
  const maxLng = lng + distanceX;
  const minLat = lat - distanceY;
  const maxLat = lat + distanceY;

  return [minLng, minLat, maxLng, maxLat];
};

const LayerisMapLibre = () => {
  const [viewState, setViewState] = useState({
    latitude: -38.747434,
    longitude: -72.605348,
    zoom: 10,
  });

  const [popupInfo, setPopupInfo] = useState(null);

  const availableLayers = [
    { id: 'antenas', name: 'Antenas', url: 'desafio:antenas_servicio', style: '' },
    { id: 'aerodromos', name: 'Aeródromos', url: 'desafio:aeropuerto_aerodromo', style: '' },
    { id: 'bomberos', name: 'Bomberos', url: 'desafio:bomberos', style: '' },
    { id: 'carabineros', name: 'Carabineros', url: 'desafio:carabineros_cuarteles', style: '' },
    { id: 'viviendas', name: 'Viviendas', url: 'desafio:viviendas', style: '' },
    { id: 'redvial', name: 'Red Vial', url: 'desafio:redvial', style: '' },
  ];

  const [activeLayers, setActiveLayers] = useState([]);

  const handleLayerToggle = (layerId) => {
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
    }));
  };

  const handleZoomOut = () => {
    setViewState((prevState) => ({
      ...prevState,
      zoom: Math.max(prevState.zoom - 1, 1), // Limitar zoom mínimo a 1
    }));
  };

  // Crear los datos GeoJSON para el círculo
  const circleCenter = [-72.605348, -38.747434]; // Centro del círculo
  const circleRadius = 10; // Radio en km

  const circleData = {
    type: 'FeatureCollection',
    features: [generateCircle(circleCenter[0], circleCenter[1], circleRadius)], // Radio de 10 km
  };

  // Calcular el bounding box del círculo
  const bbox = calculateBoundingBox(circleCenter[0], circleCenter[1], circleRadius);

  const circleLayer = {
    id: 'circle-layer',
    type: 'fill',
    source: 'circle',
    paint: {
      'fill-color': '#007cbf',
      'fill-opacity': 0.3,
    },
  };

  return (
    <>
      <Map
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        style={{ width: '100%', height: '768px' }}
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
                tiles={[`geoserver/desafio/wms?service=WMS&request=GetMap&layers=${layer.url}&styles=${layer.style}&format=image/png&transparent=true&version=1.1.1&srs=EPSG:3857&bbox={bbox-epsg-3857}&width=256&height=256`]}
                bounds={bbox} // Usamos el bounding box para limitar la visualización
                scheme={"xyz"}
              >
                <Layer id={layer.id} type="raster" />
              </Source>
            );
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
                      {Object.entries(feature.properties).map(([key, value]) => (
                        <p key={key}>
                          <strong>{key}:</strong> {value}
                        </p>
                      ))}
                      <hr />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </Popup>
        )}
      </Map>

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
    </>
  );
};

export default LayerisMapLibre;
