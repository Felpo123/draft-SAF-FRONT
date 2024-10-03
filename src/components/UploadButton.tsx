'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import { Upload } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export default function UploadButton() {
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const { toast } = useToast()

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile)
    } else {
      toast({
        title: 'Error',
        description: 'Por favor, seleccione un archivo PDF válido.',
        variant: 'destructive',
      })
    }
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const droppedFile = event.dataTransfer.files[0]
    if (droppedFile && droppedFile.type === 'application/pdf') {
      setFile(droppedFile)
    } else {
      toast({
        title: 'Error',
        description: 'Por favor, arrastre un archivo PDF válido.',
        variant: 'destructive',
      })
    }
  }

  const handleUpload = () => {
    if (file) {
      // Simular carga al servidor
      toast({
        title: 'Cargando',
        description: 'Subiendo archivo...',
      })
      setTimeout(() => {
        toast({
          title: 'Éxito',
          description: `Archivo "${file.name}" cargado correctamente.`,
        })
        setFile(null)
        setIsUploadOpen(false)
      }, 1500)
    } else {
      toast({
        title: 'Error',
        description: 'Por favor, seleccione un archivo PDF antes de cargar.',
        variant: 'destructive',
      })
    }
  }

  return (
    <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
      <DialogTrigger asChild>
        <Button
          aria-label="Upload"
          className="p-2 hover:bg-gray-200 rounded"
          variant="outline"
        >
          <Upload size={20} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Subir Archivo PDF</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div
            className="flex items-center justify-center w-full"
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
          >
            <label
              htmlFor="dropzone-file"
              className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" />
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Haz clic para subir</span> o
                  arrastra y suelta
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Solo archivos PDF
                </p>
              </div>
              <input
                id="dropzone-file"
                type="file"
                className="hidden"
                accept=".pdf"
                onChange={handleFileChange}
              />
            </label>
          </div>
          {file && (
            <div className="text-sm text-gray-500">
              Archivo seleccionado: {file.name}
            </div>
          )}
        </div>
        <DialogFooter>
          <Button onClick={handleUpload} disabled={!file}>
            Cargar PDF
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
