// Función para analizar los datos de cada metodología y sugerir una causa raíz
export function analyzeData(method: string, data: any, problem: any): string {
  switch (method) {
    case "ishikawa":
      return analyzeIshikawaData(data, problem)
    case "fiveWhys":
      return analyzeFiveWhysData(data, problem)
    case "pareto":
      return analyzeParetoData(data, problem)
    case "fmea":
      return analyzeFmeaData(data, problem)
    default:
      return ""
  }
}

// Analiza los datos del diagrama de Ishikawa
function analyzeIshikawaData(data: any, problem: any): string {
  if (!data || !data.causes) return ""

  // Contar causas por categoría
  const categoryCounts: Record<string, number> = {}
  let maxCategory = ""
  let maxCount = 0

  Object.entries(data.causes).forEach(([categoryId, causes]: [string, any]) => {
    const count = Array.isArray(causes) ? causes.length : 0
    categoryCounts[categoryId] = count

    if (count > maxCount) {
      maxCount = count
      maxCategory = categoryId
    }
  })

  // Si no hay causas, retornar mensaje genérico
  if (maxCount === 0) return ""

  // Obtener el nombre de la categoría con más causas
  const categoryName = data.categories?.find((cat: any) => cat.id.toString() === maxCategory)?.name || "Desconocida"

  // Generar causa raíz basada en la categoría con más causas
  const causes = data.causes[maxCategory] || []
  const causeTexts = causes.map((cause: any) => cause.text).join(", ")

  return `Basado en el análisis de Ishikawa, la causa raíz parece estar relacionada con la categoría "${categoryName}". 
  Las causas específicas identificadas incluyen: ${causeTexts}. 
  Se recomienda enfocar las acciones correctivas en esta área.`
}

// Analiza los datos del análisis de los 5 Por qué
function analyzeFiveWhysData(data: any, problem: any): string {
  if (!data || !data.whys || data.whys.length === 0) return ""

  // Obtener la respuesta al último "por qué"
  const lastWhy = data.whys[data.whys.length - 1]
  if (!lastWhy || !lastWhy.answer) return ""

  return `El análisis de los 5 Por qué sugiere que la causa raíz es: "${lastWhy.answer}". 
  Esta conclusión se alcanzó después de un análisis sistemático que profundizó en las causas subyacentes del problema.`
}

// Analiza los datos del análisis de Pareto
function analyzeParetoData(data: any, problem: any): string {
  if (!data || !data.causes || data.causes.length === 0) return ""

  // Ordenar causas por frecuencia (de mayor a menor)
  const sortedCauses = [...data.causes]
    .filter((cause) => cause.name && cause.frequency)
    .sort((a, b) => Number.parseInt(b.frequency) - Number.parseInt(a.frequency))

  if (sortedCauses.length === 0) return ""

  // Calcular el total de frecuencias
  const total = sortedCauses.reduce((sum, cause) => sum + Number.parseInt(cause.frequency), 0)

  // Identificar las causas que representan aproximadamente el 80% del problema
  let accumulative = 0
  const vitalFew = []

  for (const cause of sortedCauses) {
    accumulative += (Number.parseInt(cause.frequency) / total) * 100
    vitalFew.push(cause.name)

    if (accumulative >= 80) break
  }

  return `El análisis de Pareto indica que las causas principales que representan aproximadamente el 80% del problema son: ${vitalFew.join(", ")}. 
  Siguiendo el principio de Pareto, enfocarse en resolver estas "pocas vitales" proporcionará la mayor mejora con el menor esfuerzo.`
}

// Analiza los datos del análisis FMEA
function analyzeFmeaData(data: any, problem: any): string {
  if (!data || !data.failureModes || data.failureModes.length === 0) return ""

  // Encontrar el modo de falla con el RPN más alto
  const highestRPNMode = [...data.failureModes].sort((a, b) => b.rpn - a.rpn)[0]

  if (!highestRPNMode) return ""

  return `El análisis FMEA identifica que el modo de falla "${highestRPNMode.failureMode}" en el proceso "${highestRPNMode.process}" 
  tiene el mayor Número de Prioridad de Riesgo (RPN = ${highestRPNMode.rpn}). La causa de este modo de falla es: "${highestRPNMode.cause}". 
  Se recomienda implementar las siguientes acciones correctivas: ${highestRPNMode.actions || "Desarrollar un plan de acción específico"}.`
}

