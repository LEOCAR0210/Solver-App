// Función para generar causa raíz con IA para Ishikawa
export function generateIshikawaRootCause(data, problem) {
  if (!data || !data.causes) return ""

  // Análisis de frecuencia de categorías
  const categoryCounts = {}
  let totalCauses = 0

  Object.entries(data.causes).forEach(([categoryId, causes]) => {
    const causeArray = Array.isArray(causes) ? causes : []
    categoryCounts[categoryId] = causeArray.length
    totalCauses += causeArray.length
  })

  // Identificar categorías principales (más del 20% de las causas)
  const significantCategories = []
  const categoryDetails = []

  Object.entries(categoryCounts).forEach(([categoryId, count]) => {
    const percentage = (count / totalCauses) * 100
    if (percentage >= 20) {
      const category = data.categories?.find((cat) => cat.id.toString() === categoryId)
      if (category) {
        significantCategories.push(category.name)

        // Obtener las causas específicas de esta categoría
        const causes = data.causes[categoryId] || []
        const causeTexts = causes.map((cause) => cause.text)

        categoryDetails.push({
          category: category.name,
          causes: causeTexts,
        })
      }
    }
  })

  // Si no hay categorías significativas, usar la que tenga más causas
  if (significantCategories.length === 0) {
    let maxCategory = ""
    let maxCount = 0

    Object.entries(categoryCounts).forEach(([categoryId, count]) => {
      if (count > maxCount) {
        maxCount = count
        maxCategory = categoryId
      }
    })

    const category = data.categories?.find((cat) => cat.id.toString() === maxCategory)
    if (category) {
      significantCategories.push(category.name)

      // Obtener las causas específicas de esta categoría
      const causes = data.causes[maxCategory] || []
      const causeTexts = causes.map((cause) => cause.text)

      categoryDetails.push({
        category: category.name,
        causes: causeTexts,
      })
    }
  }

  // Generar conclusión basada en el análisis
  let conclusion = `Basado en el análisis de Ishikawa, se han identificado ${totalCauses} posibles causas distribuidas en diferentes categorías. `

  if (significantCategories.length > 0) {
    conclusion += `Las categorías más significativas son: ${significantCategories.join(", ")}. `

    // Añadir detalles de las causas principales
    categoryDetails.forEach((detail) => {
      if (detail.causes.length > 0) {
        conclusion += `\n\nEn la categoría "${detail.category}", las causas principales identificadas son: ${detail.causes.join("; ")}. `
      }
    })

    // Añadir recomendación
    conclusion += `\n\nSe recomienda priorizar acciones correctivas enfocadas en la categoría "${significantCategories[0]}" para abordar la causa raíz del problema.`
  } else {
    conclusion += `No se han identificado categorías con un número significativo de causas. Se recomienda profundizar el análisis.`
  }

  return conclusion
}

// Función para generar causa raíz con IA para 5 Por qué
export function generateFiveWhysRootCause(data, problem) {
  if (!data || !data.whys || data.whys.length === 0) return ""

  // Obtener todas las respuestas
  const answers = data.whys.map((why) => why.answer).filter((answer) => answer && answer.trim() !== "")

  if (answers.length === 0) return ""

  // Si se completaron los 5 por qué, la última respuesta es la causa raíz
  if (answers.length >= 5) {
    return `El análisis de los 5 Por qué ha permitido identificar la causa raíz del problema: "${answers[answers.length - 1]}". 
    
    Esta conclusión se alcanzó después de un análisis sistemático que profundizó en las causas subyacentes, partiendo del problema inicial: "${problem.title}".
    
    La cadena de causalidad identificada es:
    1. ${answers[0]}
    2. ${answers[1]}
    3. ${answers[2]}
    4. ${answers[3]}
    5. ${answers[4]}
    
    Se recomienda implementar acciones correctivas que aborden directamente esta causa raíz para prevenir la recurrencia del problema.`
  } else {
    // Si no se completaron los 5 por qué, usar la última respuesta disponible
    return `El análisis de los Por qué ha identificado como posible causa: "${answers[answers.length - 1]}". 
    
    Sin embargo, el análisis no se completó hasta el quinto nivel de profundidad. Se recomienda continuar el análisis para identificar la causa raíz fundamental.
    
    La cadena de causalidad identificada hasta ahora es:
    ${answers.map((answer, index) => `${index + 1}. ${answer}`).join("\n")}`
  }
}

