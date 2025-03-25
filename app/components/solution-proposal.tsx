"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { PlusCircle, Save, Trash2, CheckCircle2, Clock, AlertTriangle, Lightbulb } from "lucide-react"
import ExpertOpinions, { type Expert } from "./expert-opinions"

// Expertos para esta metodología
const solutionExperts: Expert[] = [
  {
    id: 1,
    name: "Ing. Fernando Ruiz",
    role: "Gerente de Mejora Continua",
    avatar: "/placeholder.svg?height=40&width=40",
    opinion:
      "Basado en las causas raíz identificadas, recomendaría priorizar la implementación de un sistema de mantenimiento preventivo y la capacitación del personal técnico. Estas acciones tendrán el mayor impacto a corto plazo.",
  },
  {
    id: 2,
    name: "Dra. Sofía Mendoza",
    role: "Consultora en Procesos Industriales",
    avatar: "/placeholder.svg?height=40&width=40",
    opinion:
      "Considero que la estandarización de procedimientos operativos y la mejora en los canales de comunicación entre departamentos son fundamentales para resolver este problema de manera sostenible.",
  },
]

// Añadir la definición de tipos para las props
export default function SolutionProposal({ problem, rootCauses }) {
  const [solutions, setSolutions] = useState([
    {
      id: 1,
      description: "",
      impact: "Alto",
      effort: "Medio",
      timeframe: "Corto plazo",
      responsible: "",
    },
  ])

  const [selectedSolution, setSelectedSolution] = useState(null)
  const [implementationPlan, setImplementationPlan] = useState("")

  // Soluciones predefinidas basadas en causas comunes
  const predefinedSolutions = [
    {
      id: "sol1",
      title: "Implementar sistema de mantenimiento preventivo",
      description:
        "Desarrollar e implementar un sistema CMMS (Computerized Maintenance Management System) para programar y dar seguimiento al mantenimiento preventivo de equipos críticos.",
      impact: "Alto",
      effort: "Alto",
      timeframe: "Medio plazo",
    },
    {
      id: "sol2",
      title: "Programa de capacitación técnica",
      description:
        "Diseñar un programa de capacitación técnica específica para operadores y personal de mantenimiento en áreas críticas identificadas.",
      impact: "Alto",
      effort: "Medio",
      timeframe: "Corto plazo",
    },
    {
      id: "sol3",
      title: "Estandarización de procedimientos operativos",
      description:
        "Desarrollar y documentar procedimientos operativos estándar (SOPs) para procesos críticos, incluyendo listas de verificación y ayudas visuales.",
      impact: "Alto",
      effort: "Medio",
      timeframe: "Corto plazo",
    },
    {
      id: "sol4",
      title: "Mejorar canales de comunicación interdepartamental",
      description:
        "Implementar reuniones diarias breves (stand-up meetings) entre departamentos clave y establecer un sistema de comunicación para problemas urgentes.",
      impact: "Medio",
      effort: "Bajo",
      timeframe: "Corto plazo",
    },
    {
      id: "sol5",
      title: "Sistema de gestión visual",
      description:
        "Implementar tableros de gestión visual en áreas clave para monitorear métricas de desempeño, estado de equipos y problemas pendientes.",
      impact: "Medio",
      effort: "Bajo",
      timeframe: "Corto plazo",
    },
  ]

  const handleAddSolution = () => {
    setSolutions([
      ...solutions,
      {
        id: Date.now(),
        description: "",
        impact: "Alto",
        effort: "Medio",
        timeframe: "Corto plazo",
        responsible: "",
      },
    ])
  }

  const handleAddPredefinedSolution = (predefinedSolution) => {
    setSolutions([
      ...solutions,
      {
        id: Date.now(),
        description: predefinedSolution.description,
        impact: predefinedSolution.impact,
        effort: predefinedSolution.effort,
        timeframe: predefinedSolution.timeframe,
        responsible: "",
      },
    ])
  }

  const handleRemoveSolution = (id) => {
    if (solutions.length <= 1) return
    setSolutions(solutions.filter((solution) => solution.id !== id))

    if (selectedSolution === id) {
      setSelectedSolution(null)
    }
  }

  const handleSolutionChange = (id, field, value) => {
    setSolutions(solutions.map((solution) => (solution.id === id ? { ...solution, [field]: value } : solution)))
  }

  const getImpactColor = (impact) => {
    switch (impact) {
      case "Bajo":
        return "bg-yellow-100 text-yellow-800"
      case "Medio":
        return "bg-blue-100 text-blue-800"
      case "Alto":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getEffortColor = (effort) => {
    switch (effort) {
      case "Bajo":
        return "bg-green-100 text-green-800"
      case "Medio":
        return "bg-yellow-100 text-yellow-800"
      case "Alto":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTimeframeColor = (timeframe) => {
    switch (timeframe) {
      case "Corto plazo":
        return "bg-green-100 text-green-800"
      case "Medio plazo":
        return "bg-yellow-100 text-yellow-800"
      case "Largo plazo":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Propuesta de soluciones</CardTitle>
          <CardDescription>Define soluciones para abordar las causas raíz identificadas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Problema: {problem.title}</h3>
            <p className="text-sm text-muted-foreground">{problem.description}</p>
          </div>

          <div className="mb-6">
            <h3 className="text-md font-medium mb-3 flex items-center">
              <Lightbulb className="h-5 w-5 text-amber-500 mr-2" />
              Soluciones recomendadas
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {predefinedSolutions.map((solution) => (
                <div
                  key={solution.id}
                  className="border rounded-lg p-3 hover:bg-muted/20 cursor-pointer"
                  onClick={() => handleAddPredefinedSolution(solution)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-sm">{solution.title}</h4>
                    <div className="flex gap-1">
                      <span className={`px-2 py-0.5 rounded-full text-xs ${getImpactColor(solution.impact)}`}>
                        {solution.impact}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-xs ${getTimeframeColor(solution.timeframe)}`}>
                        {solution.timeframe}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">{solution.description}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-2 text-xs"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleAddPredefinedSolution(solution)
                    }}
                  >
                    <PlusCircle className="h-3 w-3 mr-1" />
                    Añadir a mis soluciones
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-md font-medium">Mis soluciones propuestas</h3>
              <Button variant="outline" size="sm" onClick={handleAddSolution}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Añadir solución
              </Button>
            </div>

            <div className="space-y-4">
              {solutions.map((solution) => (
                <div
                  key={solution.id}
                  className={`border rounded-lg p-4 ${
                    selectedSolution === solution.id ? "border-primary bg-primary/5" : ""
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="space-y-1 flex-1">
                      <Label htmlFor={`solution-${solution.id}`}>Descripción de la solución</Label>
                      <Textarea
                        id={`solution-${solution.id}`}
                        placeholder="Describe la solución propuesta..."
                        value={solution.description}
                        onChange={(e) => handleSolutionChange(solution.id, "description", e.target.value)}
                        rows={2}
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveSolution(solution.id)}
                      disabled={solutions.length <= 1}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 ml-2"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div>
                      <Label htmlFor={`impact-${solution.id}`}>Impacto</Label>
                      <select
                        id={`impact-${solution.id}`}
                        className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1"
                        value={solution.impact}
                        onChange={(e) => handleSolutionChange(solution.id, "impact", e.target.value)}
                      >
                        <option value="Bajo">Bajo</option>
                        <option value="Medio">Medio</option>
                        <option value="Alto">Alto</option>
                      </select>
                    </div>

                    <div>
                      <Label htmlFor={`effort-${solution.id}`}>Esfuerzo</Label>
                      <select
                        id={`effort-${solution.id}`}
                        className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1"
                        value={solution.effort}
                        onChange={(e) => handleSolutionChange(solution.id, "effort", e.target.value)}
                      >
                        <option value="Bajo">Bajo</option>
                        <option value="Medio">Medio</option>
                        <option value="Alto">Alto</option>
                      </select>
                    </div>

                    <div>
                      <Label htmlFor={`timeframe-${solution.id}`}>Plazo</Label>
                      <select
                        id={`timeframe-${solution.id}`}
                        className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1"
                        value={solution.timeframe}
                        onChange={(e) => handleSolutionChange(solution.id, "timeframe", e.target.value)}
                      >
                        <option value="Corto plazo">Corto plazo</option>
                        <option value="Medio plazo">Medio plazo</option>
                        <option value="Largo plazo">Largo plazo</option>
                      </select>
                    </div>

                    <div>
                      <Label htmlFor={`responsible-${solution.id}`}>Responsable</Label>
                      <Input
                        id={`responsible-${solution.id}`}
                        placeholder="Responsable"
                        value={solution.responsible}
                        onChange={(e) => handleSolutionChange(solution.id, "responsible", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="mt-3 flex justify-end">
                    <Button
                      variant={selectedSolution === solution.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedSolution(selectedSolution === solution.id ? null : solution.id)}
                    >
                      {selectedSolution === solution.id ? "Seleccionada" : "Seleccionar para implementación"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {selectedSolution && (
              <div className="mt-8 border rounded-lg p-4 bg-green-50 border-green-200">
                <h3 className="text-md font-medium text-green-800 mb-3 flex items-center">
                  <CheckCircle2 className="h-5 w-5 mr-2" />
                  Plan de implementación
                </h3>

                <div className="mb-4">
                  <p className="text-sm text-green-700 mb-2">
                    Solución seleccionada:{" "}
                    <strong>{solutions.find((s) => s.id === selectedSolution)?.description}</strong>
                  </p>

                  <div className="flex flex-wrap gap-2 mb-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${getImpactColor(
                        solutions.find((s) => s.id === selectedSolution)?.impact,
                      )}`}
                    >
                      Impacto: {solutions.find((s) => s.id === selectedSolution)?.impact}
                    </span>

                    <span
                      className={`px-2 py-1 rounded-full text-xs ${getEffortColor(
                        solutions.find((s) => s.id === selectedSolution)?.effort,
                      )}`}
                    >
                      Esfuerzo: {solutions.find((s) => s.id === selectedSolution)?.effort}
                    </span>

                    <span
                      className={`px-2 py-1 rounded-full text-xs ${getTimeframeColor(
                        solutions.find((s) => s.id === selectedSolution)?.timeframe,
                      )}`}
                    >
                      Plazo: {solutions.find((s) => s.id === selectedSolution)?.timeframe}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="implementation-plan">Detalle del plan de implementación</Label>
                  <Textarea
                    id="implementation-plan"
                    placeholder="Describe los pasos para implementar la solución, recursos necesarios, cronograma..."
                    value={implementationPlan}
                    onChange={(e) => setImplementationPlan(e.target.value)}
                    rows={5}
                  />
                </div>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="p-3 bg-white rounded-md border border-green-200">
                    <h4 className="text-sm font-medium text-green-800 mb-1 flex items-center">
                      <CheckCircle2 className="h-4 w-4 mr-1" />
                      Acciones inmediatas
                    </h4>
                    <ul className="text-xs text-green-700 list-disc list-inside">
                      <li>Comunicar el plan al equipo</li>
                      <li>Asignar responsabilidades</li>
                      <li>Establecer métricas de seguimiento</li>
                    </ul>
                  </div>

                  <div className="p-3 bg-white rounded-md border border-yellow-200">
                    <h4 className="text-sm font-medium text-yellow-800 mb-1 flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      Seguimiento
                    </h4>
                    <ul className="text-xs text-yellow-700 list-disc list-inside">
                      <li>Reuniones semanales de avance</li>
                      <li>Documentar resultados parciales</li>
                      <li>Ajustar el plan según sea necesario</li>
                    </ul>
                  </div>

                  <div className="p-3 bg-white rounded-md border border-blue-200">
                    <h4 className="text-sm font-medium text-blue-800 mb-1 flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-1" />
                      Posibles obstáculos
                    </h4>
                    <ul className="text-xs text-blue-700 list-disc list-inside">
                      <li>Resistencia al cambio</li>
                      <li>Limitaciones de recursos</li>
                      <li>Dependencias de otros departamentos</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6 p-4 border rounded-md bg-muted/30">
              <h3 className="text-sm font-medium mb-2">Matriz de priorización de soluciones</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Prioriza las soluciones según su impacto y esfuerzo requerido:
              </p>

              <div className="grid grid-cols-2 gap-2 h-64 border rounded-md">
                {/* Cuadrante 1: Alto impacto, Bajo esfuerzo */}
                <div className="border-r border-b bg-green-50 p-2 relative">
                  <span className="absolute top-2 left-2 text-xs font-medium text-green-800">IMPLEMENTAR</span>
                  <div className="h-full flex items-center justify-center">
                    {solutions
                      .filter((s) => s.impact === "Alto" && s.effort === "Bajo")
                      .map((s) => (
                        <div
                          key={s.id}
                          className="bg-white p-2 rounded-md text-xs border border-green-200 max-w-[90%] truncate"
                        >
                          {s.description || "Sin descripción"}
                        </div>
                      ))}
                  </div>
                </div>

                {/* Cuadrante 2: Alto impacto, Alto esfuerzo */}
                <div className="border-b bg-yellow-50 p-2 relative">
                  <span className="absolute top-2 left-2 text-xs font-medium text-yellow-800">PLANIFICAR</span>
                  <div className="h-full flex items-center justify-center">
                    {solutions
                      .filter((s) => s.impact === "Alto" && s.effort === "Alto")
                      .map((s) => (
                        <div
                          key={s.id}
                          className="bg-white p-2 rounded-md text-xs border border-yellow-200 max-w-[90%] truncate"
                        >
                          {s.description || "Sin descripción"}
                        </div>
                      ))}
                  </div>
                </div>

                {/* Cuadrante 3: Bajo impacto, Bajo esfuerzo */}
                <div className="border-r bg-blue-50 p-2 relative">
                  <span className="absolute top-2 left-2 text-xs font-medium text-blue-800">CONSIDERAR</span>
                  <div className="h-full flex items-center justify-center">
                    {solutions
                      .filter((s) => s.impact === "Bajo" && s.effort === "Bajo")
                      .map((s) => (
                        <div
                          key={s.id}
                          className="bg-white p-2 rounded-md text-xs border border-blue-200 max-w-[90%] truncate"
                        >
                          {s.description || "Sin descripción"}
                        </div>
                      ))}
                  </div>
                </div>

                {/* Cuadrante 4: Bajo impacto, Alto esfuerzo */}
                <div className="bg-red-50 p-2 relative">
                  <span className="absolute top-2 left-2 text-xs font-medium text-red-800">EVITAR</span>
                  <div className="h-full flex items-center justify-center">
                    {solutions
                      .filter((s) => s.impact === "Bajo" && s.effort === "Alto")
                      .map((s) => (
                        <div
                          key={s.id}
                          className="bg-white p-2 rounded-md text-xs border border-red-200 max-w-[90%] truncate"
                        >
                          {s.description || "Sin descripción"}
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <ExpertOpinions experts={solutionExperts} />
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">Anterior</Button>
          <Button>
            Finalizar análisis
            <Save className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