// Genera una conclusión final basada en todas las causas raíz identificadas
export function generateRootCause(rootCauses: Record<string, string>, analysisData: any): string {
  // Filtrar causas raíz no vacías
  const validCauses = Object.entries(rootCauses)
    .filter(([_, cause]) => cause && cause.trim() !== "")
    .map(([method, cause]) => ({ method, cause }))

  if (validCauses.length === 0) return ""

  // Identificar patrones comunes en las causas raíz
  const keywords = extractKeywords(validCauses.map((item) => item.cause))
  const topPatterns = findTopPatterns(keywords)

  // Generar conclusión basada en los patrones identificados
  let conclusion = `Después de analizar el problema utilizando ${validCauses.length} metodologías diferentes (${validCauses.map((item) => methodToName(item.method)).join(", ")}), 
  se han identificado los siguientes patrones comunes como posibles causas raíz:\n\n`

  topPatterns.forEach((pattern, index) => {
    conclusion += `${index + 1}. ${pattern}\n`
  })

  conclusion += `\nLa causa raíz más probable es una combinación de estos factores, con énfasis en ${topPatterns[0]}. 
  Se recomienda implementar acciones correctivas que aborden estos aspectos fundamentales para resolver el problema de manera efectiva y prevenir su recurrencia.`

  return conclusion
}

// Convierte el código de método a nombre legible
function methodToName(method: string): string {
  const methodNames: Record<string, string> = {
    ishikawa: "Diagrama de Ishikawa",
    fiveWhys: "Análisis de los 5 Por qué",
    pareto: "Análisis de Pareto",
    fmea: "Análisis FMEA",
  }

  return methodNames[method] || method
}

// Extrae palabras clave de un conjunto de textos
function extractKeywords(texts: string[]): string[] {
  // Lista de palabras a ignorar (stopwords)
  const stopwords = [
    "el",
    "la",
    "los",
    "las",
    "un",
    "una",
    "unos",
    "unas",
    "y",
    "o",
    "a",
    "ante",
    "bajo",
    "con",
    "de",
    "desde",
    "en",
    "entre",
    "hacia",
    "hasta",
    "para",
    "por",
    "según",
    "sin",
    "sobre",
    "tras",
    "que",
    "es",
    "son",
    "está",
    "están",
  ]

  // Unir todos los textos y dividir en palabras
  const allWords = texts
    .join(" ")
    .toLowerCase()
    .replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "")
    .split(/\s+/)
    .filter((word) => word.length > 3 && !stopwords.includes(word))

  return allWords
}

// Encuentra los patrones más comunes basados en palabras clave
function findTopPatterns(keywords: string[]): string[] {
  // Contar frecuencia de palabras
  const wordCounts: Record<string, number> = {}
  keywords.forEach((word) => {
    wordCounts[word] = (wordCounts[word] || 0) + 1
  })

  // Ordenar palabras por frecuencia
  const sortedWords = Object.entries(wordCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word, _]) => word)

  // Patrones predefinidos basados en palabras clave comunes
  const patterns = [
    "Falta de procedimientos estandarizados y documentación adecuada",
    "Deficiencias en la capacitación y formación del personal",
    "Problemas de comunicación entre departamentos",
    "Mantenimiento inadecuado o insuficiente de equipos",
    "Falta de controles de calidad efectivos",
    "Diseño deficiente de procesos o productos",
    "Gestión ineficiente de recursos",
  ]

  // Asignar puntuación a cada patrón basado en palabras clave encontradas
  const patternScores = patterns.map((pattern) => {
    const patternWords = pattern.toLowerCase().split(/\s+/)
    const score = patternWords.reduce((sum, word) => {
      return sum + (sortedWords.includes(word) ? 1 : 0)
    }, 0)
    return { pattern, score }
  })

  // Devolver patrones ordenados por puntuación
  return patternScores
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((item) => item.pattern)
}