// Función para generar causa raíz con IA para Pareto
export function generateParetoRootCause(data, problem) {
  if (!data || !data.causes || data.causes.length === 0) return ""

  // Filtrar causas válidas
  const validCauses = data.causes.filter((cause) => cause.name && cause.frequency)

  if (validCauses.length === 0) return ""

  // Ordenar causas por frecuencia (de mayor a menor)
  const sortedCauses = [...validCauses].sort((a, b) => Number.parseInt(b.frequency) - Number.parseInt(a.frequency))

  // Calcular el total y los porcentajes
  const total = sortedCauses.reduce((sum, cause) => sum + Number.parseInt(cause.frequency), 0)
  const causesWithPercentage = sortedCauses.map((cause) => ({
    ...cause,
    percentage: (Number.parseInt(cause.frequency) / total) * 100,
  }))

  // Identificar las "pocas vitales" (aproximadamente 80%)
  let accumulative = 0
  const vitalFew = []

  for (const cause of causesWithPercentage) {
    vitalFew.push({
      name: cause.name,
      frequency: cause.frequency,
      percentage: cause.percentage.toFixed(1),
    })

    accumulative += cause.percentage
    if (accumulative >= 80) break
  }

  // Generar conclusión
  let conclusion = `El análisis de Pareto ha identificado ${validCauses.length} causas potenciales del problema. `

  if (vitalFew.length > 0) {
    conclusion += `Siguiendo el principio de Pareto (regla 80/20), se han identificado ${vitalFew.length} causas principales que representan aproximadamente el ${accumulative.toFixed(1)}% del problema:
    
    ${vitalFew.map((cause, index) => `${index + 1}. ${cause.name} (${cause.percentage}% del total)`).join("\n")}
    
    La causa principal "${vitalFew[0].name}" representa por sí sola el ${vitalFew[0].percentage}% del problema, lo que la convierte en el factor más crítico a abordar.
    
    Se recomienda priorizar acciones correctivas enfocadas en estas "pocas vitales", especialmente en "${vitalFew[0].name}", para obtener la mayor mejora con el menor esfuerzo.`
  } else {
    conclusion += `No se han podido identificar causas que sigan el principio de Pareto. Se recomienda revisar los datos ingresados.`
  }

  return conclusion
}

// Función para generar causa raíz con IA para FMEA
export function generateFmeaRootCause(data, problem) {
  if (!data || !data.failureModes || data.failureModes.length === 0) return ""

  // Ordenar modos de falla por RPN (de mayor a menor)
  const sortedModes = [...data.failureModes].sort((a, b) => b.rpn - a.rpn)

  // Identificar modos de falla críticos (RPN >= 200 o los 3 primeros si ninguno alcanza 200)
  const criticalModes = sortedModes.filter((mode) => mode.rpn >= 200)
  const topModes = criticalModes.length > 0 ? criticalModes : sortedModes.slice(0, Math.min(3, sortedModes.length))

  if (topModes.length === 0) return ""

  // Analizar causas comunes entre los modos de falla críticos
  const causes = topModes.map((mode) => mode.cause)
  const uniqueCauses = [...new Set(causes)]

  // Generar conclusión
  let conclusion = `El análisis FMEA ha evaluado ${data.failureModes.length} modos de falla potenciales. `

  if (topModes.length > 0) {
    conclusion += `Se han identificado ${topModes.length} modos de falla críticos con los mayores valores de RPN:
    
    ${topModes
      .map(
        (mode, index) =>
          `${index + 1}. Modo de falla: "${mode.failureMode}" en el proceso "${mode.process}"
       - Severidad: ${mode.severity}, Ocurrencia: ${mode.occurrence}, Detección: ${mode.detection}
       - RPN: ${mode.rpn}
       - Causa: "${mode.cause}"
       - Efecto: "${mode.effect}"
       - Acciones recomendadas: ${mode.actions || "No especificadas"}`,
      )
      .join("\n\n")}
    
    `

    if (uniqueCauses.length === 1) {
      conclusion += `El análisis revela una causa raíz común en los modos de falla críticos: "${uniqueCauses[0]}". Esta debe ser la prioridad para las acciones correctivas.`
    } else if (uniqueCauses.length > 1) {
      conclusion += `El análisis revela múltiples causas en los modos de falla críticos: ${uniqueCauses.join("; ")}. 
      
      La causa más crítica está asociada con el modo de falla de mayor RPN: "${topModes[0].cause}".`
    }

    // Añadir recomendación general
    conclusion += `\n\nSe recomienda implementar acciones correctivas inmediatas para el modo de falla "${topModes[0].failureMode}" (RPN = ${topModes[0].rpn}), enfocándose en su causa raíz: "${topModes[0].cause}".`
  } else {
    conclusion += `No se han identificado modos de falla críticos. Se recomienda revisar los criterios de evaluación.`
  }

  return conclusion
}

