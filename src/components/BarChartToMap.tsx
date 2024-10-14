import React from 'react';
import { BarChart } from './BarraChart';

const chartdata = [
  { category: 'Total Personas', value: 143.2 },
  { category: 'Hombre', value: 82.5 },
  { category: 'Mujeres', value: 60.6 },
  { category: '0 a 5 años', value: 8.3 },
  { category: '6 a 14 años', value: 13.5 },
  { category: '15 a 64 años', value: 105 },
  { category: '65 años o más', value: 13.6 },
  { category: 'Migrantes', value: 1.1 },
  { category: 'Pueblo Indígena', value: 7.6 },
  { category: 'Hogares', value: 37.9 },
];

function BarChartToMap() {
  return (
    <div className="p-4 bg-white rounded-md shadow-lg flex flex-col items-center border">
      <h2 className="text-lg font-semibold mb-4 text-center text-gray-700">
        Distribución Demográfica
      </h2>
      <BarChart
        className="xl:h-[500px] xl:w-[400px] sm:h-[400px] sm:w-[300px] h-[300px] w-[250px]"
        data={chartdata}
        colors={['blue']} // Color azul suave
        index="category"
        categories={['value']}
        valueFormatter={(number: number) =>
          `${Intl.NumberFormat('us').format(number)}`
        }
        layout="vertical"
        yAxisLabel="Personas"
        yAxisWidth={60}
        xAxisLabel="Cantidad"
      />
    </div>
  );
}

export default BarChartToMap;