// Genera soluciones automáticas basadas en la conclusión
export function generateSolutions(conclusion: string, area: string): any[] {
  if (!conclusion) return []

  // Soluciones predefinidas por área
  const areaSolutions: Record<string, any[]> = {
    Producción: [
      {
        title: "Implementar sistema de mantenimiento preventivo",
        description:
          "Desarrollar e implementar un sistema CMMS (Computerized Maintenance Management System) para programar y dar seguimiento al mantenimiento preventivo de equipos críticos.",
        impact: "Alto",
        effort: "Alto",
        timeframe: "Medio plazo",
      },
      {
        title: "Programa de capacitación técnica",
        description:
          "Diseñar un programa de capacitación técnica específica para operadores y personal de mantenimiento en áreas críticas identificadas.",
        impact: "Alto",
        effort: "Medio",
        timeframe: "Corto plazo",
      },
      {
        title: "Estandarización de procedimientos operativos",
        description:
          "Desarrollar y documentar procedimientos operativos estándar (SOPs) para procesos críticos, incluyendo listas de verificación y ayudas visuales.",
        impact: "Alto",
        effort: "Medio",
        timeframe: "Corto plazo",
      },
    ],
    Calidad: [
      {
        title: "Implementar sistema de gestión de calidad",
        description:
          "Desarrollar e implementar un sistema de gestión de calidad basado en ISO 9001 con enfoque en control estadístico de procesos.",
        impact: "Alto",
        effort: "Alto",
        timeframe: "Largo plazo",
      },
      {
        title: "Programa de auditorías internas",
        description:
          "Establecer un programa de auditorías internas para verificar el cumplimiento de estándares y procedimientos de calidad.",
        impact: "Medio",
        effort: "Medio",
        timeframe: "Corto plazo",
      },
      {
        title: "Implementar metodología Poka-Yoke",
        description:
          "Diseñar e implementar sistemas a prueba de errores (Poka-Yoke) en puntos críticos del proceso para prevenir defectos.",
        impact: "Alto",
        effort: "Medio",
        timeframe: "Medio plazo",
      },
    ],
    Logística: [
      {
        title: "Optimización de la cadena de suministro",
        description:
          "Realizar un análisis completo de la cadena de suministro e implementar mejoras en puntos críticos identificados.",
        impact: "Alto",
        effort: "Alto",
        timeframe: "Medio plazo",
      },
      {
        title: "Sistema de gestión de inventario",
        description: "Implementar un sistema de gestión de inventario basado en demanda real y pronósticos precisos.",
        impact: "Alto",
        effort: "Medio",
        timeframe: "Medio plazo",
      },
      {
        title: "Estandarización de procesos logísticos",
        description: "Desarrollar procedimientos estándar para recepción, almacenamiento y distribución de materiales.",
        impact: "Medio",
        effort: "Medio",
        timeframe: "Corto plazo",
      },
    ],
    Mantenimiento: [
      {
        title: "Implementar mantenimiento predictivo",
        description:
          "Desarrollar un programa de mantenimiento predictivo utilizando análisis de datos y monitoreo de condiciones.",
        impact: "Alto",
        effort: "Alto",
        timeframe: "Medio plazo",
      },
      {
        title: "Sistema de gestión de repuestos",
        description:
          "Implementar un sistema eficiente de gestión de repuestos críticos para reducir tiempos de inactividad.",
        impact: "Medio",
        effort: "Medio",
        timeframe: "Corto plazo",
      },
      {
        title: "Capacitación en TPM",
        description:
          "Desarrollar un programa de capacitación en Mantenimiento Productivo Total (TPM) para operadores y técnicos.",
        impact: "Alto",
        effort: "Medio",
        timeframe: "Corto plazo",
      },
    ],
  }

  // Soluciones generales para cualquier área
  const generalSolutions = [
    {
      title: "Mejorar canales de comunicación interdepartamental",
      description:
        "Implementar reuniones diarias breves (stand-up meetings) entre departamentos clave y establecer un sistema de comunicación para problemas urgentes.",
      impact: "Medio",
      effort: "Bajo",
      timeframe: "Corto plazo",
    },
    {
      title: "Sistema de gestión visual",
      description:
        "Implementar tableros de gestión visual en áreas clave para monitorear métricas de desempeño, estado de equipos y problemas pendientes.",
      impact: "Medio",
      effort: "Bajo",
      timeframe: "Corto plazo",
    },
    {
      title: "Programa de mejora continua",
      description:
        "Establecer un programa estructurado de mejora continua con equipos multidisciplinarios para identificar y resolver problemas.",
      impact: "Alto",
      effort: "Medio",
      timeframe: "Medio plazo",
    },
  ]

  // Seleccionar soluciones basadas en el área y la conclusión
  let solutions = []

  // Añadir soluciones específicas del área si están disponibles
  if (area && areaSolutions[area]) {
    solutions = [...areaSolutions[area]]
  }

  // Añadir soluciones generales
  solutions = [...solutions, ...generalSolutions]

  // Limitar a 5 soluciones
  return solutions.slice(0, 5)
}