// Función para integrar todas las causas raíz y generar una conclusión unificada
export function generateIntegratedRootCause(rootCauses, analysisData, problem) {
  // Verificar si tenemos suficientes datos
  const validCauses = Object.entries(rootCauses)
    .filter(([_, cause]) => cause && cause.trim() !== "")
    .map(([method, cause]) => ({ method, cause }))

  if (validCauses.length === 0) return ""

  // Extraer frases clave de cada causa raíz
  const keyPhrases = validCauses.flatMap(({ method, cause }) => {
    // Dividir el texto en frases
    const sentences = cause.split(/[.!?]+/).filter((s) => s.trim() !== "")

    // Seleccionar frases que probablemente contengan causas raíz
    return sentences.filter(
      (sentence) =>
        sentence.toLowerCase().includes("causa") ||
        sentence.toLowerCase().includes("recomend") ||
        sentence.toLowerCase().includes("prioriz") ||
        sentence.toLowerCase().includes("crítico"),
    )
  })

  // Identificar patrones comunes
  const commonPatterns = findCommonPatterns(keyPhrases)

  // Generar conclusión integrada
  let conclusion = `# Análisis Integrado de Causa Raíz\n\n`

  conclusion += `## Resumen del Problema\n`
  conclusion += `**Problema:** ${problem.title}\n`
  conclusion += `**Descripción:** ${problem.description}\n`
  conclusion += `**Área:** ${problem.area}\n`
  conclusion += `**Impacto:** ${problem.impact}\n\n`

  conclusion += `## Metodologías Aplicadas\n`
  conclusion += `Se han aplicado ${validCauses.length} metodologías de análisis de causa raíz:\n`
  validCauses.forEach(({ method }) => {
    conclusion += `- ${methodToName(method)}\n`
  })
  conclusion += `\n`

  conclusion += `## Hallazgos Principales por Metodología\n`
  validCauses.forEach(({ method, cause }) => {
    conclusion += `### ${methodToName(method)}\n`
    // Extraer la primera frase significativa como resumen
    const summary = cause.split(/[.!?]+/).filter((s) => s.trim() !== "")[0]
    conclusion += `${summary}.\n\n`
  })

  conclusion += `## Patrones Comunes Identificados\n`
  if (commonPatterns.length > 0) {
    commonPatterns.forEach((pattern, index) => {
      conclusion += `${index + 1}. ${pattern}\n`
    })
  } else {
    conclusion += `No se identificaron patrones comunes claros entre las diferentes metodologías.\n`
  }
  conclusion += `\n`

  conclusion += `## Conclusión de Causa Raíz\n`
  if (commonPatterns.length > 0) {
    conclusion += `Basado en el análisis integrado de las diferentes metodologías, se concluye que la causa raíz principal del problema es:\n\n`
    conclusion += `**${commonPatterns[0]}**\n\n`

    if (commonPatterns.length > 1) {
      conclusion += `Factores contribuyentes adicionales incluyen:\n`
      commonPatterns.slice(1).forEach((pattern, index) => {
        conclusion += `- ${pattern}\n`
      })
    }
  } else {
    // Si no hay patrones comunes, usar la causa de la metodología más completa
    const methodPriority = ["fmea", "fiveWhys", "pareto", "ishikawa"]
    let bestMethod = null

    for (const method of methodPriority) {
      const causeObj = validCauses.find((c) => c.method === method)
      if (causeObj) {
        bestMethod = causeObj
        break
      }
    }

    if (bestMethod) {
      conclusion += `Basado principalmente en el análisis de ${methodToName(bestMethod.method)}, se concluye que la causa raíz principal del problema es:\n\n`

      // Extraer la frase más relevante
      const sentences = bestMethod.cause.split(/[.!?]+/).filter((s) => s.trim() !== "")
      const relevantSentence =
        sentences.find((s) => s.toLowerCase().includes("causa raíz") || s.toLowerCase().includes("principal")) ||
        sentences[0]

      conclusion += `**${relevantSentence}**\n`
    } else {
      conclusion += `No se ha podido determinar una causa raíz concluyente. Se recomienda profundizar el análisis.\n`
    }
  }

  conclusion += `\n## Recomendaciones\n`
  conclusion += `Basado en la causa raíz identificada, se recomienda:\n\n`

  // Generar recomendaciones basadas en la causa raíz y el área
  const recommendations = generateRecommendations(commonPatterns[0] || "", problem.area)
  recommendations.forEach((rec, index) => {
    conclusion += `${index + 1}. ${rec}\n`
  })

  return conclusion
}

