"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { PlusCircle, Save, Trash2, AlertTriangle } from "lucide-react"
import ExpertOpinions from "@/app/components/expert-opinions"

// Expertos para esta metodología
const fmeaExperts = [
  {
    id: 1,
    name: "Ing. Javier Torres",
    role: "Especialista en Confiabilidad",
    avatar: "/placeholder.svg?height=40&width=40",
    opinion:
      "El análisis FMEA muestra que el modo de falla con mayor RPN es la calibración incorrecta de los equipos. Recomendaría implementar un sistema de verificación diaria y capacitación específica para los operadores en este aspecto.",
  },
  {
    id: 2,
    name: "Dra. Ana Ramírez",
    role: "Gerente de Calidad",
    avatar: "/placeholder.svg?height=40&width=40",
    opinion:
      "Observo que varios modos de falla están relacionados con la falta de procedimientos estandarizados. Sugiero desarrollar SOPs (Procedimientos Operativos Estándar) detallados y asegurar que todo el personal esté capacitado en ellos.",
  },
]

// Añadir la definición de tipos para las props
export default function FmeaAnalysis({ problem, onRootCauseUpdate }) {
  const [failureModes, setFailureModes] = useState([
    {
      id: 1,
      process: "",
      failureMode: "",
      effect: "",
      cause: "",
      severity: 5,
      occurrence: 5,
      detection: 5,
      rpn: 125,
      actions: "",
    },
  ])

  const [rootCause, setRootCause] = useState("")

  const handleAddFailureMode = () => {
    setFailureModes([
      ...failureModes,
      {
        id: Date.now(),
        process: "",
        failureMode: "",
        effect: "",
        cause: "",
        severity: 5,
        occurrence: 5,
        detection: 5,
        rpn: 125,
        actions: "",
      },
    ])
  }

  const handleRemoveFailureMode = (id) => {
    if (failureModes.length <= 1) return
    setFailureModes(failureModes.filter((mode) => mode.id !== id))
  }

  const handleFailureModeChange = (id, field, value) => {
    const updatedModes = failureModes.map((mode) => {
      if (mode.id === id) {
        const updatedMode = { ...mode, [field]: value }

        // Recalcular RPN si se cambia severity, occurrence o detection
        if (field === "severity" || field === "occurrence" || field === "detection") {
          const severity = field === "severity" ? value : mode.severity
          const occurrence = field === "occurrence" ? value : mode.occurrence
          const detection = field === "detection" ? value : mode.detection

          updatedMode.rpn = severity * occurrence * detection
        }

        return updatedMode
      }
      return mode
    })

    setFailureModes(updatedModes)
  }

  const handleRootCauseChange = (value) => {
    setRootCause(value)
    if (onRootCauseUpdate) {
      onRootCauseUpdate(value)
    }
  }

  const getRpnColor = (rpn) => {
    if (rpn >= 200) return "bg-red-100 text-red-800"
    if (rpn >= 100) return "bg-yellow-100 text-yellow-800"
    return "bg-green-100 text-green-800"
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Análisis de Modos y Efectos de Falla (FMEA)</CardTitle>
          <CardDescription>
            Identifica y evalúa los posibles modos de falla, sus efectos y causas para priorizar acciones correctivas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Problema: {problem.title}</h3>
            <p className="text-sm text-muted-foreground">{problem.description}</p>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-md font-medium">Registro de modos de falla</h3>
              <Button variant="outline" size="sm" onClick={handleAddFailureMode}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Añadir modo de falla
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="p-2 text-left text-xs font-medium text-muted-foreground">Proceso/Componente</th>
                    <th className="p-2 text-left text-xs font-medium text-muted-foreground">Modo de Falla</th>
                    <th className="p-2 text-left text-xs font-medium text-muted-foreground">Efecto</th>
                    <th className="p-2 text-left text-xs font-medium text-muted-foreground">Causa</th>
                    <th className="p-2 text-center text-xs font-medium text-muted-foreground">S</th>
                    <th className="p-2 text-center text-xs font-medium text-muted-foreground">O</th>
                    <th className="p-2 text-center text-xs font-medium text-muted-foreground">D</th>
                    <th className="p-2 text-center text-xs font-medium text-muted-foreground">RPN</th>
                    <th className="p-2 text-left text-xs font-medium text-muted-foreground">Acciones</th>
                    <th className="p-2 text-center text-xs font-medium text-muted-foreground"></th>
                  </tr>
                </thead>
                <tbody>
                  {failureModes.map((mode) => (
                    <tr key={mode.id} className="border-b">
                      <td className="p-2">
                        <Input
                          value={mode.process}
                          onChange={(e) => handleFailureModeChange(mode.id, "process", e.target.value)}
                          placeholder="Proceso"
                          className="h-8 text-sm"
                        />
                      </td>
                      <td className="p-2">
                        <Input
                          value={mode.failureMode}
                          onChange={(e) => handleFailureModeChange(mode.id, "failureMode", e.target.value)}
                          placeholder="Modo de falla"
                          className="h-8 text-sm"
                        />
                      </td>
                      <td className="p-2">
                        <Input
                          value={mode.effect}
                          onChange={(e) => handleFailureModeChange(mode.id, "effect", e.target.value)}
                          placeholder="Efecto"
                          className="h-8 text-sm"
                        />
                      </td>
                      <td className="p-2">
                        <Input
                          value={mode.cause}
                          onChange={(e) => handleFailureModeChange(mode.id, "cause", e.target.value)}
                          placeholder="Causa"
                          className="h-8 text-sm"
                        />
                      </td>
                      <td className="p-2">
                        <select
                          value={mode.severity}
                          onChange={(e) => handleFailureModeChange(mode.id, "severity", Number(e.target.value))}
                          className="w-12 h-8 rounded-md border border-input bg-background text-sm"
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                            <option key={num} value={num}>
                              {num}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="p-2">
                        <select
                          value={mode.occurrence}
                          onChange={(e) => handleFailureModeChange(mode.id, "occurrence", Number(e.target.value))}
                          className="w-12 h-8 rounded-md border border-input bg-background text-sm"
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                            <option key={num} value={num}>
                              {num}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="p-2">
                        <select
                          value={mode.detection}
                          onChange={(e) => handleFailureModeChange(mode.id, "detection", Number(e.target.value))}
                          className="w-12 h-8 rounded-md border border-input bg-background text-sm"
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                            <option key={num} value={num}>
                              {num}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="p-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${getRpnColor(mode.rpn)}`}>{mode.rpn}</span>
                      </td>
                      <td className="p-2">
                        <Input
                          value={mode.actions}
                          onChange={(e) => handleFailureModeChange(mode.id, "actions", e.target.value)}
                          placeholder="Acciones recomendadas"
                          className="h-8 text-sm"
                        />
                      </td>
                      <td className="p-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveFailureMode(mode.id)}
                          disabled={failureModes.length <= 1}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-md bg-blue-50 border-blue-200">
              <h3 className="text-sm font-medium text-blue-800 mb-2">Severidad (S)</h3>
              <p className="text-xs text-blue-700">
                Evalúa el impacto del efecto de la falla en el cliente o proceso.
                <br />1 = Mínimo impacto, 10 = Impacto extremo
              </p>
            </div>

            <div className="p-4 border rounded-md bg-blue-50 border-blue-200">
              <h3 className="text-sm font-medium text-blue-800 mb-2">Ocurrencia (O)</h3>
              <p className="text-xs text-blue-700">
                Evalúa la frecuencia con la que ocurre la causa de la falla.
                <br />1 = Muy rara vez, 10 = Casi inevitable
              </p>
            </div>

            <div className="p-4 border rounded-md bg-blue-50 border-blue-200">
              <h3 className="text-sm font-medium text-blue-800 mb-2">Detección (D)</h3>
              <p className="text-xs text-blue-700">
                Evalúa la capacidad de detectar la falla antes de que llegue al cliente.
                <br />1 = Detección casi segura, 10 = Indetectable
              </p>
            </div>
          </div>

          <div className="mt-6 p-4 border rounded-md bg-yellow-50 border-yellow-200">
            <div className="flex items-center mb-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
              <h3 className="text-sm font-medium text-yellow-800">Interpretación del RPN</h3>
            </div>
            <ul className="text-xs text-yellow-700 space-y-1">
              <li>
                <span className="inline-block w-16 px-2 py-1 bg-red-100 text-red-800 rounded-full text-center">
                  RPN ≥ 200
                </span>{" "}
                - Riesgo alto: Requiere acción inmediata
              </li>
              <li>
                <span className="inline-block w-16 px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-center">
                  RPN ≥ 100
                </span>{" "}
                - Riesgo medio: Requiere acción planificada
              </li>
              <li>
                <span className="inline-block w-16 px-2 py-1 bg-green-100 text-green-800 rounded-full text-center">
                  RPN &lt; 100
                </span>{" "}
                - Riesgo bajo: Monitorear
              </li>
            </ul>
          </div>

          <div className="mt-6 p-4 border rounded-md bg-green-50 border-green-200">
            <h3 className="text-sm font-medium text-green-800 mb-2">Causa raíz identificada por FMEA</h3>
            <Textarea
              placeholder="Documenta la causa raíz identificada según el análisis FMEA..."
              value={rootCause}
              onChange={(e) => handleRootCauseChange(e.target.value)}
              rows={3}
              className="mt-1 border-green-200 focus-visible:ring-green-500"
            />
          </div>

          <ExpertOpinions experts={fmeaExperts} />
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

