// Servicio para interactuar con la base de datos
import { v4 as uuidv4 } from "uuid"

// Simulación de base de datos en memoria
const database = {
  problems: [],
  ishikawaData: [],
  fiveWhysData: [],
  paretoData: [],
  fmeaData: [],
  conclusions: [],
  solutions: [],
}

// Función para guardar un problema
export async function saveProblem(problem) {
  const id = problem.id || uuidv4()
  const newProblem = { ...problem, id, createdAt: new Date().toISOString() }

  // Buscar si ya existe el problema
  const index = database.problems.findIndex((p) => p.id === id)

  if (index >= 0) {
    // Actualizar problema existente
    database.problems[index] = newProblem
  } else {
    // Añadir nuevo problema
    database.problems.push(newProblem)
  }

  return newProblem
}

// Función para guardar datos de Ishikawa
export async function saveIshikawaData(problemId, data) {
  const id = uuidv4()
  const record = {
    id,
    problemId,
    data,
    createdAt: new Date().toISOString(),
  }

  // Eliminar registros anteriores para este problema
  database.ishikawaData = database.ishikawaData.filter((item) => item.problemId !== problemId)

  // Añadir nuevo registro
  database.ishikawaData.push(record)

  return record
}

// Función para guardar datos de 5 Por qué
export async function saveFiveWhysData(problemId, data) {
  const id = uuidv4()
  const record = {
    id,
    problemId,
    data,
    createdAt: new Date().toISOString(),
  }

  // Eliminar registros anteriores para este problema
  database.fiveWhysData = database.fiveWhysData.filter((item) => item.problemId !== problemId)

  // Añadir nuevo registro
  database.fiveWhysData.push(record)

  return record
}

// Función para guardar datos de Pareto
export async function saveParetoData(problemId, data) {
  const id = uuidv4()
  const record = {
    id,
    problemId,
    data,
    createdAt: new Date().toISOString(),
  }

  // Eliminar registros anteriores para este problema
  database.paretoData = database.paretoData.filter((item) => item.problemId !== problemId)

  // Añadir nuevo registro
  database.paretoData.push(record)

  return record
}

// Función para guardar datos de FMEA
export async function saveFmeaData(problemId, data) {
  const id = uuidv4()
  const record = {
    id,
    problemId,
    data,
    createdAt: new Date().toISOString(),
  }

  // Eliminar registros anteriores para este problema
  database.fmeaData = database.fmeaData.filter((item) => item.problemId !== problemId)

  // Añadir nuevo registro
  database.fmeaData.push(record)

  return record
}

// Función para guardar conclusión
export async function saveConclusion(problemId, conclusion) {
  const id = uuidv4()
  const record = {
    id,
    problemId,
    conclusion,
    createdAt: new Date().toISOString(),
  }

  // Eliminar conclusiones anteriores para este problema
  database.conclusions = database.conclusions.filter((item) => item.problemId !== problemId)

  // Añadir nueva conclusión
  database.conclusions.push(record)

  return record
}

// Función para guardar soluciones
export async function saveSolutions(problemId, solutions) {
  const id = uuidv4()
  const record = {
    id,
    problemId,
    solutions,
    createdAt: new Date().toISOString(),
  }

  // Eliminar soluciones anteriores para este problema
  database.solutions = database.solutions.filter((item) => item.problemId !== problemId)

  // Añadir nuevas soluciones
  database.solutions.push(record)

  return record
}

// Función para obtener todos los datos de un problema
export async function getProblemData(problemId) {
  const problem = database.problems.find((p) => p.id === problemId)
  const ishikawaData = database.ishikawaData.find((d) => d.problemId === problemId)
  const fiveWhysData = database.fiveWhysData.find((d) => d.problemId === problemId)
  const paretoData = database.paretoData.find((d) => d.problemId === problemId)
  const fmeaData = database.fmeaData.find((d) => d.problemId === problemId)
  const conclusion = database.conclusions.find((c) => c.problemId === problemId)
  const solutions = database.solutions.find((s) => s.problemId === problemId)

  return {
    problem,
    ishikawaData: ishikawaData?.data || null,
    fiveWhysData: fiveWhysData?.data || null,
    paretoData: paretoData?.data || null,
    fmeaData: fmeaData?.data || null,
    conclusion: conclusion?.conclusion || null,
    solutions: solutions?.solutions || [],
  }
}

// Función para obtener todos los problemas
export async function getAllProblems() {
  return database.problems
}