// Función para encontrar patrones comunes en frases
function findCommonPatterns(phrases) {
  if (phrases.length === 0) return []

  // Lista de palabras a ignorar
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
    "ha",
    "han",
    "se",
    "del",
  ]

  // Extraer palabras clave de cada frase
  const keywordsPerPhrase = phrases.map((phrase) => {
    return phrase
      .toLowerCase()
      .replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "")
      .split(/\s+/)
      .filter((word) => word.length > 3 && !stopwords.includes(word))
  })

  // Contar frecuencia de palabras
  const wordFrequency = {}
  keywordsPerPhrase.flat().forEach((word) => {
    wordFrequency[word] = (wordFrequency[word] || 0) + 1
  })

  // Identificar palabras clave más frecuentes
  const topKeywords = Object.entries(wordFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word]) => word)

  // Patrones predefinidos basados en problemas comunes en ingeniería industrial
  const commonIndustrialPatterns = [
    "Falta de procedimientos estandarizados y documentación adecuada",
    "Deficiencias en la capacitación y formación del personal",
    "Problemas de comunicación entre departamentos",
    "Mantenimiento inadecuado o insuficiente de equipos",
    "Falta de controles de calidad efectivos",
    "Diseño deficiente de procesos o productos",
    "Gestión ineficiente de recursos",
    "Falta de sistemas de monitoreo y alerta temprana",
    "Problemas en la cadena de suministro",
    "Falta de análisis de datos para toma de decisiones",
  ]

  // Puntuar cada patrón basado en las palabras clave encontradas
  const patternScores = commonIndustrialPatterns.map((pattern) => {
    const patternWords = pattern.toLowerCase().split(/\s+/)
    const score = patternWords.reduce((sum, word) => {
      return sum + (topKeywords.includes(word) ? 1 : 0)
    }, 0)
    return { pattern, score }
  })

  // Seleccionar los patrones más relevantes
  return patternScores
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((item) => item.pattern)
}

