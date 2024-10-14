'use client'
import { useEffect, useRef, useState } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import proj4 from 'proj4'
import './Timeline.css' // Asegúrate de crear este archivo CSS

export default function MapComponent({ initialIncidentId }) {
  // Recibe el ID inicial como prop
  const mapContainer = useRef(null)
  const mapRef = useRef(null)
  const geojsonDataRef = useRef(null)
  const [dates, setDates] = useState([]) // Almacena las fechas
  const [currentIndex, setCurrentIndex] = useState(0) // Índice de la fecha actual
  const [provincias, setProvincias] = useState([]) // Almacena las provincias disponibles
  const [selectedProvincia, setSelectedProvincia] = useState('') // Provincia seleccionada
  const [superficieTotal, setSuperficieTotal] = useState(0) // Nueva variable para la suma de superf

  // Función para extraer fechas y provincias únicas
  const extractDatesAndProvincias = (geojsonData) => {
    const fechasUnicas = []
    const provinciasUnicas = new Set()

    geojsonData.features.forEach((feature) => {
      const fecha = feature.properties.date
      const provincia = feature.properties.nom_pro // Utilizamos nom_pro para la provincia

      if (fecha && !fechasUnicas.includes(fecha)) {
        fechasUnicas.push(fecha)
      }

      if (provincia) {
        provinciasUnicas.add(provincia)
      }
    })

    // Ordenar las fechas en orden descendente (más reciente primero)
    fechasUnicas.sort((a, b) => new Date(b) - new Date(a))

    return { fechasUnicas, provinciasUnicas: Array.from(provinciasUnicas) }
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
      const filter = `<Filter><PropertyIsEqualTo><PropertyName>id_evento</PropertyName><Literal>${initialIncidentId}</Literal></PropertyIsEqualTo></Filter>`
      const encodedFilter = encodeURIComponent(filter)
      const wfsUrl = `geoserver/desafio/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=desafio:incidentes&outputFormat=application/json&filter=${encodedFilter}`
      try {
        const response = await fetch(wfsUrl)
        if (!response.ok) {
          throw new Error(
            `Error en la respuesta del servidor: ${response.statusText}`,
          )
        }

        const data = await response.json()
        console.log('Datos GeoJSON obtenidos:', data)

        if (data && data.features && data.features.length > 0) {
          const transformedData = transformGeojson(data)
          geojsonDataRef.current = transformedData

          // Extraer fechas y provincias de los datos
          const extractedData = extractDatesAndProvincias(transformedData)
          setDates(extractedData.fechasUnicas)
          setProvincias(['Todo el desastre', ...extractedData.provinciasUnicas]) // Agregar opción "Todo el desastre"
          setSelectedProvincia('Todo el desastre') // Seleccionar "Todo el desastre" por defecto

          updateMapWithGeojson(transformedData)

          // Si hay un ID de incidente inicial, cargar los datos relacionados
          if (initialIncidentId) {
            handleIncidenteChange(
              { target: { value: initialIncidentId } },
              true,
            ) // Pasar flag para seleccionar la fecha más reciente
          }
        } else {
          console.warn('El GeoJSON no contiene características válidas:', data)
        }
      } catch (error) {
        console.error('Error al obtener los datos WFS:', error)
      }
    }

    const transformGeojson = (geojsonData) => {
      if (geojsonData && geojsonData.features) {
        const transformedFeatures = geojsonData.features.map((feature) => {
          const geometry = feature.geometry
          if (geometry.type === 'Polygon' || geometry.type === 'MultiPolygon') {
            const transformedCoordinates = geometry.coordinates.map(
              (coords) => {
                return coords.map((coordArray) => {
                  return coordArray.map((coord) => {
                    const transformedCoord = proj4('EPSG:3857', 'EPSG:4326', [
                      coord[0],
                      coord[1],
                    ])
                    return transformedCoord
                  })
                })
              },
            )

            return {
              ...feature,
              geometry: {
                ...geometry,
                coordinates: transformedCoordinates,
              },
            }
          }
          return feature
        })

        return {
          ...geojsonData,
          features: transformedFeatures,
        }
      }
      return geojsonData
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
      }
    }
  }, [initialIncidentId]) // Agregar initialIncidentId como dependencia

  const updateMapWithGeojson = (geojsonData) => {
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

  const handleProvinciaChange = (event) => {
    const provincia = event.target.value
    setSelectedProvincia(provincia)

    // Filtrar datos solo si no se ha seleccionado "Todo el desastre"
    if (provincia === 'Todo el desastre') {
      updateMapWithGeojson(geojsonDataRef.current) // Mostrar todos los datos
    } else {
      // Filtrar datos por la provincia seleccionada
      const filteredData = {
        ...geojsonDataRef.current,
        features: geojsonDataRef.current.features.filter(
          (feature) => feature.properties.nom_pro === provincia,
        ),
      }

      // Actualizar el mapa con los datos filtrados
      updateMapWithGeojson(filteredData)
    }
  }

  const handleDateChange = (newIndex) => {
    setCurrentIndex(newIndex)

    const selectedDate = dates[newIndex]

    // Filtrar los datos para la fecha y provincia seleccionada (o todo el desastre)
    const filteredData = {
      ...geojsonDataRef.current,
      features: geojsonDataRef.current.features.filter(
        (feature) =>
          new Date(feature.properties.date).toISOString().slice(0, 10) ===
            new Date(selectedDate).toISOString().slice(0, 10) &&
          (selectedProvincia === 'Todo el desastre' ||
            feature.properties.nom_pro === selectedProvincia),
      ),
    }

    // Calcular la suma de la superficie ("superf") para la fecha seleccionada
    const superficieSum = filteredData.features.reduce(
      (sum, feature) => sum + (feature.properties.superf || 0),
      0,
    )
    setSuperficieTotal(superficieSum) // Actualizar el estado con la suma de superficies

    // Si hay un polígono coincidente, centrar el mapa en su centroide
    const matchingFeature = filteredData.features[0] // Obtener el primer polígono correspondiente a la fecha
    if (matchingFeature) {
      const centroid = getCentroid(matchingFeature.geometry.coordinates)
      mapRef.current.flyTo({ center: centroid, zoom: 10 })
    }

    updateMapWithGeojson(filteredData)
  }

  const getCentroid = (coordinates) => {
    const flatCoords = coordinates.flat(2)
    const lonSum = flatCoords.reduce((sum, coord) => sum + coord[0], 0)
    const latSum = flatCoords.reduce((sum, coord) => sum + coord[1], 0)
    const len = flatCoords.length
    return [lonSum / len, latSum / len] // Retorna el centroide [lng, lat]
  }

  return (
    <div>
      {/* Selector de provincia */}
      <div>
        <label htmlFor="provinciaSelect">Filtrar por Provincia:</label>
        <select
          id="provinciaSelect"
          value={selectedProvincia}
          onChange={handleProvinciaChange}
        >
          {provincias.map((provincia) => (
            <option key={provincia} value={provincia}>
              {provincia}
            </option>
          ))}
        </select>
      </div>

      {/* Mostrar la suma de la superficie */}
      <div>
        <strong>Superficie total: </strong>
        {superficieTotal} km²
      </div>

      {/* Línea de tiempo visual */}
      <div className="timeline-container">
        {dates.map((date, index) => (
          <div
            key={index}
            className={`timeline-item ${currentIndex === index ? 'active' : ''}`}
            onClick={() => handleDateChange(index)}
          >
            <div className="timeline-dot" />
            <div className="timeline-date">{date}</div>
          </div>
        ))}
      </div>

      <div ref={mapContainer} style={{ width: '100%', height: '100vh' }} />
    </div>
  )
}
