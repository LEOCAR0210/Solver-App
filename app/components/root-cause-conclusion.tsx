"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle2, ChevronRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { ExpertOpinions } from "@/components/expert-opinions"

// Añadir la definición de tipos para las props
export default function RootCauseConclusion({ problem, rootCauses }) {
  const [finalConclusion, setFinalConclusion] = useState("")

  // Asegurarse de que se muestre una conclusión final con la causa raíz consolidada

  // Añadir expertos para la conclusión
  const conclusionExperts = [
    {
      id: 1,
      name: "Dr. Alejandro Morales",
      role: "Director de Ingeniería Industrial",
      avatar: "/placeholder.svg?height=40&width=40",
      opinion:
        "Después de analizar los resultados de todas las metodologías, concluyo que la causa raíz principal es la falta de un sistema integrado de gestión de mantenimiento y capacitación. Recomiendo implementar un programa que combine ambos aspectos.",
    },
    {
      id: 2,
      name: "Ing. Gabriela Fuentes",
      role: "Consultora Senior en Mejora de Procesos",
      avatar: "/placeholder.svg?height=40&width=40",
      opinion:
        "Los análisis muestran un patrón claro: la comunicación deficiente entre departamentos y la falta de procedimientos estandarizados son las causas fundamentales. Sugiero priorizar la implementación de un sistema de gestión visual y reuniones interdepartamentales diarias.",
    },
  ]

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Conclusión de Causa Raíz</CardTitle>
          <CardDescription>
            Análisis consolidado de las causas raíz identificadas por las diferentes metodologías
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Problema: {problem.title}</h3>
            <p className="text-sm text-muted-foreground">{problem.description}</p>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Diagrama de Ishikawa</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-3 bg-muted/20 rounded-md">
                    {rootCauses.ishikawa ? (
                      <p className="text-sm">{rootCauses.ishikawa}</p>
                    ) : (
                      <p className="text-sm text-muted-foreground italic">
                        No se ha registrado una causa raíz para esta metodología.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Análisis 5 Por qué</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-3 bg-muted/20 rounded-md">
                    {rootCauses.fiveWhys ? (
                      <p className="text-sm">{rootCauses.fiveWhys}</p>
                    ) : (
                      <p className="text-sm text-muted-foreground italic">
                        No se ha registrado una causa raíz para esta metodología.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Análisis de Pareto</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-3 bg-muted/20 rounded-md">
                    {rootCauses.pareto ? (
                      <p className="text-sm">{rootCauses.pareto}</p>
                    ) : (
                      <p className="text-sm text-muted-foreground italic">
                        No se ha registrado una causa raíz para esta metodología.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Análisis FMEA</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-3 bg-muted/20 rounded-md">
                    {rootCauses.fmea ? (
                      <p className="text-sm">{rootCauses.fmea}</p>
                    ) : (
                      <p className="text-sm text-muted-foreground italic">
                        No se ha registrado una causa raíz para esta metodología.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="p-4 border rounded-md bg-green-50 border-green-200">
              <div className="flex items-center mb-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 mr-2" />
                <h3 className="text-md font-medium text-green-800">Conclusión final de causa raíz</h3>
              </div>

              <Textarea
                placeholder="Basado en los análisis realizados, la causa raíz del problema es..."
                value={finalConclusion}
                onChange={(e) => setFinalConclusion(e.target.value)}
                rows={4}
                className="mb-3 border-green-200 focus-visible:ring-green-500"
              />

              <div className="bg-white p-4 rounded-md border border-green-200">
                <h4 className="text-sm font-medium text-green-800 mb-2">Análisis del equipo experto</h4>
                <p className="text-sm text-green-700 mb-3">
                  Basado en los resultados de las diferentes metodologías, el equipo de expertos ha identificado los
                  siguientes patrones comunes:
                </p>

                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
                      Patrón 1
                    </Badge>
                    <p className="text-sm">Falta de procedimientos estandarizados para la calibración de equipos</p>
                  </div>

                  <div className="flex items-start gap-2">
                    <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
                      Patrón 2
                    </Badge>
                    <p className="text-sm">
                      Deficiencias en la capacitación del personal en áreas técnicas específicas
                    </p>
                  </div>

                  <div className="flex items-start gap-2">
                    <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
                      Patrón 3
                    </Badge>
                    <p className="text-sm">
                      Comunicación insuficiente entre departamentos de producción y mantenimiento
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6">
              <ExpertOpinions experts={conclusionExperts} title="Opinión de expertos sobre la conclusión" />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">Anterior</Button>
          <Button>
            Continuar a soluciones
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

