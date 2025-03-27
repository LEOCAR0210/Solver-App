"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { PlusCircle, Save, Trash2 } from "lucide-react"
import { useEffect } from "react"
import ExpertOpinions, { type Expert } from "./expert-opinions"

// Expertos para esta metodología
const paretoExperts: Expert[] = [
  {
    id: 1,
    name: "Ing. Roberto Méndez",
    role: "Analista de Datos Industriales",
    avatar: "/placeholder.svg?height=40&width=40",
    opinion:
      "El análisis de Pareto muestra claramente que las fallas en el equipo de calibración y la falta de capacitación del personal representan más del 70% del problema. Recomendaría enfocar los recursos en estos dos aspectos para obtener mejoras significativas.",
  },
  {
    id: 2,
    name: "Dra. Patricia Herrera",
    role: "Directora de Operaciones",
    avatar: "/placeholder.svg?height=40&width=40",
    opinion:
      "Basado en los datos, veo que hay una oportunidad de mejora importante en la estandarización de procesos. Sugiero implementar un sistema de gestión visual y capacitación cruzada para reducir la variabilidad en los procesos críticos.",
  },
]

// Añadir la definición de tipos para las props
export default function ParetoAnalysis({ problem, onRootCauseUpdate }) {
  const [causes, setCauses] = useState([{ id: 1, name: "", frequency: "" }])
  const [rootCause, setRootCause] = useState("")

  const [chartData, setChartData] = useState({
    bars: [],
    line: [],
    total: 0,
  })

  const handleAddCause = () => {
    setCauses([...causes, { id: Date.now(), name: "", frequency: "" }])
  }

  const handleRemoveCause = (id) => {
    if (causes.length <= 1) return
    setCauses(causes.filter((cause) => cause.id !== id))
  }

  const handleCauseChange = (id, field, value) => {
    setCauses(causes.map((cause) => (cause.id === id ? { ...cause, [field]: value } : cause)))
  }

  const handleRootCauseChange = (value) => {
    setRootCause(value)
    if (onRootCauseUpdate) {
      onRootCauseUpdate(value)
    }
  }

  useEffect(() => {
    // Preparar datos para el gráfico de Pareto
    const validCauses = causes.filter((c) => c.name && !isNaN(Number.parseInt(c.frequency)))

    if (validCauses.length === 0) {
      setChartData({ bars: [], line: [], total: 0 })
      return
    }

    // Ordenar por frecuencia (de mayor a menor)
    const sortedCauses = [...validCauses].sort((a, b) => Number.parseInt(b.frequency) - Number.parseInt(a.frequency))

    const total = sortedCauses.reduce((sum, cause) => sum + Number.parseInt(cause.frequency), 0)

    let accumulative = 0
    const bars = []
    const line = []

    sortedCauses.forEach((cause, index) => {
      const frequency = Number.parseInt(cause.frequency)
      const percentage = (frequency / total) * 100
      accumulative += percentage

      bars.push({
        name: cause.name,
        frequency,
        percentage,
        height: (frequency / sortedCauses[0].frequency) * 100,
      })

      line.push({
        x: index,
        y: accumulative,
      })
    })

    setChartData({ bars, line, total })
  }, [causes])

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Análisis de Pareto</CardTitle>
          <CardDescription>
            Identifica las causas más significativas que generan la mayor parte del problema (regla 80/20)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Problema: {problem.title}</h3>
            <p className="text-sm text-muted-foreground">{problem.description}</p>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-md font-medium">Registro de causas y frecuencias</h3>
              <Button variant="outline" size="sm" onClick={handleAddCause}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Añadir causa
              </Button>
            </div>

            <div className="space-y-2">
              {causes.map((cause, index) => (
                <div key={cause.id} className="flex gap-2 items-center">
                  <div className="flex-1">
                    <Input
                      placeholder="Nombre de la causa"
                      value={cause.name}
                      onChange={(e) => handleCauseChange(cause.id, "name", e.target.value)}
                    />
                  </div>
                  <div className="w-24">
                    <Input
                      type="number"
                      placeholder="Frecuencia"
                      value={cause.frequency}
                      onChange={(e) => handleCauseChange(cause.id, "frequency", e.target.value)}
                      min="0"
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveCause(cause.id)}
                    disabled={causes.length <= 1}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {chartData.bars.length > 0 && (
            <div className="mt-8">
              <h3 className="text-md font-medium mb-4">Diagrama de Pareto</h3>
              <div className="h-64 border rounded-md p-4 relative">
                {/* Eje Y - Frecuencia */}
                <div className="absolute left-0 top-0 bottom-0 w-10 flex flex-col justify-between items-end pr-1 text-xs text-muted-foreground">
                  <span>{chartData.total}</span>
                  <span>{Math.round(chartData.total * 0.75)}</span>
                  <span>{Math.round(chartData.total * 0.5)}</span>
                  <span>{Math.round(chartData.total * 0.25)}</span>
                  <span>0</span>
                </div>

                {/* Eje Y secundario - Porcentaje acumulado */}
                <div className="absolute right-0 top-0 bottom-0 w-10 flex flex-col justify-between items-start pl-1 text-xs text-blue-500">
                  <span>100%</span>
                  <span>75%</span>
                  <span>50%</span>
                  <span>25%</span>
                  <span>0%</span>
                </div>

                {/* Gráfico de barras y línea */}
                <div className="absolute left-10 right-10 top-0 bottom-5 flex items-end justify-around">
                  {chartData.bars.map((bar, index) => (
                    <div key={index} className="relative flex flex-col items-center">
                      <div
                        className="w-12 bg-primary rounded-t"
                        style={{ height: `${bar.height}%`, maxHeight: "90%" }}
                      ></div>
                      <span className="text-xs mt-1 text-center w-16 truncate" title={bar.name}>
                        {bar.name}
                      </span>

                      {/* Punto en la línea de porcentaje acumulado */}
                      {index > 0 && (
                        <div
                          className="absolute w-2 h-2 bg-blue-500 rounded-full"
                          style={{
                            bottom: `${chartData.line[index].y}%`,
                            left: "50%",
                          }}
                        ></div>
                      )}

                      {/* Línea de porcentaje acumulado */}
                      {index > 0 && (
                        <div
                          className="absolute h-0.5 bg-blue-500"
                          style={{
                            bottom: `${chartData.line[index - 1].y}%`,
                            width: "100%",
                            left: "-50%",
                            transform: `rotate(${
                              Math.atan2(chartData.line[index].y - chartData.line[index - 1].y, 100) * (180 / Math.PI)
                            }deg)`,
                            transformOrigin: "left bottom",
                          }}
                        ></div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Línea del 80% */}
                <div className="absolute left-10 right-10 border-t border-dashed border-red-500" style={{ top: "20%" }}>
                  <span className="absolute right-0 -top-3 text-xs text-red-500">80%</span>
                </div>
              </div>

              <div className="mt-4 p-4 bg-muted/30 rounded-md">
                <h4 className="text-sm font-medium mb-2">Interpretación:</h4>
                <p className="text-sm text-muted-foreground">
                  {chartData.bars.length > 0 && (
                    <>
                      Las causas principales que representan aproximadamente el 80% del problema son:
                      <strong>
                        {chartData.bars
                          .filter((_, i) => chartData.line[i]?.y <= 80)
                          .map((bar) => ` ${bar.name}`)
                          .join(", ")}
                      </strong>
                      . Estas deberían ser el foco principal de las acciones correctivas.
                    </>
                  )}
                </p>
              </div>
            </div>
          )}

          <div className="mt-6 p-4 border rounded-md bg-green-50 border-green-200">
            <h3 className="text-sm font-medium text-green-800 mb-2">Causa raíz identificada por Pareto</h3>
            <Textarea
              placeholder="Documenta la causa raíz identificada según el análisis de Pareto..."
              value={rootCause}
              onChange={(e) => handleRootCauseChange(e.target.value)}
              rows={3}
              className="mt-1 border-green-200 focus-visible:ring-green-500"
            />
          </div>

          <div className="mt-6 p-4 border rounded-md bg-blue-50 border-blue-200">
            <h3 className="text-sm font-medium text-blue-800 mb-2">Principio de Pareto (Regla 80/20)</h3>
            <p className="text-sm text-blue-700">
              El principio de Pareto establece que aproximadamente el 80% de los efectos provienen del 20% de las
              causas. Identificar estas "pocas vitales" permite enfocar los esfuerzos de mejora donde tendrán mayor
              impacto.
            </p>
          </div>

          <ExpertOpinions experts={paretoExperts} />
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">Anterior</Button>
          <Button onClick={() => onRootCauseUpdate(rootCause)}>
            Guardar y continuar
            <Save className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

