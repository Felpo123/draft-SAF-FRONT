import React from 'react'

interface InfraestructureData {
    id: number
    entity: string,
    quantity: number,
    icon: string,
    color: string
}

interface InfraestructureCardProps {
    infraestructureData: InfraestructureData[]
}

function InfraestructureCard({ infraestructureData }: InfraestructureCardProps) {
    return (
        <div
            className="absolute bottom-16 left-1/2 transform -translate-x-1/2  p-4 flex space-x-4 "
        >
            <div className='grid grid-cols-4 grid-rows-2 gap-4 '>
                {infraestructureData.map(({ color, entity, icon, id, quantity }) => (
                    <div key={id} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg shadow-sm w-full max-w-sm">
                        <div>
                            <p className="text-sm font-medium text-gray-900">{entity}</p>
                            <p className="text-2xl font-bold text-gray-900">{quantity}</p>
                        </div>

                        <div className={`p-2 rounded-full ${color}`}>
                            {icon}
                        </div>

                    </div>
                ))}
            </div>

        </div>
    )
}

export default InfraestructureCard