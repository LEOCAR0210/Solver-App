from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

# Definir el modelo de datos para el problema
class Problema(BaseModel):
    descripcion: str
    observaciones: str

# Endpoint para iniciar el análisis
@router.post("/iniciar")
def iniciar_analisis(problema: Problema):
    return {"mensaje": "Análisis iniciado", "problema": problema}

# Modelo para los pasos de 5 Porqués
class Paso(BaseModel):
    numero: int
    respuesta: str

# Endpoint para registrar cada paso
@router.post("/paso")
def siguiente_paso(paso: Paso):
    return {"mensaje": f"Respuesta registrada para el paso {paso.numero}", "respuesta": paso.respuesta}
