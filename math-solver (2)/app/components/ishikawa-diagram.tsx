"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { PlusCircle, Trash2, ChevronRight, Lightbulb } from "lucide-react"
import ExpertOpinions from "@/app/components/expert-opinions"
import { generateIshikawaRootCause } from "@/app/utils/ai-engine"
import { saveIshikawaData } from "@/app/utils/db-service"

// Categorías estándar para el diagrama de Ishikawa
const defaultCategories = [
  { id: 1, name: "Mano de obra", color: "#f97316" },
  { id: 2, name: "Métodos", color: "#3b82f6" },
  { id: 3, name: "Máquinas", color: "#10b981" },
  { id: 4, name: "Materiales", color: "#8b5cf6" },
  { id: 5, name: "Medición", color: "#f43f5e" },
  { id: 6, name: "Medio ambiente", color: "#84cc16" },
]

// Expertos para esta metodología
const ishikawaExperts = [
  {
    id: 1,
    name: "Dra. Elena Martínez",
    role: "Ingeniera de Procesos",
    avatar: "/placeholder.svg?height=40&width=40",
    opinion:
      "Basado en el diagrama, observo que las causas relacionadas con los métodos y la mano de obra parecen ser las más numerosas. Recomendaría profundizar en los procedimientos operativos estándar y en la capacitación del personal.",
  },
  {
    id: 2,
    name: "Ing. Carlos Vega",
    role: "Especialista en Lean Manufacturing",
    avatar: "/placeholder.svg?height=40&width=40",
    opinion:
      "El diagrama muestra claramente problemas de comunicación entre departamentos y falta de mantenimiento preventivo en los equipos. Estos son puntos críticos que deben abordarse con prioridad.",
  },
]

