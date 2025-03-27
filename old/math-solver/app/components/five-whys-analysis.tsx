"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { PlusCircle, Trash2, ChevronRight, HelpCircle } from "lucide-react"
import ExpertOpinions from "@/app/components/expert-opinions"

// Expertos para esta metodología
const fiveWhysExperts = [
  {
    id: 1,
    name: "Dr. Miguel Sánchez",
    role: "Consultor en Mejora Continua",
    avatar: "/placeholder.svg?height=40&width=40",
    opinion:
      "El análisis de los 5 Por qué ha revelado que la causa raíz parece estar en la falta de un sistema de gestión de mantenimiento preventivo. Recomendaría implementar un sistema CMMS (Computerized Maintenance Management System) para programar y dar seguimiento al mantenimiento.",
  },
  {
    id: 2,
    name: "Ing. Laura Gómez",
    role: "Especialista en Gestión de Calidad",
    avatar: "/placeholder.svg?height=40&width=40",
    opinion:
      "Observo que hay un patrón de comunicación deficiente entre departamentos. Sugiero revisar los canales de comunicación y establecer reuniones diarias breves para coordinar actividades entre producción y mantenimiento.",
  },
]

// Añadir la definición de tipos para las props
export default function FiveWhysAnalysis({ problem, onRootCauseUpdate }) {
  const [whys, setWhys] = useState([{ id: 1, question: "¿Por qué ocurre el problema?", answer: "" }])
  const [rootCause, setRootCause] = useState("")

  const handleAddWhy = () => {
    if (whys.length >= 5) return

    const lastWhy = whys[whys.length - 1]

    setWhys([
      ...whys,
      {
        id: whys.length + 1,
        question: `¿Por qué ${lastWhy.answer}?`,
        answer: "",
      },
    ])
  }

  const handleAnswerChange = (id, answer) => {
    const updatedWhys = whys.map((why) => (why.id === id ? { ...why, answer } : why))

    // Actualizar las preguntas subsiguientes
    for (let i = id; i < updatedWhys.length; i++) {
      if (i < updatedWhys.length - 1) {
        const currentAnswer = updatedWhys[i].answer
        updatedWhys[i + 1].question = `¿Por qué ${currentAnswer}?`
      }
    }

    setWhys(updatedWhys)
  }

  const handleRemoveWhy = (id) => {
    if (whys.length <= 1) return

    setWhys(whys.filter((why) => why.id !== id))
  }

  const handleRootCauseChange = (value) => {
    setRootCause(value)
    if (onRootCauseUpdate) {
      onRootCauseUpdate(value)
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Análisis de los 5 Por qué</CardTitle>
          <CardDescription>
            Técnica para identificar la causa raíz de un problema mediante preguntas sucesivas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Problema: {problem.title}</h3>
            <p className="text-sm text-muted-foreground">{problem.description}</p>
          </div>

          <div className="space-y-6">
            {whys.map((why, index) => (
              <div key={why.id} className="border rounded-lg p-4 bg-muted/20">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <div className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium mr-2">
                      {index + 1}
                    </div>
                    <h4 className="font-medium">{why.question}</h4>
                  </div>
                  {whys.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveWhy(why.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <Textarea
                  placeholder="Responde a la pregunta..."
                  value={why.answer}
                  onChange={(e) => handleAnswerChange(why.id, e.target.value)}
                  rows={2}
                  className="mt-1"
                />
              </div>
            ))}

            {whys.length < 5 && whys[whys.length - 1].answer && (
              <Button variant="outline" onClick={handleAddWhy} className="w-full border-dashed">
                <PlusCircle className="mr-2 h-4 w-4" />
                Añadir otro por qué
              </Button>
            )}

            {whys.length === 5 && whys[4].answer && (
              <div className="border rounded-lg p-4 bg-green-50 border-green-200">
                <div className="flex items-center mb-2">
                  <HelpCircle className="h-5 w-5 text-green-600 mr-2" />
                  <h4 className="font-medium text-green-800">Causa raíz identificada</h4>
                </div>
                <Textarea
                  placeholder="Documenta la causa raíz identificada..."
                  value={rootCause}
                  onChange={(e) => handleRootCauseChange(e.target.value)}
                  rows={3}
                  className="mt-1 border-green-200 focus-visible:ring-green-500"
                />
                <p className="text-xs text-green-700 mt-2">
                  Después de 5 niveles de análisis, deberías haber identificado la causa raíz del problema.
                </p>
              </div>
            )}
          </div>

          <div className="mt-6 p-4 border rounded-md bg-blue-50 border-blue-200">
            <h3 className="text-sm font-medium text-blue-800 mb-2">Guía para el análisis de los 5 Por qué</h3>
            <ol className="list-decimal list-inside text-sm text-blue-700 space-y-1">
              <li>Comienza con el problema claramente definido</li>
              <li>Pregunta "¿Por qué ocurre este problema?" y documenta la respuesta</li>
              <li>Para cada respuesta, pregunta "¿Por qué?" nuevamente</li>
              <li>Repite el proceso al menos 5 veces o hasta identificar la causa raíz</li>
              <li>Verifica que la causa identificada sea realmente la raíz del problema</li>
            </ol>
          </div>

          <ExpertOpinions experts={fiveWhysExperts} />
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">Anterior</Button>
          <Button onClick={() => onRootCauseUpdate(rootCause)}>
            Guardar y continuar
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

