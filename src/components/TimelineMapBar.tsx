'use client'
import { useToast } from '@/hooks/use-toast'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

interface TimelineMapBarProps {
  dates: string[]
  selectedDate: string
  handleDateSelect: (date: string) => void
}

const Timeline = ({
  dates,
  selectedDate,
  handleDateSelect,
}: TimelineMapBarProps) => {
  const { toast } = useToast()

  useEffect(() => {
    if (!dates.includes(selectedDate)) {
      toast({
        title: 'Info',
        description: `El incidente seleccionado no tiene datos para esta fecha, se seleccionará la fecha más cercana. (${dates[0]})`,
        variant: 'default',
      })
      handleDateSelect(dates[0])
    }
  }, [dates])


  return (
    <div className="absolute sm:top-4 sm:left-4 top-0 left-0 p-2 max-sm:w-1/4" style={{ zIndex: 1000 }}>
      <div className="flex items-center space-x-2 ">
        {dates.map((date, index) => (
          <React.Fragment key={date}>
            {index > 0 && <div className="h-1 w-12 bg-gray-900 -mt-5"></div>}
            <div className="flex flex-col items-center gap-1">
              <button
                onClick={() => handleDateSelect(date)}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${selectedDate === date
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
              >
                {index + 1}
              </button>
              <p className="text-sm font-semibold text-center mt-1 hidden sm:block">{date}</p>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}

export default Timeline
