import { Card, CardContent, CardHeader, CardTitle } from './ui/card'

export default function StreamlitEmbed({ className }: MapCardProps) {
  return (
    <Card className={`${className}  `}>
      <CardHeader>
        <CardTitle>LeafMAP STREAMLIT</CardTitle>
      </CardHeader>
      <CardContent>
        <iframe
          src="http://localhost:8501"
          width="100%"
          height="800px"
          style={{ border: 'none', overflow: 'hidden' }}
        ></iframe>
      </CardContent>
    </Card>
  )
}

interface MapCardProps {
  className?: string
}
