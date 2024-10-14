import React from 'react'
import { BarChart } from './BarraChart'

const chartdata = [
  {
    category: 'Total Personas',
    value: 143.2,
  },
  {
    category: 'Hombre',
    value: 82.5,
  },
  {
    category: 'Mujeres',
    value: 60.6,
  },
  {
    category: '0 a 5 años',
    value: 8.3,
  },
  {
    category: '6 a 14 años',
    value: 13.5,
  },
  {
    category: '15 a 64 años',
    value: 105,
  },
  {
    category: '65 años o más',
    value: 13.6,
  },
  {
    category: 'Migrantes',
    value: 1.1,
  },
  {
    category: 'Pueblo Indígena',
    value: 7.6,
  },
  {
    category: 'Hogares',
    value: 37.9,
  },
]

function BarChartToMap() {
  return (
    <BarChart
      className="sm:h-[500px] sm:w-[350px] h-[400px] w-[300px]"
      data={chartdata}
      index="category"
      categories={['value']}
      valueFormatter={(number: number) =>
        `$${Intl.NumberFormat('us').format(number).toString()}`
      }
      layout="vertical"
    />
  )
}

export default BarChartToMap
