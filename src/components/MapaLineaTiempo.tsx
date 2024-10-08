import { useEffect, useRef, useState } from 'react'
import maplibregl, { Map } from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import proj4 from 'proj4'
import './Timeline.css' // Asegúrate de crear este archivo CSS
import Timeline from './TimelineMapBar'

export interface Geojson {
  type: string
  features: Feature[]
}

export interface Feature {
  type: string
  geometry: Geometry
  properties: Properties
}

export interface Geometry {
  type: string
  coordinates: Array<number[] | number>
}

export interface Properties {
  prop0: string
  prop1?: number
}

export default function MapComponent({ initialIncidentId }) {
  // Recibe el ID inicial como prop
  const mapContainer = useRef<Map>(null)
  const mapRef = useRef(null)
  const geojsonDataRef = useRef(null)
  const [dates, setDates] = useState([]) // Almacena las fechas
  const [currentIndex, setCurrentIndex] = useState(0) // Índice de la fecha actual
  const [selectedIncidente, setSelectedIncidente] = useState(
    initialIncidentId || '',
  ) // Almacena el incidente seleccionado
  const [incidentes, setIncidentes] = useState([]) // Almacena los IDs de los incidentes

  // Función para extraer fechas e IDs
  const extractDatesAndIds = (geojsonData: Geojson) => {
    const fechasUnicas = []
    const incidentesUnicos = []

    geojsonData.features.forEach((feature) => {
      const fecha = feature.properties.date
      const idEvento = feature.properties.id_evento

      if (fecha && !fechasUnicas.includes(fecha)) {
        fechasUnicas.push(fecha)
      }

      if (idEvento && !incidentesUnicos.includes(idEvento)) {
        incidentesUnicos.push(idEvento)
      }
    })

    return { fechasUnicas: fechasUnicas.sort(), incidentesUnicos }
  }

  useEffect(() => {
    if (!mapRef.current) {
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
        center: [-71.6, -33.04],
        zoom: 10,
      })

      mapRef.current.on('load', () => {
        fetchData()
      })
    }

    const fetchData = async () => {
      const wfsUrl =
        'geoserver/desafio/wfs?service=WFS&version=1.0.0&request=GetFeature&typeName=desafio:incidentes&outputFormat=application/json'
      try {
        const response = await fetch(wfsUrl)
        if (!response.ok) {
          throw new Error(
            `Error en la respuesta del servidor: ${response.statusText}`,
          )
        }

        const data = (await response.json()) as Geojson
        console.log('Datos GeoJSON obtenidos:', data)

        if (data && data.features && data.features.length > 0) {
          const transformedData = transformGeojson(data)
          geojsonDataRef.current = transformedData

          // Extraer fechas e ids de los datos
          const extractedData = extractDatesAndIds(transformedData)
          setIncidentes(extractedData.incidentesUnicos) // Establecer los incidentes únicos
          setDates(extractedData.fechasUnicas) // Establecer fechas únicas y ordenadas

          updateMapWithGeojson(transformedData)

          // Si hay un ID de incidente inicial, cargar los datos relacionados
          if (initialIncidentId) {
            handleIncidenteChange({ target: { value: initialIncidentId } })
          }
        } else {
          console.warn('El GeoJSON no contiene características válidas:', data)
        }
      } catch (error) {
        console.error('Error al obtener los datos WFS:', error)
      }
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
      }
    }
  }, [initialIncidentId]) // Agregar initialIncidentId como dependencia

  const updateMapWithGeojson = (geojsonData: Geojson) => {
    if (mapRef.current) {
      if (!mapRef.current.getSource('geojson-source')) {
        mapRef.current.addSource('geojson-source', {
          type: 'geojson',
          data: geojsonData,
        })

        mapRef.current.addLayer({
          id: 'polygons-layer',
          type: 'fill',
          source: 'geojson-source',
          paint: {
            'fill-color': '#007cbf',
            'fill-opacity': 0.6,
          },
        })

        mapRef.current.addLayer({
          id: 'polygon-borders',
          type: 'line',
          source: 'geojson-source',
          paint: {
            'line-color': '#ffffff',
            'line-width': 2,
          },
        })
      } else {
        mapRef.current.getSource('geojson-source').setData(geojsonData)
      }
    }
  }

  const handleIncidenteChange = (event) => {
    const newId = event.target.value
    setSelectedIncidente(newId)

    // Filtrar datos por el ID del evento seleccionado
    const filteredData = {
      ...geojsonDataRef.current,
      features: geojsonDataRef.current.features.filter(
        (feature) => feature.properties.id_evento === newId,
      ),
    }

    // Actualizar el mapa con los datos filtrados
    updateMapWithGeojson(filteredData)

    // Extraer fechas e ids del incidente seleccionado
    const extractedData = extractDatesAndIds(filteredData)
    setDates(extractedData.fechasUnicas) // Establecer fechas para el incidente seleccionado
    setCurrentIndex(0) // Reiniciar el índice de la fecha
  }

  const getCentroid = (coordinates) => {
    const flatCoords = coordinates.flat(2)
    const lonSum = flatCoords.reduce((sum, coord) => sum + coord[0], 0)
    const latSum = flatCoords.reduce((sum, coord) => sum + coord[1], 0)
    const len = flatCoords.length
    return [lonSum / len, latSum / len] // Retorna el centroide [lng, lat]
  }

  const handleDateChange = (newIndex) => {
    setCurrentIndex(newIndex)

    const selectedDate = dates[newIndex]
    const filteredData = {
      ...geojsonDataRef.current,
      features: geojsonDataRef.current.features.filter(
        (feature) =>
          new Date(feature.properties.date).toISOString().slice(0, 10) ===
          new Date(selectedDate).toISOString().slice(0, 10),
      ),
    }

    // Si hay un polígono coincidente, centrar el mapa en su centroide
    const matchingFeature = filteredData.features[0] // Obtener el primer polígono correspondiente a la fecha
    if (matchingFeature) {
      const centroid = getCentroid(matchingFeature.geometry.coordinates)
      mapRef.current.flyTo({ center: centroid, zoom: 10 })
    }

    updateMapWithGeojson(filteredData)
  }

  return (
    <div>
      {/* Selector de incidentes */}
      <div>
        <label>Seleccione un incidente:</label>
        <select value={selectedIncidente} onChange={handleIncidenteChange}>
          <option value="">Seleccione</option>
          {incidentes.length > 0 ? (
            incidentes.map((id) => (
              <option key={id} value={id}>
                Incidente {id}
              </option>
            ))
          ) : (
            <option value="">No hay incidentes disponibles</option>
          )}
        </select>
      </div>

      {/* Línea de tiempo visual */}
      <div className="timeline-container">
        {dates.map((date, index) => (
          <>
            {index > 0 && <div className="h-1 w-12 bg-gray-900 -mt-6"></div>}

            <div
              key={index}
              className={`timeline-item ${currentIndex === index ? 'active' : ''}`}
              onClick={() => handleDateChange(index)}
            >
              <div className="timeline-dot" />
              <div className="timeline-date">{date}</div>
            </div>
          </>
        ))}
      </div>

      <div ref={mapContainer} style={{ width: '100%', height: '100vh' }} />
    </div>
  )
}
