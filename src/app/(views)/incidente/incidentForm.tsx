'use client'

import { useState, useEffect } from 'react'
import {
  MapContainer,
  TileLayer,
  Marker,
  Circle,
  useMapEvents,
} from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { z } from 'zod'
import { Incident } from '@/lib/data'

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png',
})

// Define the zones, origins, and incident types
const zones = ['Continental', 'Insular', 'Antartica'] as const
const origins = [
  'Sin informacion',
  'Antropico',
  'Biologico',
  'Natural',
] as const
const incidentTypes = [
  'Incendios',
  'Inundaciones',
  'Remociones en masa',
  'Terremotos',
  'Tsunamis',
] as const

// Zod schema for form validation
const formSchema = z.object({
  datetime: z.string().min(1, { message: 'Fecha y hora es requerido' }),
  name: z.string().min(1, { message: 'Nombre del incidente es requerido' }),
  zone: z.enum(zones, {
    errorMap: () => ({ message: 'Zona del incidente es requerida' }),
  }),
  origin: z.enum(origins, {
    errorMap: () => ({ message: 'Origen del incidente es requerido' }),
  }),
  incidentType: z.enum(incidentTypes, {
    errorMap: () => ({ message: 'Tipo de incidente es requerido' }),
  }),
  subcategory: z.string().optional(),
  description: z.string().min(1, { message: 'Descripción es requerida' }),
  radius: z
    .number()
    .min(0, { message: 'El radio debe ser un número positivo' }),
})

// Infer the type from the schema
type FormData = z.infer<typeof formSchema>

// Define the type for errors
type FormErrors = {
  [K in keyof FormData]?: string
}

interface MapEventsProps {
  onLocationSelected: (latlng: L.LatLng) => void
}

function MapEvents({ onLocationSelected }: MapEventsProps) {
  useMapEvents({
    click(e) {
      onLocationSelected(e.latlng)
    },
  })
  return null
}

interface IncidentFormProps {
  action?: string
  incident?: Incident
}

export default function IncidentForm({ action, incident }: IncidentFormProps) {
  const [formData, setFormData] = useState<FormData>({
    datetime: incident?.ultima_actualizacion || '',
    name: incident?.nombre || '',
    zone: incident?.zona || ('' as FormData['zone']),
    origin: incident?.origen || ('' as FormData['origin']),
    incidentType: incident?.tipo || ('' as FormData['incidentType']),
    subcategory: '',
    description: '',
    radius: 50,
  })
  const initialLocation = incident?.coordenada
    ? new L.LatLng(incident.coordenada.lat, incident.coordenada.lng)
    : null

  const [location, setLocation] = useState<L.LatLng | null>(initialLocation)
  const [isFormValid, setIsFormValid] = useState<boolean>(false)
  const [errors, setErrors] = useState<FormErrors>({})

  const handleLocationSelected = (latlng: L.LatLng) => {
    setLocation(latlng)
  }

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === 'radius' ? parseFloat(value) || 0 : value,
    }))
  }

  useEffect(() => {
    const validateForm = () => {
      try {
        formSchema.parse(formData)
        setErrors({})
        setIsFormValid(location !== null)
      } catch (error) {
        if (error instanceof z.ZodError) {
          const newErrors: FormErrors = {}
          error.errors.forEach((err) => {
            if (err.path[0]) {
              newErrors[err.path[0] as keyof FormData] = err.message
            }
          })
          setErrors(newErrors)
          setIsFormValid(false)
        }
      }
    }

    validateForm()
  }, [formData, location])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (isFormValid && location) {
      const alertMessage = `
        Fecha y hora: ${formData.datetime}
        Nombre: ${formData.name}
        Zona: ${formData.zone}
        Origen: ${formData.origin}
        Tipo de incidente: ${formData.incidentType}
        Subcategoría: ${formData.subcategory || 'No especificada'}
        Descripción: ${formData.description}
        Radio: ${formData.radius} km
        Coordenadas: ${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}
      `
      alert(alertMessage)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6">
          <h1 className="text-2xl font-bold mb-6">Registro de Incidente</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="datetime"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Fecha y hora del incidente
              </label>
              <input
                type="datetime-local"
                id="datetime"
                name="datetime"
                value={formData.datetime}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.datetime ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.datetime && (
                <p className="mt-1 text-xs text-red-500">{errors.datetime}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Nombre del incidente
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-500">{errors.name}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="zone"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Zona del incidente
              </label>
              <select
                id="zone"
                name="zone"
                value={formData.zone}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.zone ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Seleccione una zona</option>
                {zones.map((zone) => (
                  <option key={zone} value={zone}>
                    {zone}
                  </option>
                ))}
              </select>
              {errors.zone && (
                <p className="mt-1 text-xs text-red-500">{errors.zone}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="origin"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Origen del incidente
              </label>
              <select
                id="origin"
                name="origin"
                value={formData.origin}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.origin ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Seleccione un origen</option>
                {origins.map((origin) => (
                  <option key={origin} value={origin}>
                    {origin}
                  </option>
                ))}
              </select>
              {errors.origin && (
                <p className="mt-1 text-xs text-red-500">{errors.origin}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="incidentType"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Tipo de incidente
              </label>
              <select
                id="incidentType"
                name="incidentType"
                value={formData.incidentType}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.incidentType ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Seleccione un tipo</option>
                {incidentTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              {errors.incidentType && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.incidentType}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="subcategory"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Subcategoría del incidente
              </label>
              <select
                id="subcategory"
                name="subcategory"
                value={formData.subcategory}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Sin opciones por el momento</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Descripción del incidente
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
              ></textarea>
              {errors.description && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.description}
                </p>
              )}
            </div>
          </div>
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-4">
              Ubicación del Incidente
            </h2>
            <MapContainer
              center={
                location ? [location.lat, location.lng] : [-33.0472, -71.6127]
              }
              zoom={10}
              style={{ height: '400px', width: '100%' }}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <MapEvents onLocationSelected={handleLocationSelected} />
              {location && (
                <>
                  <Marker position={[location.lat, location.lng]} />
                  <Circle
                    center={[location.lat, location.lng]}
                    radius={formData.radius * 1000} // Convert km to meters
                    pathOptions={{ color: 'red', fillColor: 'red' }}
                  />
                </>
              )}
            </MapContainer>
            {location ? (
              <p className="mt-2 text-sm text-gray-600">
                Coordenadas seleccionadas: {location.lat.toFixed(4)},{' '}
                {location.lng.toFixed(4)}
              </p>
            ) : (
              <p className="mt-2 text-sm text-red-500">
                Por favor, seleccione una ubicación en el mapa
              </p>
            )}
          </div>
          <div className="mt-4">
            <label
              htmlFor="radius"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Radio del Incidente (KM)
            </label>
            <input
              type="number"
              id="radius"
              name="radius"
              value={formData.radius}
              onChange={handleInputChange}
              min="0"
              step="1"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.radius ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.radius && (
              <p className="mt-1 text-xs text-red-500">{errors.radius}</p>
            )}
          </div>
          <div className="mt-6">
            <button
              type="submit"
              disabled={!isFormValid}
              className={`w-full px-4 py-2 text-white font-semibold rounded-md ${
                isFormValid
                  ? 'bg-blue-500 hover:bg-blue-600'
                  : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              {action === 'create'
                ? 'Registrar Incidente'
                : 'Actualizar Incidente'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