export default function IshikawaDiagram({ problem, onRootCauseUpdate, onDataUpdate, suggestedRootCause }) {
  const [categories, setCategories] = useState(defaultCategories)
  const [causes, setCauses] = useState({})
  const [newCause, setNewCause] = useState("")
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [customCategory, setCustomCategory] = useState("")
  const [rootCause, setRootCause] = useState("")
  const [isGeneratingCause, setIsGeneratingCause] = useState(false)
  const [isDataSaved, setIsDataSaved] = useState(false)

  // Efecto para actualizar el estado con la causa raíz sugerida
  useEffect(() => {
    if (suggestedRootCause && !rootCause) {
      setRootCause(suggestedRootCause)
    }
  }, [suggestedRootCause, rootCause])

  const handleAddCause = () => {
    if (!newCause.trim() || !selectedCategory) return

    const updatedCauses = { ...causes }
    if (!updatedCauses[selectedCategory]) {
      updatedCauses[selectedCategory] = []
    }

    updatedCauses[selectedCategory].push({
      id: Date.now(),
      text: newCause,
    })

    setCauses(updatedCauses)
    setNewCause("")
    setIsDataSaved(false)
  }

  const handleRemoveCause = (categoryId, causeId) => {
    const updatedCauses = { ...causes }
    updatedCauses[categoryId] = updatedCauses[categoryId].filter((cause) => cause.id !== causeId)
    setCauses(updatedCauses)
    setIsDataSaved(false)
  }

  const handleAddCategory = () => {
    if (!customCategory.trim()) return

    const newCategory = {
      id: categories.length + 1,
      name: customCategory,
      color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
    }

    setCategories([...categories, newCategory])
    setCustomCategory("")
    setIsDataSaved(false)
  }

  const handleRootCauseChange = (value) => {
    setRootCause(value)
    if (onRootCauseUpdate) {
      onRootCauseUpdate(value)
    }
    setIsDataSaved(false)
  }

  const handleGenerateRootCause = async () => {
    // Verificar si hay suficientes datos para generar una causa raíz
    const hasCauses = Object.values(causes).some(
      (categoryCauses) => Array.isArray(categoryCauses) && categoryCauses.length > 0,
    )

    if (!hasCauses) {
      alert("Por favor, añade al menos una causa en el diagrama para generar una causa raíz automática.")
      return
    }

    setIsGeneratingCause(true)

    try {
      // Preparar datos para el análisis
      const data = {
        categories,
        causes,
      }

      // Generar causa raíz con IA
      const generatedCause = generateIshikawaRootCause(data, problem)

      // Actualizar estado y notificar al componente padre
      setRootCause(generatedCause)
      if (onRootCauseUpdate) {
        onRootCauseUpdate(generatedCause)
      }

      // Actualizar datos de análisis
      if (onDataUpdate) {
        onDataUpdate(data)
      }
    } catch (error) {
      console.error("Error al generar la causa raíz:", error)
      alert("Ocurrió un error al generar la causa raíz automática. Por favor, inténtalo de nuevo.")
    } finally {
      setIsGeneratingCause(false)
    }
  }

  const handleSaveData = async () => {
    try {
      // Preparar datos para guardar
      const data = {
        categories,
        causes,
        rootCause,
      }

      // Guardar datos en la base de datos
      await saveIshikawaData(problem.id, data)

      // Actualizar datos de análisis en el componente padre
      if (onDataUpdate) {
        onDataUpdate(data)
      }

      setIsDataSaved(true)

      // Mostrar mensaje de éxito
      alert("Datos guardados correctamente")
    } catch (error) {
      console.error("Error al guardar los datos:", error)
      alert("Ocurrió un error al guardar los datos. Por favor, inténtalo de nuevo.")
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Diagrama de Ishikawa (Causa-Efecto)</CardTitle>
          <CardDescription>Identifica las posibles causas del problema agrupadas por categorías</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Problema: {problem.title}</h3>
            <p className="text-sm text-muted-foreground">{problem.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <Label htmlFor="category">Seleccionar categoría</Label>
              <select
                id="category"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1"
                value={selectedCategory || ""}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">Seleccionar categoría</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="cause">Causa potencial</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  id="cause"
                  placeholder="Añadir causa potencial"
                  value={newCause}
                  onChange={(e) => setNewCause(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAddCause()
                  }}
                />
                <Button onClick={handleAddCause} disabled={!selectedCategory || !newCause.trim()}>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Añadir
                </Button>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center">
            {/* Diagrama visual de Ishikawa */}
            <div className="w-full overflow-x-auto pb-4">
              <div className="min-w-[800px] h-[400px] relative">
                {/* Línea central */}
                <div className="absolute left-0 right-0 top-1/2 h-1 bg-gray-300"></div>

                {/* Problema (cabeza del pescado) */}
                <div className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-primary text-primary-foreground p-3 rounded-lg shadow-md">
                  <p className="font-medium text-sm">{problem.title}</p>
                </div>

                {/* Categorías y causas */}
                {categories.map((category, index) => {
                  const isTop = index % 2 === 0
                  const position = (index + 1) / (categories.length + 1)

                  return (
                    <div key={category.id}>
                      {/* Línea de categoría */}
                      <div
                        className="absolute h-[150px] w-1"
                        style={{
                          left: `${position * 80}%`,
                          top: isTop ? "0%" : "50%",
                          backgroundColor: category.color,
                          transform: isTop ? "rotate(45deg)" : "rotate(-45deg)",
                          transformOrigin: isTop ? "bottom left" : "top left",
                        }}
                      ></div>

                      {/* Etiqueta de categoría */}
                      <div
                        className="absolute p-2 rounded-md shadow-sm text-white text-sm font-medium"
                        style={{
                          left: `${position * 80 + 5}%`,
                          top: isTop ? "10%" : "80%",
                          backgroundColor: category.color,
                        }}
                      >
                        {category.name}
                      </div>

                      {/* Causas */}
                      {causes[category.id]?.map((cause, causeIndex) => (
                        <div
                          key={cause.id}
                          className="absolute p-1 bg-white border rounded-md text-xs flex items-center gap-1 shadow-sm"
                          style={{
                            left: `${position * 80 + (isTop ? causeIndex * 8 : -causeIndex * 8)}%`,
                            top: isTop ? `${20 + causeIndex * 8}%` : `${70 - causeIndex * 8}%`,
                            borderColor: category.color,
                            maxWidth: "150px",
                          }}
                        >
                          <span className="truncate">{cause.text}</span>
                          <button
                            onClick={() => handleRemoveCause(category.id, cause.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 border rounded-md bg-muted/30">
            <h3 className="text-sm font-medium mb-2">Añadir categoría personalizada</h3>
            <div className="flex gap-2">
              <Input
                placeholder="Nombre de nueva categoría"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
              />
              <Button variant="outline" onClick={handleAddCategory}>
                Añadir
              </Button>
            </div>
          </div>

          <div className="mt-6 p-4 border rounded-md bg-green-50 border-green-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-green-800">Causa raíz identificada</h3>
              <Button
                variant="outline"
                size="sm"
                className="bg-green-100 text-green-800 border-green-300 hover:bg-green-200"
                onClick={handleGenerateRootCause}
                disabled={isGeneratingCause}
              >
                <Lightbulb className="h-4 w-4 mr-2" />
                {isGeneratingCause ? "Generando..." : "Generar automáticamente"}
              </Button>
            </div>
            <Textarea
              placeholder="Documenta la causa raíz identificada según el análisis de Ishikawa..."
              value={rootCause}
              onChange={(e) => handleRootCauseChange(e.target.value)}
              rows={6}
              className="mt-1 border-green-200 focus-visible:ring-green-500"
            />
          </div>

          <ExpertOpinions experts={ishikawaExperts} />
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">Anterior</Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleSaveData} disabled={isDataSaved}>
              {isDataSaved ? "Datos guardados" : "Guardar datos"}
            </Button>
            <Button onClick={() => onRootCauseUpdate(rootCause)}>
              Guardar y continuar
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