// Función para generar recomendaciones basadas en la causa raíz
function generateRecommendations(rootCause, area) {
  // Recomendaciones generales
  const generalRecommendations = [
    "Implementar un sistema de gestión visual para monitorear indicadores clave",
    "Establecer reuniones diarias breves para mejorar la comunicación entre departamentos",
    "Desarrollar un programa de mejora continua con equipos multidisciplinarios",
  ]

  // Recomendaciones específicas por tipo de causa raíz
  const specificRecommendations = {
    procedimientos: [
      "Desarrollar y documentar procedimientos operativos estándar (SOPs) para procesos críticos",
      "Implementar un sistema de gestión documental para mantener actualizados los procedimientos",
      "Realizar auditorías periódicas para verificar el cumplimiento de los procedimientos",
    ],
    capacitación: [
      "Diseñar un programa de capacitación técnica específica para el personal",
      "Implementar un sistema de certificación de competencias para operadores",
      "Desarrollar materiales de formación visual y práctica para reforzar el aprendizaje",
    ],
    comunicación: [
      "Implementar un sistema de comunicación estructurado entre departamentos",
      "Establecer roles y responsabilidades claras para la comunicación de problemas",
      "Desarrollar tableros de información compartida entre áreas relacionadas",
    ],
    mantenimiento: [
      "Implementar un sistema de mantenimiento preventivo basado en condiciones",
      "Desarrollar un programa de mantenimiento autónomo por parte de los operadores",
      "Establecer indicadores de efectividad del mantenimiento (OEE)",
    ],
    calidad: [
      "Implementar controles de calidad en puntos críticos del proceso",
      "Desarrollar sistemas a prueba de errores (Poka-Yoke)",
      "Establecer un programa de auditorías de calidad internas",
    ],
  }

  // Recomendaciones específicas por área
  const areaRecommendations = {
    Producción: [
      "Implementar metodología SMED para reducir tiempos de cambio",
      "Establecer un sistema de gestión de cuellos de botella",
      "Desarrollar un programa de TPM (Mantenimiento Productivo Total)",
    ],
    Calidad: [
      "Implementar control estadístico de procesos (SPC)",
      "Desarrollar un sistema de trazabilidad de productos",
      "Establecer un programa de calibración de equipos de medición",
    ],
    Logística: [
      "Implementar un sistema de gestión de inventario basado en demanda",
      "Optimizar rutas y flujos de materiales",
      "Desarrollar KPIs específicos para la cadena de suministro",
    ],
    Mantenimiento: [
      "Implementar un sistema CMMS para gestión del mantenimiento",
      "Desarrollar un programa de análisis de fallas",
      "Establecer un inventario optimizado de repuestos críticos",
    ],
    Seguridad: [
      "Implementar un programa de observación preventiva de seguridad",
      "Desarrollar análisis de riesgos por puesto de trabajo",
      "Establecer un sistema de reporte de incidentes y casi-accidentes",
    ],
  }

  // Seleccionar recomendaciones basadas en la causa raíz
  let recommendations = [...generalRecommendations]

  // Añadir recomendaciones específicas según palabras clave en la causa raíz
  Object.entries(specificRecommendations).forEach(([keyword, recs]) => {
    if (rootCause.toLowerCase().includes(keyword)) {
      recommendations = [...recs, ...recommendations]
    }
  })

  // Añadir recomendaciones específicas del área
  if (area && areaRecommendations[area]) {
    recommendations = [...areaRecommendations[area], ...recommendations]
  }

  // Limitar a 5 recomendaciones
  return recommendations.slice(0, 5)
}

// Función para convertir código de método a nombre legible
function methodToName(method) {
  const methodNames = {
    ishikawa: "Diagrama de Ishikawa (Causa-Efecto)",
    fiveWhys: "Análisis de los 5 Por qué",
    pareto: "Análisis de Pareto",
    fmea: "Análisis de Modos y Efectos de Falla (FMEA)",
  }

  return methodNames[method] || method
}

