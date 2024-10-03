import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import {
  Circle,
  FeatureGroup,
  LayerGroup,
  LayersControl,
  MapContainer,
  Marker,
  Polygon,
  Popup,
  Rectangle,
  TileLayer,
  useMap,
  useMapEvents,
} from 'react-leaflet'
import {
  LayerEvent,
  LayersControlEvent,
  LeafletEvent,
  Map as leafletMap,
  LayerGroup as LeafletLayerGroup,
  Layer,
  map,
} from 'leaflet'
import 'leaflet/dist/leaflet.css'

import L from 'leaflet'

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png',
})

interface MapCardProps {
  className?: string
  selectedEvent?: string
  location?: { lat: number; lng: number }
}

function MapCard({ className, selectedEvent, location }: MapCardProps) {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [activeLayer, setActiveLayer] = useState<Layer | null>()
  const cardRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<leafletMap | null>(null)

  useEffect(() => {
    const updateDimensions = () => {
      if (cardRef.current) {
        const { width, height } = cardRef.current.getBoundingClientRect()
        console.log('height', height)
        if (height < 200) {
          setDimensions({ width, height: 500 })
        } else {
          setDimensions({ width, height: height - 60 })
        }
      }
    }

    updateDimensions()
  }, [])

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.invalidateSize()
    }
  }, [dimensions])

  useEffect(() => {
    if (mapRef.current && selectedEvent) {
      if (activeLayer) {
        mapRef.current.removeLayer(activeLayer)
      }

      if (selectedEvent === '1') {
        const layerGroup = new L.LayerGroup([
          new L.Circle([51.505, -0.09], { radius: 200, color: 'blue' }),
        ])
        mapRef.current.addLayer(layerGroup)
        setActiveLayer(layerGroup)
      } else if (selectedEvent === '2') {
        const layerGroup = new L.LayerGroup([
          new L.Circle([51.51, -0.1], { radius: 150, color: 'green' }),
        ])
        mapRef.current.addLayer(layerGroup)
        setActiveLayer(layerGroup)
      }
    }
  }, [selectedEvent])

  return (
    <Card className={`${className} card-container`} ref={cardRef}>
      <CardHeader className="p-5"></CardHeader>
      <CardContent
        style={{ height: `${dimensions.height}px`, maxHeight: '80vh' }}
      >
        <MapContainer
          center={
            location ? [location.lat, location.lng] : [-33.0472, -71.6127]
          }
          zoom={13}
          scrollWheelZoom={false}
          style={{ height: '100%', width: '100%' }}
          ref={mapRef}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            accessToken="TILE_LAYER_ACCESS"
          />
          <LayersControl position="topright">
            <LayersControl.BaseLayer name="Marker with popup">
              <Marker position={[51.505, -0.09]}>
                <Popup>
                  A pretty CSS3 popup. <br /> Easily customizable.
                </Popup>
              </Marker>
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer name="Layer group with circles">
              <LayerGroup>
                <Circle
                  center={[51.505, -0.09]}
                  pathOptions={{ fillColor: 'blue' }}
                  radius={200}
                  key={'CIRCLE1'}
                />
                <Circle
                  center={[51.505, -0.09]}
                  pathOptions={{ fillColor: 'red' }}
                  radius={100}
                  stroke={false}
                  key={'CIRCLE2'}
                />
                <LayerGroup>
                  <Circle
                    center={[51.51, -0.08]}
                    pathOptions={{ color: 'green', fillColor: 'green' }}
                    radius={100}
                    key={'CIRCLE3'}
                  />
                </LayerGroup>
              </LayerGroup>
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer name="Feature group">
              <FeatureGroup pathOptions={{ color: 'purple' }}>
                <Popup>Popup in FeatureGroup</Popup>
                <Circle center={[51.51, -0.06]} radius={200} />
                <Rectangle
                  bounds={[
                    [51.49, -0.08],
                    [51.5, -0.06],
                  ]}
                />
              </FeatureGroup>
            </LayersControl.BaseLayer>
          </LayersControl>
          {/* <MapLogics /> */}
        </MapContainer>
      </CardContent>
    </Card>
  )
}

export default MapCard
