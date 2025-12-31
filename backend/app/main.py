from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any
from uuid import uuid4
import datetime

app = FastAPI()

# Habilitar CORS para permitir el acceso desde el frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permite cualquier origen (ajústalo en producción)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Modelos
class ProblemCreate(BaseModel):
    title: str
    description: str
    type: str = "general"

class Solution(BaseModel):
    id: str
    summary: str
    content: List[str]
    created_at: str

# Almacenamiento en memoria (sustituir por DB en producción)
PROBLEMS: List[Dict[str, Any]] = []
SOLUTIONS: Dict[str, Dict[str, Any]] = {}

# Helper para generar una solución simple (mock) — reemplazar por pipeline IA en producción
def generate_solution(problem: ProblemCreate) -> List[str]:
    text = problem.description.lower()
    steps: List[str] = []

    # Caso sencillo para problemas matemáticos
    if problem.type.lower() in ("matematico", "mathematics") or any(k in text for k in ["integral", "deriv", "\u222b", "^", "sqrt", "sumatoria", "sum"]):
        steps.append("<p>1) Interpretar la expresión y variables implicadas.</p>")
        steps.append("<p>2) Simplificar la expresión cuando sea posible.</p>")
        steps.append("<p>3) Aplicar el método adecuado (por ejemplo, integración por partes, sustitución, series, etc.).</p>")
        steps.append("<p>4) Evaluar resultados y presentar la solución final con verificación numérica si aplica.</p>")
        steps.append("<p>Nota: Esta es una respuesta generada por el servicio. Para resultados numéricos exactos, conectar con un motor simbólico (SymPy) en backend.</p>")
    else:
        # Flujo genérico para diagnóstico y propuesta
        steps.append("<p>1) Resumir el problema y objetivos clave.</p>")
        steps.append("<p>2) Identificar posibles causas raíz mediante 5 Whys / Ishikawa.</p>")
        steps.append("<p>3) Proponer soluciones concretas y priorizadas.</p>")
        steps.append("<p>4) Plan de implementación con métricas y riesgos.</p>")
        steps.append("<p>5) Recomendaciones adicionales (recursos, next steps).</p>")

    return steps

@app.post("/solve")
async def solve(problem: ProblemCreate):
    """Recibe un problema y devuelve una solución generada (mock).

    Respuesta esperada por el frontend:
    {
      "id": "uuid",
      "summary": "resumen breve",
      "content": ["<p> paso 1 </p>", "<p> paso 2 </p>"],
      "created_at": "iso timestamp"
    }
    """
    solution_id = str(uuid4())
    created_at = datetime.datetime.utcnow().isoformat() + "Z"

    content = generate_solution(problem)
    summary = f"Solución generada para '{problem.title}'"

    sol = {
        "id": solution_id,
        "summary": summary,
        "content": content,
        "created_at": created_at,
    }

    SOLUTIONS[solution_id] = sol
    PROBLEMS.insert(0, {"id": solution_id, "title": problem.title, "status": "Resuelto", "created_at": created_at})

    return sol

@app.get("/solve/{solution_id}")
async def get_solution(solution_id: str):
    if solution_id not in SOLUTIONS:
        raise HTTPException(status_code=404, detail="Solution not found")
    return SOLUTIONS[solution_id]

@app.get("/problems")
async def list_problems():
    return PROBLEMS

@app.get("/")
async def root():
    return {"mensaje": "Backend IA disponible. Use POST /solve para generar soluciones."}