// Función para generar soluciones basadas en la causa raíz
export function generateSolutions(conclusion, area) {
  if (!conclusion) return []

  // Extraer palabras clave de la conclusión
  const keywords = conclusion
    .toLowerCase()
    .replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "")
    .split(/\s+/)
    .filter((word) => word.length > 3)

  // Soluciones predefinidas por área
  const areaSolutions = {
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
        title: "Implementar metodología SMED",
        description:
          "Aplicar la metodología de cambio rápido de herramientas (SMED) para reducir tiempos de preparación y aumentar la flexibilidad de producción.",
        impact: "Alto",
        effort: "Medio",
        timeframe: "Medio plazo",
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
        title: "Implementar metodología Poka-Yoke",
        description:
          "Diseñar e implementar sistemas a prueba de errores (Poka-Yoke) en puntos críticos del proceso para prevenir defectos.",
        impact: "Alto",
        effort: "Medio",
        timeframe: "Medio plazo",
      },
      {
        title: "Sistema de trazabilidad de productos",
        description:
          "Implementar un sistema de trazabilidad que permita seguir el historial completo de cada producto a lo largo del proceso.",
        impact: "Alto",
        effort: "Alto",
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
        title: "Optimización de rutas y flujos",
        description:
          "Analizar y rediseñar las rutas de transporte y flujos de materiales para minimizar tiempos y costos.",
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
        title: "Programa de TPM",
        description:
          "Implementar un programa de Mantenimiento Productivo Total (TPM) involucrando a operadores en el mantenimiento básico.",
        impact: "Alto",
        effort: "Alto",
        timeframe: "Largo plazo",
      },
      {
        title: "Sistema de análisis de fallas",
        description:
          "Implementar un sistema estructurado para analizar las causas raíz de fallas recurrentes en equipos críticos.",
        impact: "Alto",
        effort: "Medio",
        timeframe: "Corto plazo",
      },
    ],
    Seguridad: [
      {
        title: "Programa de observación preventiva",
        description:
          "Implementar un programa de observación preventiva de seguridad con participación de todos los niveles de la organización.",
        impact: "Alto",
        effort: "Medio",
        timeframe: "Corto plazo",
      },
      {
        title: "Análisis de riesgos por puesto",
        description:
          "Desarrollar un análisis detallado de riesgos para cada puesto de trabajo y establecer medidas preventivas específicas.",
        impact: "Alto",
        effort: "Medio",
        timeframe: "Medio plazo",
      },
      {
        title: "Sistema de gestión de seguridad",
        description:
          "Implementar un sistema de gestión de seguridad basado en ISO 45001 con indicadores proactivos y reactivos.",
        impact: "Alto",
        effort: "Alto",
        timeframe: "Largo plazo",
      },
    ],
  }

  // Soluciones generales para cualquier área
  const generalSolutions = [
    {
      title: "Estandarización de procedimientos operativos",
      description:
        "Desarrollar y documentar procedimientos operativos estándar (SOPs) para procesos críticos, incluyendo listas de verificación y ayudas visuales.",
      impact: "Alto",
      effort: "Medio",
      timeframe: "Corto plazo",
    },
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
    {
      title: "Sistema de gestión del conocimiento",
      description:
        "Implementar un sistema para documentar y compartir conocimientos, lecciones aprendidas y mejores prácticas entre el personal.",
      impact: "Medio",
      effort: "Medio",
      timeframe: "Medio plazo",
    },
  ]

  // Soluciones específicas por palabras clave
  const keywordSolutions = {
    procedimiento: [
      {
        title: "Sistema de gestión documental",
        description:
          "Implementar un sistema para crear, revisar, aprobar y controlar documentos y procedimientos operativos.",
        impact: "Alto",
        effort: "Medio",
        timeframe: "Medio plazo",
      },
    ],
    capacitación: [
      {
        title: "Programa de certificación de competencias",
        description:
          "Desarrollar un programa de certificación interna para validar las competencias técnicas del personal en procesos críticos.",
        impact: "Alto",
        effort: "Medio",
        timeframe: "Medio plazo",
      },
    ],
    comunicación: [
      {
        title: "Sistema de comunicación estructurada",
        description:
          "Implementar un sistema de comunicación con roles, responsabilidades y canales claramente definidos para diferentes tipos de información.",
        impact: "Medio",
        effort: "Bajo",
        timeframe: "Corto plazo",
      },
    ],
    mantenimiento: [
      {
        title: "Sistema CMMS",
        description:
          "Implementar un sistema computarizado de gestión de mantenimiento para planificar, ejecutar y dar seguimiento a todas las actividades de mantenimiento.",
        impact: "Alto",
        effort: "Alto",
        timeframe: "Medio plazo",
      },
    ],
    calidad: [
      {
        title: "Control estadístico de procesos",
        description:
          "Implementar técnicas de control estadístico para monitorear la variabilidad de los procesos e identificar tendencias antes de que generen defectos.",
        impact: "Alto",
        effort: "Medio",
        timeframe: "Medio plazo",
      },
    ],
  }

  // Seleccionar soluciones basadas en el área y palabras clave
  let solutions = []

  // Añadir soluciones específicas del área si están disponibles
  if (area && areaSolutions[area]) {
    solutions = [...areaSolutions[area]]
  }

  // Añadir soluciones basadas en palabras clave encontradas en la conclusión
  Object.entries(keywordSolutions).forEach(([keyword, sols]) => {
    if (keywords.some((word) => word.includes(keyword))) {
      solutions = [...solutions, ...sols]
    }
  })

  // Añadir soluciones generales
  solutions = [...solutions, ...generalSolutions]

  // Eliminar duplicados y limitar a 5 soluciones
  const uniqueSolutions = []
  const titles = new Set()

  for (const solution of solutions) {
    if (!titles.has(solution.title)) {
      titles.add(solution.title)
      uniqueSolutions.push(solution)
      if (uniqueSolutions.length >= 5) break
    }
  }

  return uniqueSolutions
}

