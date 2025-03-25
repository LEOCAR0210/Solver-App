"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  AlertTriangle,
  FileText,
  PlusCircle,
  ChevronRight,
  BarChart4,
  GitBranch,
  HelpCircle,
  CheckCircle2,
  ClipboardList,
  Lightbulb,
} from "lucide-react"
import IshikawaDiagram from "@/app/components/ishikawa-diagram"
import FiveWhysAnalysis from "@/app/components/five-whys-analysis"
import ParetoAnalysis from "@/app/components/pareto-analysis"
import SolutionProposal from "@/app/components/solution-proposal"
import FmeaAnalysis from "@/app/components/fmea-analysis"
import RootCauseConclusion from "@/app/components/root-cause-conclusion"

export default function SolveApp() {
  const [activeTab, setActiveTab] = useState("definicion")
  const [problem, setProblem] = useState({
    title: "",
    description: "",
    impact: "",
    area: "",
    date: new Date().toISOString().split("T")[0],
    status: "En análisis",
  })

  const [rootCauses, setRootCauses] = useState({
    ishikawa: "",
    fiveWhys: "",
    pareto: "",
    fmea: "",
  })

  const [savedProblems, setSavedProblems] = useState([
    {
      id: 1,
      title: "Retrasos en línea de producción",
      description: "La línea de producción A presenta retrasos recurrentes que afectan el cumplimiento de entregas",
      impact: "Alto",
      area: "Producción",
      date: "2023-11-15",
      status: "En análisis",
    },
  ])

  const handleSaveProblem = () => {
    if (!problem.title || !problem.description) return

    const newProblem = {
      ...problem,
      id: savedProblems.length + 1,
    }

    setSavedProblems([...savedProblems, newProblem])
    setActiveTab("ishikawa")
  }

  const updateRootCause = (method, cause) => {
    setRootCauses((prev) => ({
      ...prev,
      [method]: cause,
    }))
  }

  return (
    <div className="container mx-auto py-6">
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-primary">Solve-App</h1>
          <p className="text-muted-foreground">Análisis y resolución de problemas industriales</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <FileText className="mr-2 h-4 w-4" />
            Mis análisis
          </Button>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Nuevo problema
          </Button>
        </div>
      </header>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-7 w-full">
          <TabsTrigger value="definicion" className="flex items-center">
            <AlertTriangle className="mr-2 h-4 w-4" />
            Definición
          </TabsTrigger>
          <TabsTrigger value="ishikawa" className="flex items-center">
            <GitBranch className="mr-2 h-4 w-4" />
            Ishikawa
          </TabsTrigger>
          <TabsTrigger value="5porques" className="flex items-center">
            <HelpCircle className="mr-2 h-4 w-4" />5 Por qué
          </TabsTrigger>
          <TabsTrigger value="pareto" className="flex items-center">
            <BarChart4 className="mr-2 h-4 w-4" />
            Pareto
          </TabsTrigger>
          <TabsTrigger value="fmea" className="flex items-center">
            <ClipboardList className="mr-2 h-4 w-4" />
            FMEA
          </TabsTrigger>
          <TabsTrigger value="conclusion" className="flex items-center">
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Conclusión
          </TabsTrigger>
          <TabsTrigger value="soluciones" className="flex items-center">
            <Lightbulb className="mr-2 h-4 w-4" />
            Soluciones
          </TabsTrigger>
        </TabsList>

        <TabsContent value="definicion" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Definición del problema</CardTitle>
              <CardDescription>Define claramente el problema para facilitar su análisis y resolución</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título del problema</Label>
                  <Input
                    id="title"
                    placeholder="Ej: Retrasos en línea de producción"
                    value={problem.title}
                    onChange={(e) => setProblem({ ...problem, title: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descripción detallada</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe el problema con detalles específicos, cuándo ocurre, cómo se manifiesta..."
                    rows={4}
                    value={problem.description}
                    onChange={(e) => setProblem({ ...problem, description: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="impact">Impacto</Label>
                    <select
                      id="impact"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={problem.impact}
                      onChange={(e) => setProblem({ ...problem, impact: e.target.value })}
                    >
                      <option value="">Seleccionar impacto</option>
                      <option value="Bajo">Bajo</option>
                      <option value="Medio">Medio</option>
                      <option value="Alto">Alto</option>
                      <option value="Crítico">Crítico</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="area">Área</Label>
                    <select
                      id="area"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={problem.area}
                      onChange={(e) => setProblem({ ...problem, area: e.target.value })}
                    >
                      <option value="">Seleccionar área</option>
                      <option value="Producción">Producción</option>
                      <option value="Calidad">Calidad</option>
                      <option value="Logística">Logística</option>
                      <option value="Mantenimiento">Mantenimiento</option>
                      <option value="Seguridad">Seguridad</option>
                      <option value="Otra">Otra</option>
                    </select>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Cancelar</Button>
              <Button onClick={handleSaveProblem}>
                Continuar con análisis
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Problemas recientes</CardTitle>
              <CardDescription>Problemas registrados recientemente en la plataforma</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {savedProblems.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                  >
                    <div>
                      <h3 className="font-medium">{p.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {p.area} • {p.date}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          p.status === "Resuelto"
                            ? "bg-green-100 text-green-800"
                            : p.status === "En análisis"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {p.status}
                      </span>
                      <Button variant="ghost" size="icon">
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ishikawa">
          <IshikawaDiagram problem={problem} onRootCauseUpdate={(cause) => updateRootCause("ishikawa", cause)} />
        </TabsContent>

        <TabsContent value="5porques">
          <FiveWhysAnalysis problem={problem} onRootCauseUpdate={(cause) => updateRootCause("fiveWhys", cause)} />
        </TabsContent>

        <TabsContent value="pareto">
          <ParetoAnalysis problem={problem} onRootCauseUpdate={(cause) => updateRootCause("pareto", cause)} />
        </TabsContent>

        <TabsContent value="fmea">
          <FmeaAnalysis problem={problem} onRootCauseUpdate={(cause) => updateRootCause("fmea", cause)} />
        </TabsContent>

        <TabsContent value="conclusion">
          <RootCauseConclusion problem={problem} rootCauses={rootCauses} />
        </TabsContent>

        <TabsContent value="soluciones">
          <SolutionProposal problem={problem} rootCauses={rootCauses} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

