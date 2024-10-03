import React from 'react'
import BarChartToMap from './BarChartToMap'

function GraphsCard() {
    return (
        <div>
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 p-4 flex space-x-4 bg-white rounded-sm ">
                <BarChartToMap />
            </div>
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 p-4 flex space-x-4 bg-white rounded-sm">
                <BarChartToMap />
            </div>
        </div>
    )
}

export default GraphsCard