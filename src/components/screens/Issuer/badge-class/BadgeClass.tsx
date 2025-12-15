import React from 'react'
import { Button } from '../../../ui/button'
import { Card, CardContent } from '../../../ui/card'
import logo1 from '@/assets/cloudP.png'
import logo2 from '@/assets/cloudE.png'
import logo3 from '@/assets/netC.png'


const certificates = [
  {
    id: 1,
    title: "Cloud Practitioner",
    image: logo1,
  },
  {
    id: 2,
    title: "Networking Core",
    image: logo2,
  },
  {
    id: 3,
    title: "Cloud Economics",
    image: logo3,
  },
  {
    id: 4,
    title: "XYZ",
    image: logo1,
  },
]

const BadgeClass = () => {
  return (
    <div>
      {/* Header */}
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-bold">Certificate Classes</h2>
        <Button>Create Class</Button>
      </div>

      <div className="space-y-4">
        {certificates.map((cert) => (
          <Card key={cert.id} className="rounded-2xl bg-card text-card-foreground">
            <CardContent className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4">
              <div className="flex items-center gap-4">
                <img
                  src={cert.image}
                  alt={cert.title}
                  className="w-32 h-32 rounded-md object-contain"
                />
                <div>
                  <h3 className="text-lg font-medium">{cert.title}</h3>
                  <Button
                    variant="ghost"
                    className="p-0 h-auto text-sm text-primary hover:underline"
                  >
                    Duplicate
                  </Button>
                </div>
              </div>

              {/* Right side */}
              <div className="flex gap-3">
                <Button
                  variant="ghost"
                  className="text-destructive hover:bg-destructive/10"
                >
                  Delete
                </Button>
                <Button variant="outline" className="border-border text-primary">
                  Preview
                </Button>
              </div>
            </CardContent>
          </Card>

        ))}
      </div>
    </div>
  )
}

export default BadgeClass
