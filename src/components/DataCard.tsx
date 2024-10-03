import React from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card'

interface DataCardProps {
  title: string
  icon: React.ReactNode
  children: React.ReactNode
  classname?: string
}

const DataCard: React.FC<DataCardProps> = ({
  title,
  icon,
  children,
  classname,
}) => {
  return (
    <Card className={`flex flex-col ${classname}`}>
      <CardHeader className="flex-shrink-0 flex flex-row space-y-0 p-1 ">
        <CardTitle className="text-sm font-medium text-center flex-1">
          {title}
        </CardTitle>
        <div className="ml-auto">{icon}</div>
      </CardHeader>
      <CardContent className="p-0 flex-grow flex items-center justify-center">
        {children}
      </CardContent>
      <CardFooter className="p-0 w-full">
        <p className="text-right text-xs text-gray-300 whitespace-nowrap p-1">
          hace 2 min
        </p>
      </CardFooter>
    </Card>
  )
}

export default DataCard
